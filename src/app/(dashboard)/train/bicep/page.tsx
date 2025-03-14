"use client";
import React, { useEffect, useState, useRef } from "react";
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

// Interface definitions
interface Point {
  x: number;
  y: number;
}

let count: number = 0;

const speech: SpeechSynthesis = window.speechSynthesis;
const speak = (count: number): void => {
  const utterance = new SpeechSynthesisUtterance(count.toString());
  utterance.lang = "en-US";
  if (count === 0) {
    speech.speak(new SpeechSynthesisUtterance("Please Start Again"));
  } else {
    speech.speak(utterance);
  }
};

const BicepCurls: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countTextbox = useRef<HTMLInputElement>(null);
  let camera: cam.Camera | null = null;
  let dir: number = 0;

  useEffect(() => {
    const startTime: Date = new Date();
    const startTimeSec: number = startTime.getSeconds();

    localStorage.setItem("bicepStartTime", startTimeSec.toString());
    console.log(startTime);
  }, []);

  function onResult(results: any): void {
    if (results.poseLandmarks) {
      const position = results.poseLandmarks;
      if (canvasRef.current && webcamRef.current?.video) {
        canvasRef.current.width = webcamRef.current.video.videoWidth;
        canvasRef.current.height = webcamRef.current.video.videoHeight;

        const width: number = canvasRef.current.width;
        const height: number = canvasRef.current.height;

        const leftHand: Point[] = [];
        const rightHand: Point[] = [];
        const righthip: Point[] = [];
        const lefthip: Point[] = [];
        const hiparr: number[] = [11, 12, 23, 24, 25, 26];

        for (let i = 11; i < 17; i++) {
          const obj: Point = {
            x: position[i].x * width,
            y: position[i].y * height,
          };
          if (i % 2 === 0) {
            rightHand.push(obj);
          } else {
            leftHand.push(obj);
          }
        }

        for (let i = 0; i < 6; i++) {
          const p = hiparr[i];
          const obj: Point = {
            x: position[p].x * width,
            y: position[p].y * height,
          };
          if (p % 2 === 0) {
            righthip.push(obj);
          } else {
            lefthip.push(obj);
          }
        }

        const leftHandAngle: number = Math.round(angleBetweenThreePoints(leftHand));
        const rightHandAngle: number = Math.round(angleBetweenThreePoints(rightHand));
        const rightHipAngle: number = Math.round(angleBetweenThreePoints(righthip));
        const leftHipAngle: number = Math.round(angleBetweenThreePoints(lefthip));

        const canvasElement: HTMLCanvasElement = canvasRef.current;
        const canvasCtx: CanvasRenderingContext2D = canvasElement.getContext("2d")!;

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        const inRangeRightHand: boolean = rightHandAngle <= 20;
        const inRangeLeftHand: boolean = leftHandAngle <= 20;
        const inRangeRightHip: boolean = rightHipAngle >= 170 && rightHipAngle <= 180;
        const inRangeLeftHip: boolean = leftHipAngle >= 170 && leftHipAngle <= 180;

        // Draw lines and points (rest of the drawing logic remains similar)
        // ... (keeping the drawing code same with proper type assertions)
        for (let i = 0; i < 2; i++) {
          canvasCtx.beginPath();
          canvasCtx.lineWidth = 8;

          // Right hand
          canvasCtx.moveTo(rightHand[i].x, rightHand[i].y);
          canvasCtx.lineTo(rightHand[i + 1].x, rightHand[i + 1].y);
          canvasCtx.strokeStyle = inRangeRightHand ? "green" : "red";
          canvasCtx.stroke();

          // Left hand
          canvasCtx.beginPath();
          canvasCtx.moveTo(leftHand[i].x, leftHand[i].y);
          canvasCtx.lineTo(leftHand[i + 1].x, leftHand[i + 1].y);
          canvasCtx.strokeStyle = inRangeLeftHand ? "green" : "red";
          canvasCtx.stroke();

          // Right hip
          canvasCtx.beginPath();
          canvasCtx.moveTo(righthip[i].x, righthip[i].y);
          canvasCtx.lineTo(righthip[i + 1].x, righthip[i + 1].y);
          canvasCtx.strokeStyle = inRangeRightHip ? "green" : "red";
          canvasCtx.stroke();

          // Left hip
          canvasCtx.beginPath();
          canvasCtx.moveTo(lefthip[i].x, lefthip[i].y);
          canvasCtx.lineTo(lefthip[i + 1].x, lefthip[i + 1].y);
          canvasCtx.strokeStyle = inRangeLeftHip ? "green" : "red";
          canvasCtx.stroke();
        }

        for (let i = 0; i < 3; i++) {
          canvasCtx.beginPath();
          canvasCtx.arc(rightHand[i].x, rightHand[i].y, 8, 0, Math.PI * 2);
          canvasCtx.arc(leftHand[i].x, leftHand[i].y, 8, 0, Math.PI * 2);
          canvasCtx.fillStyle = "#AAFF00";
          canvasCtx.fill();

          canvasCtx.beginPath();
          canvasCtx.arc(righthip[i].x, righthip[i].y, 8, 0, Math.PI * 2);
          canvasCtx.arc(lefthip[i].x, lefthip[i].y, 8, 0, Math.PI * 2);
          canvasCtx.fillStyle = "#AAFF00";
          canvasCtx.fill();
        }

        // Counter logic
        if (inRangeLeftHand && inRangeRightHand && inRangeRightHip && inRangeLeftHip) {
          if (dir === 0) {
            count = count + 1;
            speak(count);
            dir = 1;
            console.log(count);
          }
        } else {
          dir = 0;
        }

        // Text rendering
        canvasCtx.font = "30px aerial";
        canvasCtx.fillText(`${leftHandAngle}`, leftHand[1].x + 20, leftHand[1].y + 20);
        canvasCtx.fillText(`${rightHandAngle}`, rightHand[1].x - 120, rightHand[1].y + 20);
        canvasCtx.fillText(`${leftHipAngle}`, lefthip[1].x + 20, lefthip[1].y + 20);
        canvasCtx.fillText(`${leftHipAngle}`, lefthip[1].x - 120, lefthip[1].y + 20);

        canvasCtx.restore();
      }
    }
  }

  useEffect(() => {
    const pose = new Pose({
      locateFile: (file: string) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675471629/${file}`; // Latest version as of now
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    const startCamera = async () => {
      try {
        // Ensure webcam permission
        await navigator.mediaDevices.getUserMedia({ video: true });
        const videoElement = webcamRef.current?.video;
        if (videoElement instanceof HTMLVideoElement) {
          // Wait for video to be ready
          await new Promise<void>((resolve) => {
            videoElement.onloadedmetadata = () => resolve();
          });

          if (videoElement.readyState >= 2) {
            camera = new cam.Camera(videoElement, {
              onFrame: async () => {
                if (countTextbox.current) {
                  countTextbox.current.value = count.toString();
                }
                try {
                  await pose.send({ image: videoElement });
                } catch (error) {
                  console.error("Pose detection error:", error);
                }
              },
              width: 640,
              height: 480,
            });
            await camera.start();
          }
        }
      } catch (error) {
        console.error("Camera setup error:", error);
      }
    };

    startCamera();

    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, []);
  function resetCount(): void {
    console.log("clicked");
    count = 0;
  }

  const handleClick = (): void => {
    const ID: string | undefined = Cookies.get("userID");
    if (ID) {
      const docRef = doc(db, `user/${ID}/bicepsCurls`, uuidv4());
      const startTimeStamp: string | null = localStorage.getItem("bicepStartTime");
      const endTimeVar: Date = new Date();
      const endTimeStamp: number = endTimeVar.getSeconds();
      const timeSpent: number = endTimeStamp - (parseInt(startTimeStamp || "0"));

      setDoc(docRef, {
        reps: count,
        exceriseName: "Biceps",
        startTimeStamp: startTimeStamp,
        endTimeStamp: endTimeStamp,
        timeSpent: Math.abs(timeSpent),
        uid: ID,
      }).then(() => console.log("Document written"));
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
      <Box
        sx={{
          display: "flex",
          position: "relative",
          borderRadius: "2rem",
          width: "100%",
        }}
      >
        <Webcam
          ref={webcamRef}
          className="full-width"
          videoConstraints={{ width: 640, height: 480 }}
          onUserMedia={() => console.log("Webcam stream started")}
        />
        <canvas ref={canvasRef} className="full-width" style={{ position: "absolute" }} />
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffff",
          borderRadius: "2rem",
          width: { lg: "40%", xs: "100%" },
        }}
      >
        <Typography variant="h4" color="primary" style={{ textTransform: "capitalize" }}>
          BicepCurls
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
        <br />
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
              padding: "1rem",
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
              borderRadius: "2rem",
            }}
          >
            <Button
              color="primary"
              onClick={resetCount}
            >
              Reset Counter
            </Button>
            {/* <Link to="/workout" style={{ textDecoration: "none", color: "white" }}> */}
            <Button
              color="primary"
              onClick={handleClick}
            >
              Back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container >
  );
};

export default BicepCurls;