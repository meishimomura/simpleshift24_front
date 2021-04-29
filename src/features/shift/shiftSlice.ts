import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { READ_SHIFT, POST_SHIFT, SHIFT_STATE, DATE_STATE } from "../types";

import format from "date-fns/format";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";

export const fetchAsyncGetShifts = createAsyncThunk(
  "shift/getShift",
  async (date: DATE_STATE) => {
    const res = await axios.get<READ_SHIFT[]>(
      `${process.env.REACT_APP_API_URL}/api/shift/?shift_date_after=${format(
        date.startDate,
        "y-M-d"
      )}&shift_date_before=${format(date.endDate, "y-M-d")}`,
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

export const initialState: SHIFT_STATE = {
  shifts: [
    {
      id: 0,
      owner: 0,
      shift_date: "",
      shift_start: "",
      shift_end: "",
      staff: 0,
      staff_name: "",
      staff_is_active: true,
      lane: 0,
      created_at: "",
      updated_at: "",
    },
  ],
  editedShift: {
    id: 0,
    shift_date: "",
    shift_start: "",
    shift_end: "",
    staff: 0,
    lane: 0,
  },
  selectedShift: {
    id: 0,
    owner: 0,
    shift_date: "",
    shift_start: "",
    shift_end: "",
    staff: 0,
    staff_name: "",
    staff_is_active: true,
    lane: 0,
    created_at: "",
    updated_at: "",
  },
  dateState: {
    startDate: startOfWeek(new Date()).setDate(
      startOfWeek(new Date()).getDate() + 1
    ),
    endDate: endOfWeek(new Date()).setDate(endOfWeek(new Date()).getDate() + 1),
  },
  modalState: {
    open: false,
  },
};

export const shiftSlice = createSlice({
  name: "shift",
  initialState,
  reducers: {
    editShift(state, action: PayloadAction<POST_SHIFT>) {
      state.editedShift = action.payload;
    },
    selectShift(state, action: PayloadAction<READ_SHIFT>) {
      state.selectedShift = action.payload;
    },
    resetDateState(state, action: PayloadAction<DATE_STATE>) {
      state.dateState = action.payload;
    },
    lastWeeks: (state) => {
      state.dateState.startDate = Number(
        subWeeks(state.dateState.startDate, 1)
      );
      state.dateState.endDate = Number(subWeeks(state.dateState.endDate, 1));
    },
    afterWeeks: (state) => {
      state.dateState.startDate = Number(
        addWeeks(state.dateState.startDate, 1)
      );
      state.dateState.endDate = Number(addWeeks(state.dateState.endDate, 1));
    },
    handleClose: (state) => {
      state.modalState.open = false;
    },
    handleOpen: (state) => {
      state.modalState.open = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncGetShifts.fulfilled,
      (state, action: PayloadAction<READ_SHIFT[]>) => {
        return {
          ...state,
          shifts: action.payload,
        };
      }
    );
    builder.addCase(fetchAsyncGetShifts.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncCreateShift.fulfilled,
      (state, action: PayloadAction<READ_SHIFT>) => {
        return {
          ...state,
          shifts: [...state.shifts, action.payload],
          editedShift: initialState.editedShift,
        };
      }
    );
    builder.addCase(fetchAsyncCreateShift.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncUpdateShift.fulfilled,
      (state, action: PayloadAction<READ_SHIFT>) => {
        return {
          ...state,
          tasks: state.shifts.map((s) =>
            s.id === action.payload.id ? action.payload : s
          ),
          editedTask: initialState.editedShift,
          selectedTask: initialState.selectedShift,
        };
      }
    );
    builder.addCase(fetchAsyncUpdateShift.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncDeleteShift.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          tasks: state.shifts.filter((s) => s.id !== action.payload),
          editedTask: initialState.editedShift,
          selectedTask: initialState.selectedShift,
        };
      }
    );
    builder.addCase(fetchAsyncDeleteShift.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const {
  editShift,
  selectShift,
  resetDateState,
  lastWeeks,
  afterWeeks,
  handleClose,
  handleOpen,
} = shiftSlice.actions;
export const selectShifts = (state: RootState) => state.shift.shifts;
export const selectEditedShift = (state: RootState) => state.shift.editedShift;
export const selectSelectedShift = (state: RootState) =>
  state.shift.selectedShift;
export const selectDateState = (state: RootState) => state.shift.dateState;
export const selectModalState = (state: RootState) => state.shift.modalState;
export default shiftSlice.reducer;
