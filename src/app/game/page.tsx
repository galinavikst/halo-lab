import React from "react";
import Game from "@/app/components/Game";
import Gauges from "@/app/components/Gauges";

const GamePage = () => {
  return (
    <div className="flex justify-center items-center min-h-dvh">
      <Game />
      <Gauges />
    </div>
  );
};

export default GamePage;
