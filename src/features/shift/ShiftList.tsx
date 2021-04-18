import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ShiftList.module.css";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button } from "@material-ui/core";

import format from "date-fns/format";
import getDate from "date-fns/getDate";
import getDay from "date-fns/getDay";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";

import {
  selectShifts,
  editShift,
  selectShift,
  fetchAsyncGetShifts,
} from "./shiftSlice";
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

  const timeLen: number = 24;
  const shiftTimes = new Array(timeLen)
    .fill(null)
    .map((_, i) => ("00" + i).slice(-2) + ":00");

  const [targetDate, setTargetDate] = useState(new Date());
  let sunStartDate: Date = startOfWeek(targetDate);
  let sunEndDate: Date = endOfWeek(targetDate);
  const [startDate, setStartDate] = useState(
    sunStartDate.setDate(sunStartDate.getDate() + 1)
  );
  const [endDate, setEndDate] = useState(
    sunEndDate.setDate(sunEndDate.getDate() + 1)
  );
  const [calendar, setCalendar] = useState(
    eachDayOfInterval({
      start: startDate,
      end: endDate,
    })
  );

  useEffect(() => {
    sunStartDate = startOfWeek(targetDate);
    sunEndDate = endOfWeek(targetDate);
    setStartDate(sunStartDate.setDate(sunStartDate.getDate() + 1));
    setEndDate(sunEndDate.setDate(sunEndDate.getDate() + 1));
    setCalendar(
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      })
    );
  }, [targetDate]);

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

  useEffect(() => {
    const date = {
      sDate: startDate,
      eDate: endDate,
    };
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetShifts(date));
    };
    fetchBootLoader();
  }, [dispatch, targetDate]);

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
              staff: 0,
              lane: 1,
            })
          );
          dispatch(selectShift(initialState.selectedShift));
        }}
      >
        新規シフト追加
      </Button>
      <h2>{format(targetDate, "y年M月")}</h2>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setTargetDate((current) => subWeeks(current, 1))}
      >
        前の週
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setTargetDate(new Date())}
      >
        今週
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => setTargetDate((current) => addWeeks(current, 1))}
      >
        次の週
      </Button>
      <table className={styles.shiftlist__table}>
        <tbody>
          {calendar.map((date, i) => (
            <>
              <tr key={getDate(date) + 1}>
                <th
                  key={getDate(date)}
                  rowSpan={5}
                  className={styles.shiftlist__tdth}
                >
                  {format(targetDate, "M")}&#047;{getDate(date)}
                </th>
                <td
                  key={getDay(date) + getDate(date)}
                  rowSpan={5}
                  className={styles.shiftlist__tdth}
                >
                  {days[i].ja}
                </td>
                <>
                  {shiftTimes.map((shiftTime) => (
                    <>
                      <td
                        id={format(date, "y-M-d") + shiftTime + 1}
                        className={styles.shiftlist__tdth}
                      >
                        &nbsp;
                      </td>
                    </>
                  ))}
                </>
              </tr>
              <tr key={getDate(date) + 2} className={styles.shiftlist__tdth}>
                <>
                  {shiftTimes.map((shiftTime) => (
                    <>
                      <td
                        id={format(date, "y-M-d") + shiftTime + 2}
                        className={styles.shiftlist__tdth}
                      >
                        &nbsp;
                      </td>
                    </>
                  ))}
                </>
              </tr>
              <tr key={getDate(date) + 3} className={styles.shiftlist__tdth}>
                <>
                  {shiftTimes.map((shiftTime) => (
                    <>
                      <td
                        id={format(date, "y-M-d") + shiftTime + 3}
                        className={styles.shiftlist__tdth}
                      >
                        &nbsp;
                      </td>
                    </>
                  ))}
                </>
              </tr>
              <tr key={getDate(date) + 4} className={styles.shiftlist__tdth}>
                <>
                  {shiftTimes.map((shiftTime) => (
                    <>
                      <td
                        id={format(date, "y-M-d") + shiftTime + 4}
                        className={styles.shiftlist__tdth}
                      >
                        &nbsp;
                      </td>
                    </>
                  ))}
                </>
              </tr>
              <tr key={getDate(date) + 5} className={styles.shiftlist__tdth}>
                <>
                  {shiftTimes.map((shiftTime) => (
                    <>
                      <td
                        id={format(date, "y-M-d") + shiftTime + 5}
                        className={styles.shiftlist__tdth}
                      >
                        &nbsp;
                      </td>
                    </>
                  ))}
                </>
              </tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ShiftList;
