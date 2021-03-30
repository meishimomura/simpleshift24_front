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

export const fetchAsyncGetStaff = createAsyncThunk(
  "shift/getStaff",
  async () => {
    const res = await axios.get<READ_STAFF[]>(
      `${process.env.REACT_APP_API_URL}/api/staff`,
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

export const fetchAsyncCreateStaff = createAsyncThunk(
  "shift/createStaff",
  async (staff: POST_STAFF) => {
    const res = await axios.post<READ_STAFF>(
      `${process.env.REACT_APP_API_URL}/api/staff/`,
      staff,
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

export const fetchAsyncUpdateStaff = createAsyncThunk(
  "shift/updateStaff",
  async (staff: POST_STAFF) => {
    const res = await axios.put<READ_STAFF>(
      `${process.env.REACT_APP_API_URL}/api/staff/${staff.id}/`,
      staff,
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

export const fetchAsyncDeleteStaff = createAsyncThunk(
  "shift/deleteStaff",
  async (id: number) => {
    await axios.delete(`${process.env.REACT_APP_API_URL}/api/staff/${id}/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return id;
  }
);

const initialState: SHIFT_STATE = {
  shiftViewStatus: 0,
  shifts: [
    {
      id: 0,
      owner: 0,
      shift_date: "",
      shift_start: "",
      shift_end: "",
      staff: "",
      staff_name: "",
      staff_is_active: true,
      created_at: "",
      updated_at: "",
    },
  ],
  editedShift: {
    id: 0,
    shift_date: "",
    shift_start: "",
    shift_end: "",
    staff: "",
  },
  selectedShift: {
    id: 0,
    owner: 0,
    shift_date: "",
    shift_start: "",
    shift_end: "",
    staff: "",
    staff_name: "",
    staff_is_active: true,
    created_at: "",
    updated_at: "",
  },
  staff: [
    {
      id: 0,
      owner: 0,
      staff_name: "",
      is_active: true,
      created_at: "",
      updated_at: "",
    },
  ],
  editedStaff: {
    id: 0,
    staff_name: "",
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
    editStaff(state, action: PayloadAction<POST_STAFF>) {
      state.editedStaff = action.payload;
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
    builder.addCase(
      fetchAsyncGetStaff.fulfilled,
      (state, action: PayloadAction<READ_STAFF[]>) => {
        return {
          ...state,
          staff: action.payload,
        };
      }
    );
    builder.addCase(fetchAsyncGetStaff.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncCreateStaff.fulfilled,
      (state, action: PayloadAction<READ_STAFF>) => {
        return {
          ...state,
          staff: [...state.staff, action.payload],
          editedStaff: initialState.editedStaff,
        };
      }
    );
    builder.addCase(fetchAsyncCreateStaff.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncUpdateStaff.fulfilled,
      (state, action: PayloadAction<READ_STAFF>) => {
        return {
          ...state,
          staff: state.staff.map((s) =>
            s.id === action.payload.id ? action.payload : s
          ),
          editedStaff: initialState.editedStaff,
        };
      }
    );
    builder.addCase(fetchAsyncUpdateStaff.rejected, () => {
      window.location.href = "/";
    });
    builder.addCase(
      fetchAsyncDeleteStaff.fulfilled,
      (state, action: PayloadAction<number>) => {
        return {
          ...state,
          staff: state.staff.filter((s) => s.id !== action.payload),
          editedStaff: initialState.editedStaff,
        };
      }
    );
    builder.addCase(fetchAsyncDeleteStaff.rejected, () => {
      window.location.href = "/";
    });
  },
});

export const { editShift, selectShift, editStaff } = shiftSlice.actions;
export const selectShifts = (state: RootState) => state.shift.shifts;
export const selectEditedShift = (state: RootState) => state.shift.editedShift;
export const selectSelectedShift = (state: RootState) =>
  state.shift.selectedShift;
export const selectStaff = (state: RootState) => state.shift.staff;
export const selectEditedStaff = (state: RootState) => state.shift.editedStaff;
export default shiftSlice.reducer;