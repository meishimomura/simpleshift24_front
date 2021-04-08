import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
  Fab,
  Modal,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncCreateShift,
  fetchAsyncUpdateShift,
  selectEditedShift,
  editShift,
  selectShift,
} from "./shiftSlice";
import { selectStaff } from "../staff/staffSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./shiftSlice";

const useStyles = makeStyles((theme: Theme) => ({
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
  },
  button: {
    margin: theme.spacing(3),
  },
  paper: {
    position: "absolute",
    textAlign: "center",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ShiftForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const staffUsers = useSelector(selectStaff);
  const editedShift = useSelector(selectEditedShift);

  const [inputText, setInputText] = useState("");

  const isDisabled =
    editedShift.shift_date.length === 0 ||
    editedShift.shift_start.length === 0 ||
    editedShift.shift_end.length === 0;

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = e.target.value;
    const name = e.target.name;
    dispatch(editShift({ ...editedShift, [name]: value }));
  };

  const handleSelectStaffChange = (
    e: React.ChangeEvent<{ value: unknown }>
  ) => {
    const value = e.target.value as number;
    dispatch(editShift({ ...editedShift, staff: value }));
  };

  let staffOptions = staffUsers.map((staffUser) => (
    <MenuItem key={staffUser.id} value={staffUser.id}>
      {staffUser.staff_name}
    </MenuItem>
  ));
  return <></>;
};

export default ShiftForm;
