"use client";
import React, { useRef, useEffect, useState } from "react";

const Canvas = (props: { caveData: number[][] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dronePosition, setDronePosition] = useState<number>(250);
  const [droneDirection, setDroneDirection] = useState<number>(1);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [droneSpeed, setDroneSpeed] = useState<number>(0);
  const [canvasSpeedInterval, setCanvasSpeedInterval] = useState<number | null>(
    null
  );
  const [dataChunk, setDataChunk] = useState<number[][] | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const [droneId, setDroneId] = useState<NodeJS.Timeout | null>(null);

  const speeds = [
    {
      speed: 1,
      interval: 800,
    },
    {
      speed: 2,
      interval: 500,
    },
    {
      speed: 3,
      interval: 450,
    },
    {
      speed: 4,
      interval: 400,
    },
    {
      speed: 5,
      interval: 350,
    },
    {
      speed: 6,
      interval: 300,
    },
    {
      speed: 7,
      interval: 250,
    },
    {
      speed: 8,
      interval: 200,
    },
    {
      speed: 9,
      interval: 100,
    },
    {
      speed: 10,
      interval: 50,
    },
  ];
  const wallHeight = 10;
  const dataChunkLength = 50; // canvas h(500) \ wallHeight

  const startGame = () => {
    if (intervalId) clearInterval(intervalId);
    if (droneId) clearInterval(droneId);

    if (canvasSpeedInterval) {
      const id = setInterval(() => {
        setStartIndex((index) => index + 1);
      }, canvasSpeedInterval);

      setIntervalId(id);
    }
  };

  const stopGame = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setCanvasSpeedInterval(null);
    }

    stopDroneInterval();
  };

  //  set drone speed
  const setDroneInterval = () => {
    if (droneId) clearInterval(droneId);

    if (droneSpeed) {
      const id = setInterval(() => {
        setDronePosition((position) => position + droneDirection);
        console.log(droneSpeed);
      }, speeds.find((el) => el.speed === droneSpeed)?.interval);

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

  const handleKeyBoard = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setDroneSpeed((speed) => (speed >= 2 ? speed - 1 : 1));
      setDroneDirection(-1);
    } else if (e.key === "ArrowRight") {
      setDroneSpeed((speed) => (speed < 10 ? speed + 1 : 10));
      setDroneDirection(1);
    } else if (e.key === "ArrowDown") {
      setCanvasSpeedInterval((state) => (state as number) + 100);
    } else if (e.key === "ArrowUp") {
      setCanvasSpeedInterval((state) => (state as number) - 100);
    }
  };

  useEffect(() => {
    setDroneInterval();
  }, [droneSpeed, droneDirection]);

  useEffect(() => {
    startGame();
  }, [canvasSpeedInterval]);

  useEffect(() => {
    getDataChunk();
  }, [startIndex]);

  useEffect(() => {
    getDataChunk();
    document.addEventListener("keydown", handleKeyBoard);

    return () => {
      document.removeEventListener("keydown", handleKeyBoard);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";

    const centerX = canvas.width / 2;

    // clear before drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    dataChunk &&
      dataChunk.forEach((el, index) => {
        let left = el[0];
        let right = el[1];
        let x;
        let width;

        x = centerX + left;
        width = right - left;

        if (right < left) {
          width = left - right;
        }

        ctx.fillRect(x, index * wallHeight, width, wallHeight); // Increment Y position for each row
      });
  }, [dataChunk]);

  return (
    <div className="relative overflow-hidden w-fit text-center">
      <canvas
        className=" bg-slate-600 border-2 border-black w-[500px]"
        ref={canvasRef}
        width={500}
        height={500}
        {...props}
      />

      <div
        style={{ left: dronePosition + "px" }}
        className={`absolute -top-[5px]  translate-x-[-50%] rotate-45 bg-green-600 h-3 w-3`}
      ></div>
      <button
        onClick={
          intervalId
            ? stopGame
            : () => {
                setDroneSpeed(1);
                setCanvasSpeedInterval(1000);
              }
        }
        className="p-3 border-2 rounded-md my-5"
      >
        {intervalId ? "Stop" : "Play"}
      </button>
    </div>
  );
};

export default Canvas;
