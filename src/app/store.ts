import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import shiftReducer from "../features/shift/shiftSlice";
import staffReducer from "../features/staff/staffSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shift: shiftReducer,
    staff: staffReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;

export type AppDispatch = typeof store.dispatch;
