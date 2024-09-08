import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GameState {
  user: {
    name: string;
    id: string | null;
    token: string;
    complexity: number;
    score: number;
  };
  startIndex: number;
  canvasSpeed: number;
  droneDirection: number;
}

const initialState: GameState = {
  user: {
    name: "",
    id: null,
    token: "",
    complexity: 0,
    score: 0,
  },
  startIndex: 0,
  canvasSpeed: 0,
  droneDirection: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },

    setCanvasSpeed: (state, action) => {
      const speed = state.canvasSpeed;
      let newSpeed = 1;
      if (action.payload === "down") {
        newSpeed = speed >= 2 ? speed - 1 : 1;
      } else if (action.payload === "up") {
        newSpeed = speed < 10 ? speed + 1 : 10;
      } else if (action.payload === "stop") {
        newSpeed = 0;
      }
      state.canvasSpeed = newSpeed;
    },

    setDroneDirection: (state, action) => {
      state.droneDirection = action.payload;
    },

    setStartIndex: (state) => {
      state.startIndex = state.startIndex + 1;
    },

    setInitSlice: (state) => {
      state.startIndex = 0;
      state.droneDirection = 0;
      state.canvasSpeed = 0;
    },
  },
});

export const {
  setUser,
  setInitSlice,
  setCanvasSpeed,
  setDroneDirection,
  setStartIndex,
} = gameSlice.actions;

export const gameState = (state: RootState) => state.game;

export default gameSlice.reducer;
