"use client";
import {
  useAddUserMutation,
  useLazyGetTokenChunkQuery,
} from "@/redux/slices/apiSlice";
import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";
import { Oval } from "react-loader-spinner";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { gameState, setUser } from "@/redux/slices/gameSlice";
import Gauges from "./Gauges";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const Game = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(gameState);

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);

    let token = "";
    const chunks = 4;

    for (let i = 1; i <= chunks; i++) {
      const { data } = await trigger({ chunkNo: i, id });
      token += data?.chunk || "";
    }

    dispatch(setUser({ ...user, id, token }));
  };

  // wsocket connection handling
  useEffect(() => {
    if (!user.id) return;

    const ws = new WebSocket(WS_URL as string);

    ws.onopen = () => {
      setIsLoading(true);

      setConnectionStatus("connected");

      ws.send(`player:${user.id}-${user.token}`); // player authentication data
    };

    ws.onmessage = (event) => {
      const message = event.data;

      if (message === "Player not found") {
        setConnectionStatus(message);
        setIsLoading(false);
        ws.close();
      }

      if (message === "finished") {
        setIsLoading(false);
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
      setIsLoading(false);
    };

    ws.onclose = () => {
      ws.close();
      setIsLoading(false);
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
          <div>
            {user.name}, complexity: {user.complexity}
          </div>
          <Gauges />
          <Canvas caveData={caveData} />
        </>
      ) : (
        <p>
          {connectionStatus}
          {connectionStatus === "Player not found" && " -> reload page"}
        </p>
      )}
      {isLoading && (
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
