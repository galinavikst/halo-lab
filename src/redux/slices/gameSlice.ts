import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GameState {
  user: {
    name: string;
    id: string | null;
    token: string;
    complexity: number;
  };
}

const initialState: GameState = {
  user: {
    name: "",
    id: null,
    token: "",
    complexity: 0,
  },
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = gameSlice.actions;

export const gameState = (state: RootState) => state.game;

export default gameSlice.reducer;
