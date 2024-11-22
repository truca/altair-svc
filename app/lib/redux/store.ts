import { configureStore } from "@reduxjs/toolkit";
import { pokemonApi } from "./apis/pokemonApi";
import logger from "redux-logger";

const counterReducer = (state = { value: 0 }, action: any) => {
  switch (action.type) {
    case "counter/increment":
      return { value: state.value + 1 };
    case "counter/decrement":
      return { value: state.value - 1 };
    default:
      return state;
  }
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware, logger),
  });
};

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
// setupListeners(store.dispatch);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
