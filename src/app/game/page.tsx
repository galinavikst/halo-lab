import React from "react";
import Game from "@/components/Game";
import Gauges from "@/components/Gauges";

const GamePage = () => {
  return (
    <div className="flex justify-center items-center min-h-dvh">
      <Game />
      <Gauges />
    </div>
  );
};

export default GamePage;
