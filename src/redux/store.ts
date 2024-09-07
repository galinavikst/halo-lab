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

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
