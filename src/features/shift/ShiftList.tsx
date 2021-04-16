import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button } from "@material-ui/core";

import format from "date-fns/format";
import getDate from "date-fns/getDate";
import getDay from "date-fns/getDay";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

import { selectShifts, editShift, selectShift } from "./shiftSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./shiftSlice";
import { SHIFT_PAGE_STATE } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const getCalendar = (date: Date) => {
  const startDate: Date = startOfWeek(date);
  const endDate: Date = endOfWeek(date);
  return eachDayOfInterval({
    start: startDate.setDate(startDate.getDate() + 1),
    end: endDate.setDate(endDate.getDate() + 1),
  });
};

const ShiftList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const shifts = useSelector(selectShifts);

  const days = [
    { en: "mon", ja: "月" },
    { en: "tue", ja: "火" },
    { en: "wed", ja: "水" },
    { en: "thu", ja: "木" },
    { en: "fri", ja: "金" },
    { en: "sat", ja: "土" },
    { en: "sun", ja: "日" },
  ];

  const targetDate = new Date();
  const calendar = getCalendar(targetDate);

  const [state, setState] = useState<SHIFT_PAGE_STATE>({
    rows: shifts,
    offset: 0,
    parPage: 10,
  });

  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: shifts,
    }));
  }, [shifts]);

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          dispatch(
            editShift({
              id: 0,
              shift_date: "",
              shift_start: "",
              shift_end: "",
              staff: 1,
            })
          );
          dispatch(selectShift(initialState.selectedShift));
        }}
      >
        新規シフト追加
      </Button>
      <h2>{format(targetDate, "y年M月")}</h2>
      <table>
        <tbody>
          {calendar.map((date, i) => (
            <tr key={getDate(date)}>
              <th key={getDay(date)}>{days[i].ja}</th>
              <th key={getDate(date)}>{getDate(date)}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShiftList;
