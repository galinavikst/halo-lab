"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  gameState,
  setDroneDirection,
  setCanvasSpeed,
  setStartIndex,
  setUser,
  setInitSlice,
} from "@/redux/slices/gameSlice";
import React, { useRef, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { DRONE_SPEEDS, CANVAS_SPEEDS } from "@/utils/constants";
import { IWallPoints } from "@/utils/types";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";

const Canvas = (props: { caveData: number[][] }) => {
  const { push } = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const dispatch = useAppDispatch();
  const { droneDirection, canvasSpeed, startIndex, user } =
    useAppSelector(gameState);

  const [dronePosition, setDronePosition] = useState<number>(250);
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
        dispatch(setStartIndex());
      }, CANVAS_SPEEDS.find((el) => el.speed === canvasSpeed)?.interval);

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

  const setDroneInterval = () => {
    if (droneId) clearInterval(droneId);

    if (droneSpeed) {
      const id = setInterval(() => {
        setDronePosition((position) => position + droneDirection);
      }, DRONE_SPEEDS.find((el) => el.speed === droneSpeed)?.interval);

      setDroneId(id);
    }
  };

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

  const saveToLocalStorage = () => {
    const savedGames = localStorage.getItem("games");
    if (savedGames) {
      const gamesArray = JSON.parse(savedGames);

      gamesArray.push({
        name: user.name,
        complexity: user.complexity,
        score: getScore(props.caveData),
      });

      localStorage.setItem("games", JSON.stringify(gamesArray));
    } else {
      localStorage.setItem(
        "games",
        JSON.stringify([
          {
            name: user.name,
            complexity: user.complexity,
            score: user.score,
          },
        ])
      );
    }
  };

  const colissionDetection = (
    leftWallPoints: IWallPoints[],
    rightWallPoints: IWallPoints[]
  ) => {
    const droneX = dronePosition; // X-coordinate of the drone
    const droneWidth = 10;
    const wallHeight = 10;
    const droneY = 0; // top-0 absolute

    // Find the wall segment where the drone is located
    const droneRow = Math.floor(droneY / wallHeight);
    if (droneRow < leftWallPoints.length) {
      const leftWallX = leftWallPoints[droneRow].x;
      const rightWallX = rightWallPoints[droneRow].x;

      // Check if the drone is colliding with the walls
      if (droneX < leftWallX + droneWidth || droneX + droneWidth > rightWallX) {
        toast.error("The drone has been destroyed!");
        stopGame();
        backHome();
      }
    }
  };

  const getScore = (arr: number[][]) => {
    const wallSegment = arr.length / 50;
    const score =
      Math.ceil(startIndex / wallSegment) * (user.complexity + canvasSpeed);

    return score.toFixed(2);
  };

  const backHome = () => {
    dispatch(setUser({ ...user, id: null }));
    dispatch(setInitSlice());
    setDataChunk(null);
    push(ROUTES.home);
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
        dispatch(setUser({ ...user, score: getScore(props.caveData) }));
        saveToLocalStorage();
        stopGame();
        backHome();
        return;
      }

      const leftWallPoints: IWallPoints[] = [];
      const rightWallPoints: IWallPoints[] = [];

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

      colissionDetection(leftWallPoints, rightWallPoints);
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
