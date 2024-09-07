"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  gameState,
  setDroneDirection,
  setCanvasSpeed,
} from "@/redux/slices/gameSlice";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { SPEEDS } from "@/utils/constants";

const Canvas = (props: { caveData: number[][] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const { droneDirection, canvasSpeed } = useAppSelector(gameState);

  const [dronePosition, setDronePosition] = useState<number>(250);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [droneSpeed, setDroneSpeed] = useState<number>(0);
  const [dataChunk, setDataChunk] = useState<number[][] | null>(null);
  const [canvasIntervalId, setCanvasIntervalId] =
    useState<NodeJS.Timeout | null>(null);
  const [droneId, setDroneId] = useState<NodeJS.Timeout | null>(null);

  const dataChunkLength = 50; // canvas h(500) \ wallHeight

  const setCanvasInterval = () => {
    if (canvasIntervalId) clearInterval(canvasIntervalId);
    if (canvasSpeed) {
      const id = setInterval(() => {
        setStartIndex((index) => index + 1);
      }, SPEEDS.find((el) => el.speed === canvasSpeed)?.interval);

      setCanvasIntervalId(id);
    }
  };

  const stopCanvasInterval = () => {
    if (canvasIntervalId) {
      clearInterval(canvasIntervalId);
      setCanvasIntervalId(null);
      dispatch(setCanvasSpeed("stop"));
    }
  };

  const stopGame = () => {
    stopCanvasInterval();
    stopDroneInterval();
  };

  const startGame = () => {
    dispatch(setCanvasSpeed("start"));
    setDroneSpeed(1);
  };

  //  set drone speed
  const setDroneInterval = () => {
    if (droneId) clearInterval(droneId);

    if (droneSpeed) {
      const id = setInterval(() => {
        setDronePosition((position) => position + droneDirection);
      }, SPEEDS.find((el) => el.speed === droneSpeed)?.interval);

      setDroneId(id);
    }
  };

  // stop drone
  const stopDroneInterval = () => {
    if (droneId) {
      clearInterval(droneId);
      setDroneId(null);
      setDroneSpeed(0);
    }
  };

  const getDataChunk = () => {
    const endIndex = startIndex + dataChunkLength;
    const newChunk = props.caveData.slice(startIndex, endIndex);
    setDataChunk(newChunk);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setDroneSpeed((speed) => (speed >= 2 ? speed - 1 : 1));
      dispatch(setDroneDirection(-1));
    } else if (e.key === "ArrowRight") {
      setDroneSpeed((speed) => (speed < 10 ? speed + 1 : 10));
      dispatch(setDroneDirection(1));
    } else if (e.key === "ArrowDown") {
      dispatch(setCanvasSpeed("down"));
    } else if (e.key === "ArrowUp") {
      dispatch(setCanvasSpeed("up"));
    }
  };

  useEffect(() => {
    setDroneInterval();
  }, [droneSpeed, droneDirection]);

  useEffect(() => {
    setCanvasInterval();
  }, [canvasSpeed]);

  useEffect(() => {
    getDataChunk();
  }, [startIndex]);

  useEffect(() => {
    getDataChunk();
    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wallHeight = 10;
    const droneWidth = 10;
    const droneY = 0; // top-0

    // drawing styles
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1;

    const centerX = canvas.width / 2;

    // Clear the canvas before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (dataChunk) {
      if (dataChunk.length === 1) {
        toast.success("Congratulations!");
        console.log("end of cave");
        stopGame();
        return;
      }

      const leftWallPoints: { x: number; y: number }[] = [];
      const rightWallPoints: { x: number; y: number }[] = [];

      // coordinates of the left and right walls
      dataChunk.forEach((el, index) => {
        const left = el[0];
        const right = el[1];
        const xLeft = centerX + left;
        const xRight = centerX + right;
        const y = index * wallHeight;

        leftWallPoints.push({ x: xLeft, y });
        rightWallPoints.push({ x: xRight, y });
      });

      // Draw the left wall by connecting the points
      ctx.beginPath();
      ctx.moveTo(leftWallPoints[0].x, leftWallPoints[0].y);
      leftWallPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Draw the right wall by connecting the points
      ctx.beginPath();
      ctx.moveTo(rightWallPoints[0].x, rightWallPoints[0].y);
      rightWallPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      // Fill the area between the left and right walls
      ctx.beginPath();
      ctx.moveTo(leftWallPoints[0].x, leftWallPoints[0].y);

      // Draw the left wall upwards
      leftWallPoints.forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });

      // Draw the right wall downwards
      for (let i = rightWallPoints.length - 1; i >= 0; i--) {
        ctx.lineTo(rightWallPoints[i].x, rightWallPoints[i].y);
      }

      ctx.closePath();
      ctx.fill();

      // Collision detection
      const droneX = dronePosition; // X-coordinate of the drone

      // Find the wall segment where the drone is located
      const droneRow = Math.floor(droneY / wallHeight);
      if (droneRow < leftWallPoints.length) {
        const leftWallX = leftWallPoints[droneRow].x;
        const rightWallX = rightWallPoints[droneRow].x;

        // Check if the drone is colliding with the walls
        if (
          droneX < leftWallX + droneWidth ||
          droneX + droneWidth > rightWallX
        ) {
          console.log(
            droneX,
            leftWallPoints,
            rightWallX,
            "Collision detected!"
          );
          toast.error("The drone has been destroyed!");
          //stopGame();
        }
      }
    }
  }, [dataChunk]);

  return (
    <div className="relative overflow-hidden w-fit text-center">
      <canvas
        className=" bg-slate-600 border-2 border-black w-[500px]"
        ref={canvasRef}
        width={500}
        height={490}
        {...props}
      />

      <div
        style={{ left: dronePosition + "px" }}
        className={`absolute -top-[5px]  translate-x-[-50%] rotate-45 bg-green-600 h-3 w-3`}
      ></div>
      <button
        onClick={canvasIntervalId ? stopGame : startGame}
        className="p-3 border-2 rounded-md my-5"
      >
        {canvasIntervalId ? "Stop" : "Play"}
      </button>
    </div>
  );
};

export default Canvas;
