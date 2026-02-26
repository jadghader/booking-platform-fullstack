/* eslint-disable @typescript-eslint/no-explicit-any */
// store.ts
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { createBrowserHistory } from "history";
import { createReduxHistoryContext } from "redux-first-history";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // Change this line
import createRootReducer from "./rootReducer";
import { User } from "../auth/auth";

const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({
    history: createBrowserHistory(),
    routerReducerKey: "router",
    savePreviousLocations: 3,
  });

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["auth"],
  blacklist: ["router"],
};

const persistedReducer = persistReducer(
  persistConfig,
  createRootReducer(routerReducer)
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: routerMiddleware,
      },
      serializableCheck: false,
    }).concat(routerMiddleware),
  devTools: true,
});

const persistor = persistStore(store);
const history = createReduxHistory(store);

export { history, store, persistor };

export interface RootState {
  auth: {
    email: any;
    user: User;
    token: string;
  };
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
