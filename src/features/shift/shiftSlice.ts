import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import {
  READ_SHIFT,
  POST_SHIFT,
  READ_STAFF,
  POST_STAFF,
  PUT_STAFF,
  SHIFT_STATE,
} from "../types";

export const fetchAsyncGetShifts = createAsyncThunk(
  "shift/getShift",
  async () => {
    const res = await axios.get<READ_SHIFT[]>(
      `${process.env.REACT_APP_API_URL}/api/shift`,
      {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncCreateShift = createAsyncThunk(
  "shift/createShift",
  async (shift: POST_SHIFT) => {
    const res = await axios.post<READ_SHIFT>(
      `${process.env.REACT_APP_API_URL}/api/shift/`,
      shift,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncUpdateShift = createAsyncThunk(
  "shift/updateShift",
  async (shift: POST_SHIFT) => {
    const res = await axios.put<READ_SHIFT>(
      `${process.env.REACT_APP_API_URL}/api/shift/${shift.id}/`,
      shift,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return res.data;
  }
);

export const fetchAsyncDeleteShift = createAsyncThunk(
  "shift/deleteShift",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/shift/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

const initialState: SHIFT_STATE = {
  shifts: [
    {
      id: 0;
      owner: 0;
      shift_date: "";
      shift_start: 0;
      shift_end: "";
      staff: "";
      staff_name: "";
      staff_is_active: true;
      created_at: "";
      updated_at: "";
    },
  ],
  editedShift: {
    id: 0;
    shift_date: "";
    shift_start: 0;
    shift_end: "";
    staff: "";
  },
  selectedShift: {
    id: 0;
    owner: 0;
    shift_date: "";
    shift_start: 0;
    shift_end: "";
    staff: "";
    staff_name: "";
    staff_is_active: true;
    created_at: "";
    updated_at: "";
  },
  staff: [
    {
      id: 0;
      owner: 0;
      staff_name: "";
      is_active: true;
      created_at: "";
      updated_at: "";
    }
  ],
}
export const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    editShift(state, action: PayloadAction<POST_SHIFT>){
      state.editedShift = action.payload;
    },
    selectShift(state, action: PayloadAction<READ_SHIFT>){
      state.selectedShift = action.payload;
    }
  }
})

export const { editShift, selectShift } = shiftSlice.actions;

export default shiftSlice.reducer;