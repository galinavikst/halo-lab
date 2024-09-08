"use client";
import { useAppSelector } from "@/redux/hooks";
import { gameState } from "@/redux/slices/gameSlice";
import dynamic from "next/dynamic";
import React from "react";

const GaugeComponent = dynamic(() => import("react-gauge-component"), {
  ssr: false,
});

const Gauges = () => {
  const { droneDirection, canvasSpeed } = useAppSelector(gameState);
  return (
    <div className="flex gap-2 flex-col justify-center items-center">
      <div className="flex justify-center items-center">
        <GaugeComponent
          arc={{
            subArcs: [
              {
                limit: 20,
                color: "#5BE12C",
                showTick: true,
              },
              {
                limit: 40,
                color: "#F5CD19",
                showTick: true,
              },
              {
                limit: 60,
                color: "#e8ab48",
                showTick: true,
              },
              {
                limit: 80,
                color: "#e87848",
                showTick: true,
              },
              {
                limit: 100,
                color: "#EA4228",
                showTick: true,
              },
            ],
            width: 0.5,
          }}
          value={canvasSpeed * 10}
          labels={{
            valueLabel: {
              formatTextValue: (value) => value + " km/h",
              style: { fontSize: "20px" },
            },
            tickLabels: {
              defaultTickValueConfig: {
                formatTextValue: (value: string) => value,
              },
            },
          }}
        />
      </div>
      <div className="flex justify-center items-center">
        <GaugeComponent
          type="radial"
          labels={{
            valueLabel: {
              formatTextValue: (value: string) => String(+value - 50),
            },
            tickLabels: {
              type: "inner",
              defaultTickValueConfig: {
                formatTextValue: (value: string) => {
                  if (+value - 51 > 0) return "rigth";
                  else if (+value - 51 < 0) return "left";
                  else return "";
                },
              },
            },
          }}
          arc={{
            subArcs: [
              { limit: 50, color: "#5BE12C" },
              { limit: 100, color: "#EA4228" },
            ],
            padding: 0.02,
            width: 0.3,
          }}
          pointer={{
            elastic: true,
            animationDelay: 0,
          }}
          value={droneDirection * 10 + 50}
        />
      </div>
    </div>
  );
};

export default Gauges;
