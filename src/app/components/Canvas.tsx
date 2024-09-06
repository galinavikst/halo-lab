"use client";
import React, { useRef, useEffect, useState } from "react";

const Canvas = (props: { caveData: number[][] }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dronePosition, setDronePosition] = useState<number>(250);
  const [startIndex, setStartIndex] = useState<number>(0);
  const [speedInterval, setSpeedInterval] = useState<number | null>(null);
  const [dataChunk, setDataChunk] = useState<number[][] | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const wallHeight = 10;
  const dataChunkLength = 50; // canvas h \ wallHeight

  console.log(speedInterval);

  // Function to start the interval
  const startInterval = () => {
    if (intervalId) clearInterval(intervalId);

    if (speedInterval) {
      const id = setInterval(() => {
        setStartIndex((index) => index + 1);
      }, speedInterval);

      setIntervalId(id);
    }
  };

  // Function to stop the interval (optional)
  const stopInterval = () => {
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
      setSpeedInterval(null);
    }
  };

  const getDataChunk = () => {
    const endIndex = startIndex + dataChunkLength;
    const newChunk = props.caveData.slice(startIndex, endIndex);
    setDataChunk(newChunk);
  };

  const handleKeyBoard = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      setDronePosition((prev) => prev - 1);
    } else if (e.key === "ArrowRight") {
      setDronePosition((prev) => prev + 1);
    } else if (e.key === "ArrowDown") {
      setSpeedInterval((state) => (state as number) + 100);
    } else if (e.key === "ArrowUp") {
      setSpeedInterval((state) => (state as number) - 100);
    }
  };

  useEffect(() => {
    startInterval();
  }, [speedInterval]);

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
    <div className="relative overflow-hidden w-fit">
      <canvas
        className=" bg-slate-600 border-2 border-black"
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
        onClick={intervalId ? stopInterval : () => setSpeedInterval(1000)}
        className="p-3 border-2 rounded-md my-5"
      >
        {intervalId ? "Stop" : "Play"}
      </button>
    </div>
  );
};

export default Canvas;
