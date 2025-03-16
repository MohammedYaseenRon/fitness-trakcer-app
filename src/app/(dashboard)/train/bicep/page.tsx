"use client";
import React, { useEffect, useRef } from "react";
import { Pose } from "@mediapipe/pose";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import angleBetweenThreePoints from "@/components/angle";
import { Button } from "@/components/ui/button";
import { Container, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { setDoc, doc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../../../firebase";
import Cookies from "js-cookie";

interface Point {
  x: number;
  y: number;
}

let count: number = 0;
let dir: number = 0;

const speech: SpeechSynthesis = window.speechSynthesis;
const speak = (count: number): void => {
  const object: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(count.toString());
  object.lang = "en-US";
  speech.speak(object);
};

interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

interface PoseResults {
  poseLandmarks?: NormalizedLandmark[];
}



const BicepCurls: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countTextbox = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<cam.Camera | null>(null);

  useEffect(() => {
    const startTime: Date = new Date();
    const startTimeSec: number = startTime.getSeconds();
    localStorage.setItem("bicepStartTime", startTimeSec.toString());
    console.log("Start time:", startTime);
  }, []);

  const onResult = (results: PoseResults): void => {
    if (results.poseLandmarks && canvasRef.current && webcamRef.current?.video) {
      const canvas = canvasRef.current;
      const video = webcamRef.current.video;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const width = canvas.width;
      const height = canvas.height;

      const leftHand: Point[] = [];
      const rightHand: Point[] = [];
      const rightHip: Point[] = [];
      const leftHip: Point[] = [];
      const hipArr: number[] = [11, 12, 23, 24, 25, 26];

      for (let i = 11; i < 17; i++) {
        const point: Point = {
          x: results.poseLandmarks[i].x * width,
          y: results.poseLandmarks[i].y * height,
        };
        if (i % 2 === 0) rightHand.push(point);
        else leftHand.push(point);
      }

      for (let i = 0; i < 6; i++) {
        const idx = hipArr[i];
        const point: Point = {
          x: results.poseLandmarks[idx].x * width,
          y: results.poseLandmarks[idx].y * height,
        };
        if (idx % 2 === 0) rightHip.push(point);
        else leftHip.push(point);
      }

      const leftHandAngle = Math.round(angleBetweenThreePoints(leftHand));
      const rightHandAngle = Math.round(angleBetweenThreePoints(rightHand));
      const rightHipAngle = Math.round(angleBetweenThreePoints(rightHip));
      const leftHipAngle = Math.round(angleBetweenThreePoints(leftHip));

      const inRangeRightHand = rightHandAngle <= 20;
      const inRangeLeftHand = leftHandAngle <= 20;
      const inRangeRightHip = rightHipAngle >= 170 && rightHipAngle <= 180;
      const inRangeLeftHip = leftHipAngle >= 170 && leftHipAngle <= 180;

      ctx.lineWidth = 8;
      for (let i = 0; i < 2; i++) {
        ctx.beginPath();
        ctx.moveTo(rightHand[i].x, rightHand[i].y);
        ctx.lineTo(rightHand[i + 1].x, rightHand[i + 1].y);
        ctx.strokeStyle = inRangeRightHand ? "green" : "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leftHand[i].x, leftHand[i].y);
        ctx.lineTo(leftHand[i + 1].x, leftHand[i + 1].y);
        ctx.strokeStyle = inRangeLeftHand ? "green" : "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rightHip[i].x, rightHip[i].y);
        ctx.lineTo(rightHip[i + 1].x, rightHip[i + 1].y);
        ctx.strokeStyle = inRangeRightHip ? "green" : "red";
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(leftHip[i].x, leftHip[i].y);
        ctx.lineTo(leftHip[i + 1].x, leftHip[i + 1].y);
        ctx.strokeStyle = inRangeLeftHip ? "green" : "red";
        ctx.stroke();
      }

      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(rightHand[i].x, rightHand[i].y, 8, 0, Math.PI * 2);
        ctx.arc(leftHand[i].x, leftHand[i].y, 8, 0, Math.PI * 2);
        ctx.arc(rightHip[i].x, rightHip[i].y, 8, 0, Math.PI * 2);
        ctx.arc(leftHip[i].x, leftHip[i].y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "#AAFF00";
        ctx.fill();
      }

      if (inRangeLeftHand && inRangeRightHand && inRangeRightHip && inRangeLeftHip) {
        if (dir === 0) {
          count += 1;
          speak(count);
          dir = 1;
          if (countTextbox.current) countTextbox.current.value = count.toString();
          console.log("Count:", count);
        }
      } else {
        dir = 0;
      }

      ctx.font = "30px Arial";
      ctx.fillStyle = "white";
      ctx.fillText(`${leftHandAngle}`, leftHand[1].x + 20, leftHand[1].y + 20);
      ctx.fillText(`${rightHandAngle}`, rightHand[1].x - 120, rightHand[1].y + 20);
      ctx.fillText(`${leftHipAngle}`, leftHip[1].x + 20, leftHip[1].y + 20);
      ctx.fillText(`${rightHipAngle}`, rightHip[1].x - 120, rightHip[1].y + 20);

      ctx.restore();
    }
  };

  useEffect(() => {
    if (!webcamRef.current || !webcamRef.current.video) return;
      const pose: Pose = new Pose({
        locateFile: (file: string): string => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    // Initialize pose model
    pose.initialize().catch((error) => {
      console.error("Pose initialization failed:", error);
    });

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = webcamRef.current?.video;
        if (videoElement instanceof HTMLVideoElement) {
          videoElement.srcObject = stream;
          await new Promise<void>((resolve) => {
            videoElement.onloadedmetadata = () => {
              console.log("Video metadata loaded");
              resolve();
            };
          });

          if (videoElement.readyState >= 2) {
            cameraRef.current = new cam.Camera(videoElement, {
              onFrame: async () => {
                try {
                  await pose.send({ image: videoElement });
                } catch (error) {
                  console.error("Pose detection error:", error);
                }
              },
              width: 640,
              height: 480,
            });
            await cameraRef.current.start();
            console.log("Camera started");
          } else {
            console.error("Video not ready");
          }
        }
      } catch (error) {
        console.error("Camera setup error:", error);
      }
    };

    startCamera();

    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
        console.log("Camera stopped");
      }
      const videoElement = webcamRef.current?.video;
      if (videoElement?.srcObject instanceof MediaStream) {
        videoElement.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const resetCount = (): void => {
    count = 0;
    if (countTextbox.current) countTextbox.current.value = "0";
    console.log("Counter reset");
  };

  const handleClick = (): void => {
    const ID = Cookies.get("userID");
    if (ID) {
      const docRef = doc(db, `user/${ID}/bicepsCurls`, uuidv4());
      const startTimeStamp = localStorage.getItem("bicepStartTime");
      const endTimeVar = new Date();
      const endTimeStamp = endTimeVar.getSeconds();
      const timeSpent = endTimeStamp - (parseInt(startTimeStamp || "0"));

      setDoc(docRef, {
        reps: count,
        exerciseName: "Biceps",
        startTimeStamp,
        endTimeStamp,
        timeSpent: Math.abs(timeSpent),
        uid: ID,
      })
        .then(() => console.log("Document written"))
        .catch((error) => console.error("Firestore error:", error));
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "space-around",
        marginTop: "2rem",
        flexDirection: { lg: "row", xs: "column" },
        gap: "2rem",
      }}
    >
      <Box sx={{ display: "flex", position: "relative", borderRadius: "2rem", width: "100%" }}>
        <Webcam
          ref={webcamRef}
          className="full-width"
          videoConstraints={{ width: 640, height: 480, facingMode: "user" }}
          onUserMedia={() => console.log("Webcam stream started")}
          style={{ borderRadius: "2rem" }}
        />
        <canvas
          ref={canvasRef}
          className="full-width"
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#fff",
          borderRadius: "2rem",
          width: { lg: "40%", xs: "100%" },
          padding: "1rem",
        }}
      >
        <Typography variant="h4" color="primary" sx={{ textTransform: "capitalize" }}>
          Bicep Curls
        </Typography>
        <Box
          sx={{
            width: "50%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src="/Assets/bicep.gif" width="100%" alt="Biceps Curls" />
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "2rem",
            padding: "1rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Typography variant="h6" color="secondary">
              Count
            </Typography>
            <input
              ref={countTextbox}
              value={count}
              style={{
                height: 50,
                fontSize: 20,
                width: 80,
                padding: "1rem",
                border: "2px solid orange",
                borderRadius: "10px",
                textAlign: "center",
              }}
              readOnly
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Button variant="default" onClick={resetCount}>
              Reset Counter
            </Button>
            <Button variant="default" onClick={handleClick}>
              Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default BicepCurls;