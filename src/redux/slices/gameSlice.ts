import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface GameState {
  value: number;
}

const initialState: GameState = {
  value: 0,
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = gameSlice.actions;

export const gameState = (state: RootState) => state.game;

export default gameSlice.reducer;
