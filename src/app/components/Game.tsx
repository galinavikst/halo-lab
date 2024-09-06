"use client";
import {
  useAddUserMutation,
  useLazyGetTokenChunkQuery,
} from "@/redux/slices/apiSlice";
import React, { useEffect, useState } from "react";
import Canvas from "./Canvas";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

const Game = () => {
  const [user, setUser] = useState<{ id: string; token: string } | null>(null);
  const [caveData, setCaveData] = useState<number[][]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>("");

  const [addUser] = useAddUserMutation();
  const [trigger] = useLazyGetTokenChunkQuery();

  // Initialize user
  useEffect(() => {
    const initiateGame = async () => {
      try {
        const resp = await addUser({
          name: "test",
          complexity: 1,
        }).unwrap();
        getUserToken(resp.id);
      } catch (error) {
        console.error("Error during user initiation:", error);
      }
    };

    if (!user) {
      initiateGame();
    }
  }, [user, addUser]);

  const getUserToken = async (id: string) => {
    let userToken = "";
    const chunks = 4;

    for (let i = 1; i <= chunks; i++) {
      const { data } = await trigger({ chunkNo: i, id });
      userToken += data?.chunk || "";
    }

    setUser({ id, token: userToken });
  };

  // WebSocket connection handling
  useEffect(() => {
    if (!user) return;

    console.log(user);

    const ws = new WebSocket(WS_URL as string);

    ws.onopen = () => {
      setConnectionStatus("connected");
      const playerAuthMessage = `player:${user.id}-${user.token}`;
      ws.send(playerAuthMessage); // player authentication data
    };

    ws.onmessage = (event) => {
      const message = event.data;

      if (message === "finished") {
        setConnectionStatus(message);
        ws.close();
      } else {
        const wallChunk = message.split(",").map(Number);
        setCaveData((prevData) => [...prevData, wallChunk]);
      }
    };

    // ws.onerror = (error) => {
    //   console.error("WebSocket error:", error);
    //   setConnectionStatus("error");
    // };

    // ws.onclose = () => {
    //   ws.close();
    // };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [user]);

  return (
    <div>
      <h1>Game</h1>
      {connectionStatus === "finished" && caveData && (
        <Canvas caveData={caveData} />
      )}
    </div>
  );
};

export default Game;
