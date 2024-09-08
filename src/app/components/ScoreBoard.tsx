"use client";
import { IWinner } from "@/utils/types";
import React, { useEffect, useState } from "react";

const ScoreBoard = () => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const string = localStorage.getItem("games");
    const savedGames = string ? JSON.parse(string) : [];
    const orderedGames = savedGames.sort(
      (a: IWinner, b: IWinner) => b.score - a.score
    );
    setGames(orderedGames);
  }, []);

  return (
    <div className="m-4 px-3 flex flex-col gap-5">
      <h1>ScoreBoard</h1>
      {games.length ? (
        <ul className="flex flex-col gap-3">
          {games.map((el: IWinner, index: number) => (
            <li
              key={index}
              className="flex gap-5 p-5 rounded-lg shadow bg-slate-100"
            >
              <span>{index + 1}.</span>
              <span>Player: {el.name}</span>
              <span> Complexity: {el.complexity}</span>
              <span>score: {el.score}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No winners yet...</p>
      )}
    </div>
  );
};

export default ScoreBoard;
