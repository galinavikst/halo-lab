import { configureStore } from "@reduxjs/toolkit";
import gameReducer from "@/redux/slices/gameSlice";
import { gameApi } from "./slices/apiSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer,
      [gameApi.reducerPath]: gameApi.reducer,
    },

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(gameApi.middleware),
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
