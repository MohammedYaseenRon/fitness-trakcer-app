"use client";
import React, { useState, useEffect, useRef } from "react";
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
import imgURL from "../assets/images/Crunch.gif";

// Define interfaces
interface Point {
  x: number;
  y: number;
}

interface ExerciseInfo {
  index: number[];
  ul: number;
  ll: number;
}

interface PoseResults {
  poseLandmarks?: {
    x: number;
    y: number;
  }[];
}

interface CounterProps {
  exercise: string;
}

// Exercise configuration
const exrInfo: { [key: string]: ExerciseInfo } = {
  crunches: {
    index: [12, 24, 26],
    ul: 130,
    ll: 50,
  },
};

let count: number = 0;
let dir: number = 0;
let angle: number = 0;

const speech: SpeechSynthesis = window.speechSynthesis;
const speak = (count: number): void => {
  const object: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(count.toString());
  object.lang = "en-US";
  speech.speak(object);
};

const Counter: React.FC<CounterProps> = (props) => {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const countTextbox = useRef<HTMLInputElement>(null);
  const previousValue = useRef<string>("");
  let camera: cam.Camera | null = null;

  // Get Time
  useEffect(() => {
    const startTime: Date = new Date();
    const startTimeSec: number = startTime.getSeconds();

    localStorage.setItem("crunchesStartTime", startTimeSec.toString());
    console.log(startTime);
  }, []);

  function onResult(results: PoseResults): void {
    if (results.poseLandmarks && canvasRef.current && webcamRef.current?.video) {
      const position = results.poseLandmarks;

      // Set height and width of canvas
      canvasRef.current.width = webcamRef.current.video.videoWidth;
      canvasRef.current.height = webcamRef.current.video.videoHeight;

      const width: number = canvasRef.current.width;
      const height: number = canvasRef.current.height;

      // Convert ratios to pixel positions
      const updatedPos: Point[] = [];
      const indexArray: number[] = exrInfo[props.exercise].index;

      for (let i = 0; i < 3; i += 1) {
        updatedPos.push({
          x: position[indexArray[i]].x * width,
          y: position[indexArray[i]].y * height,
        });
      }

      angle = Math.round(angleBetweenThreePoints(updatedPos));

      // Count reps
      if (angle > exrInfo[props.exercise].ul) {
        if (dir === 0) {
          console.log(count, " ", dir, " decrement ", angle);
          dir = 1;
        }
      }
      if (angle < exrInfo[props.exercise].ll) {
        if (dir === 1) {
          count = count + 1;
          speak(count);
          console.log(count, " ", dir, " increment ", angle);
          dir = 0;
        }
      }

      const canvasElement: HTMLCanvasElement = canvasRef.current;
      const canvasCtx: CanvasRenderingContext2D | null = canvasElement.getContext("2d");

      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Draw lines
        for (let i = 0; i < 2; i++) {
          canvasCtx.beginPath();
          canvasCtx.moveTo(updatedPos[i].x, updatedPos[i].y);
          canvasCtx.lineTo(updatedPos[i + 1].x, updatedPos[i + 1].y);
          canvasCtx.lineWidth = 2;
          canvasCtx.strokeStyle = "white";
          canvasCtx.stroke();
        }

        // Draw points
        for (let i = 0; i < 3; i++) {
          canvasCtx.beginPath();
          canvasCtx.arc(updatedPos[i].x, updatedPos[i].y, 10, 0, Math.PI * 2);
          canvasCtx.fillStyle = "#AAFF00";
          canvasCtx.fill();
        }

        // Draw angle
        canvasCtx.font = "40px aerial";
        canvasCtx.fillText(`${angle}`, updatedPos[1].x + 10, updatedPos[1].y + 40);
        canvasCtx.restore();
      }
    }
  }

  const [cameraWidth, setCamera] = useState<string>("");

  useEffect(() => {
    console.log("rendered");
    count = 0;
    dir = 0;

    if (!webcamRef.current || !webcamRef.current.video) return;
    const pose: Pose = new Pose({
      locateFile: (file: string): string => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      },
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.5,
    });

    pose.onResults(onResult);

    if (webcamRef.current?.video) {
      camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (countTextbox.current) {
            countTextbox.current.value = count.toString();
          }
          if (webcamRef.current?.video) {
            await pose.send({ image: webcamRef.current.video });
          }
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }

    // Cleanup
    return () => {
      if (camera) {
        camera.stop();
      }
    };
  }, [props.exercise]); // Add props.exercise as dependency if it can change

  function resetCount(): void {
    console.log("clicked");
    count = 0;
    dir = 0;
  }

  const handleClick = (): void => {
    const ID: string | undefined = Cookies.get("userID");
    if (ID) {
      const docRef = doc(db, `user/${ID}/crunches`, uuidv4());
      const startTimeStamp: string | null = localStorage.getItem("crunchesStartTime");
      const endTimeVar: Date = new Date();
      const endTimeStamp: number = endTimeVar.getSeconds();
      const timeSpent: number = startTimeStamp ? endTimeStamp - parseInt(startTimeStamp) : 0;

      setDoc(docRef, {
        reps: count,
        startTimeStamp: startTimeStamp || "",
        endTimeStamp: endTimeStamp,
        timeSpent: Math.abs(timeSpent),
        exceriseName: "Crunches",
        uid: ID,
      })
        .then(() => console.log("Document written successfully"))
        .catch((error) => console.error("Error writing document: ", error));
    }
  };

  return (
    <Container
      maxWidth="lg"
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
        <Webcam ref={webcamRef} className="full-width" />
        <canvas
          ref={canvasRef}
          className="full-width"
          style={{
            position: "absolute",
          }}
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
        }}
      >
        <Typography
          variant="h4"
          color="primary"
          style={{ textTransform: "capitalize" }}
        >
          Crunches
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
          <img src="/Assets/Crunch.gif" width="100%" alt="Crunches" />
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
            <Button

              color="primary"
              onClick={handleClick}
            >
              back
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Counter;