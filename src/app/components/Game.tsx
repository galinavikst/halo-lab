"use client";
import {
  useAddUserMutation,
  useLazyGetTokenChunkQuery,
} from "@/redux/slices/apiSlice";
import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { Oval } from "react-loader-spinner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gameState, setInitSlice, setUser } from "@/redux/slices/gameSlice";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const Game = () => {
  const { push } = useRouter();
  const dispatch = useAppDispatch();
  const { user, startIndex, canvasSpeed } = useAppSelector(gameState);

  const [caveData, setCaveData] = useState<number[][]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  const [addUser] = useAddUserMutation();
  const [trigger] = useLazyGetTokenChunkQuery();

  // Initialize user
  useEffect(() => {
    const initiateGame = async () => {
      try {
        const resp = await addUser({
          name: user.name,
          complexity: user.complexity,
        }).unwrap();
        if (!user.id) getUserToken(resp.id);
      } catch (error) {
        console.error(error);
      }
    };

    if (!user.id) {
      initiateGame();
    }
  }, [user, addUser]);

  const getUserToken = async (id: string) => {
    let token = "";
    const chunks = 4;

    for (let i = 1; i <= chunks; i++) {
      const { data } = await trigger({ chunkNo: i, id });
      token += data?.chunk || "";
    }

    dispatch(setUser({ ...user, id, token }));
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
    push(ROUTES.home);
  };

  // wsocket connection handling
  useEffect(() => {
    if (!user.id) return;

    const ws = new WebSocket(WS_URL as string);

    ws.onopen = () => {
      setConnectionStatus("connected");
      ws.send(`player:${user.id}-${user.token}`); // player authentication data
    };

    ws.onmessage = (event) => {
      const message = event.data;

      if (message === "Player not found") {
        setConnectionStatus(message);
        backHome();
        ws.close();
      }

      if (message === "finished") {
        setConnectionStatus(message);
        ws.close();
      } else {
        const wallChunk = message.split(",").map(Number);
        setCaveData((prevData) => [...prevData, wallChunk]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus("error");
      backHome();
    };

    ws.onclose = () => {
      ws.close();
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  return (
    <div className="w-[500px]">
      {caveData.length >= 50 ? (
        <>
          <div className="flex gap-3 justify-between">
            <span>Name: {user.name}</span>
            <span>Complexity: {user.complexity}</span>
            <span>
              Score:
              {(connectionStatus === "finished" && getScore(caveData)) || 0}
            </span>
          </div>
          <Canvas caveData={caveData} />
        </>
      ) : (
        <p>
          {connectionStatus}
          {connectionStatus === "Player not found " && (
            <button className="rounded-lg bg-slate-100" onClick={backHome}>
              Back to Home
            </button>
          )}
        </p>
      )}
      {caveData.length < 50 && (
        <div className="w-fit m-auto p-10">
          <Oval
            visible={true}
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="oval-loading"
          />
        </div>
      )}
    </div>
  );
};

export default Game;
