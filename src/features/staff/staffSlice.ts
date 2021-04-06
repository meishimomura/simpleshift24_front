import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { READ_STAFF, POST_STAFF, PUT_STAFF, STAFF_STATE } from "../types";

export const fetchAsyncGetStaff = createAsyncThunk(
  "staff/getStaff",
  async () => {
    const res = await axios.get<READ_STAFF[]>(
      `${process.env.REACT_APP_API_URL}/api/staff/?is_active=True`,
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
  "staff/createStaff",
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
  "staff/updateStaff",
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
  "staff/deleteStaff",
  async (staff: PUT_STAFF) => {
    await axios.put(
      `${process.env.REACT_APP_API_URL}/api/staff/${staff.id}/`,
      staff,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      }
    );
    return staff.id;
  }
);

export const initialState: STAFF_STATE = {
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

export const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    editStaff(state, action: PayloadAction<POST_STAFF>) {
      state.editedStaff = action.payload;
    },
  },
  extraReducers: (builder) => {
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

export const { editStaff } = staffSlice.actions;
export const selectStaff = (state: RootState) => state.staff.staff;
export const selectEditedStaff = (state: RootState) => state.staff.editedStaff;
export default staffSlice.reducer;
