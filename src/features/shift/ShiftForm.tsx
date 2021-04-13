import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import {
  TextField,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Button,
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import AddIcon from "@material-ui/icons/Add";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker } from "@material-ui/pickers";
import jaLocale from "date-fns/locale/ja";
import format from "date-fns/format";
import moment, { Moment } from "moment";

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

class ExtendedUtils extends DateFnsUtils {
  getCalendarHeaderText(date: any) {
    return format(date, "yyyy MMM", { locale: this.locale });
  }
  getDatePickerHeaderText(date: any) {
    return format(date, "MMMd日", { locale: this.locale });
  }
}

const ShiftForm: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const staffUsers = useSelector(selectStaff);
  const editedShift = useSelector(selectEditedShift);

  const handleDateChange = (date: Date | null) => {
    if (date !== null) {
      const momentDate: Moment = moment(new Date(date));
      dispatch(
        editShift({
          ...editedShift,
          shift_date: momentDate.format("YYYY-MM-DD"),
        })
      );
    }
  };

  const isDisabled =
    editedShift.shift_date.length === 0 ||
    editedShift.shift_start.length === 0 ||
    editedShift.shift_end.length === 0 ||
    editedShift.staff === 0;

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

  return (
    <MuiPickersUtilsProvider utils={ExtendedUtils} locale={jaLocale}>
      <h2>{editedShift.id ? "シフト更新" : "新規シフト"}</h2>
      <form>
        <DatePicker
          name="shift_date"
          label="日付"
          value={editedShift.shift_date === "" ? null : editedShift.shift_date}
          onChange={handleDateChange}
          format="yyyy/MM/dd"
          animateYearScrolling
          InputLabelProps={{
            shrink: true,
          }}
          okLabel="決定"
          cancelLabel="キャンセル"
        />
        <TextField
          name="shift_start"
          label="時間"
          type="time"
          value={editedShift.shift_start}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300,
          }}
          onChange={handleInputChange}
        />
        <TextField
          name="shift_end"
          label=""
          type="time"
          value={editedShift.shift_end}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300,
          }}
          onChange={handleInputChange}
        />
        <FormControl className={classes.field}>
          <InputLabel>従業員名</InputLabel>
          <Select
            name="staff"
            onChange={handleSelectStaffChange}
            value={editedShift.staff}
          >
            {staffOptions}
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          size="small"
          className={classes.button}
          startIcon={<SaveIcon />}
          disabled={isDisabled}
          onClick={
            editedShift.id !== 0
              ? () => dispatch(fetchAsyncUpdateShift(editedShift))
              : () => dispatch(fetchAsyncCreateShift(editedShift))
          }
        >
          {editedShift.id !== 0 ? "更新" : "保存"}
        </Button>
        <Button
          variant="contained"
          color="default"
          size="small"
          onClick={() => {
            dispatch(editShift(initialState.editedShift));
            dispatch(selectShift(initialState.selectedShift));
          }}
        >
          キャンセル
        </Button>
      </form>
    </MuiPickersUtilsProvider>
  );
};

export default ShiftForm;
