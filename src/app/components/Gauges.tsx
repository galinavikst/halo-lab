import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/slices/gameSlice";
import React from "react";

const Gauges = () => {
  const { droneDirection, canvasSpeed } = useAppSelector(gameState);
  return (
    <div>
      <p> droneDirection: {droneDirection}</p>
      <p> canvas speed: {canvasSpeed}</p>
    </div>
  );
};

export default Gauges;
