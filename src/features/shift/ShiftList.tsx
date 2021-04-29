import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ShiftList.module.css";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button, Modal } from "@material-ui/core";

import { useReactToPrint } from "react-to-print";

import format from "date-fns/format";
import getDate from "date-fns/getDate";
import getDay from "date-fns/getDay";
import eachDayOfInterval from "date-fns/eachDayOfInterval";

import {
  selectShifts,
  editShift,
  selectShift,
  resetDateState,
  selectDateState,
  selectModalState,
  lastWeeks,
  afterWeeks,
  handleClose,
  handleOpen,
  fetchAsyncGetShifts,
} from "./shiftSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./shiftSlice";
import ShiftForm from "./ShiftForm";
const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  saveModal: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(2),
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

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ShiftList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const componentRef = React.useRef(null);
  const shifts = useSelector(selectShifts);
  const dateState = useSelector(selectDateState);
  const modalState = useSelector(selectModalState);

  const days = [
    { en: "mon", ja: "月" },
    { en: "tue", ja: "火" },
    { en: "wed", ja: "水" },
    { en: "thu", ja: "木" },
    { en: "fri", ja: "金" },
    { en: "sat", ja: "土" },
    { en: "sun", ja: "日" },
  ];

  const shiftTimes: string[] = [];
  for (let i = 0; i < 24; ++i) {
    shiftTimes.push(("00" + i).slice(-2) + ":00");
    shiftTimes.push(("00" + i).slice(-2) + ":30");
  }

  const [calendar, setCalendar] = useState(
    eachDayOfInterval({
      start: dateState.startDate,
      end: dateState.endDate,
    })
  );

  const [rows, setRows] = useState(shifts);

  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(modalState.open);
  }, [modalState]);

  useEffect(() => {
    setCalendar(
      eachDayOfInterval({
        start: dateState.startDate,
        end: dateState.endDate,
      })
    );
    dispatch(fetchAsyncGetShifts(dateState));
  }, [dateState, shifts]);

  useEffect(() => {
    setRows(shifts);
  }, [shifts]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const staffData = (date: Date, shiftTime: string, i: number) => {
    let cellData: JSX.Element | null = (
      <td
        id={format(date, "y-M-d") + shiftTime + i}
        key={format(date, "y-M-d") + shiftTime + i}
        className={styles.shiftlist__tdth}
        colSpan={1}
      >
        &nbsp;
      </td>
    );
    for (let row of rows) {
      if (
        row.lane === i &&
        row.shift_date + row.shift_start <=
          format(date, "yyyy-MM-dd") + shiftTime &&
        row.shift_date + row.shift_end > format(date, "yyyy-MM-dd") + shiftTime
      ) {
        if (
          row.lane === i &&
          row.shift_date + row.shift_start ===
            format(date, "yyyy-MM-dd") + shiftTime
        ) {
          const shift_endTime = new Date(row.shift_date + " " + row.shift_end);
          const shift_startTime = new Date(
            row.shift_date + " " + row.shift_start
          );
          const diff = shift_endTime.getTime() - shift_startTime.getTime();
          const hour = (diff / (1000 * 60 * 60)) * 2;
          let colspan = 1;
          Number.isInteger(hour)
            ? (colspan = hour)
            : (colspan = Math.ceil(hour) + 1);
          cellData = (
            <td
              id={format(date, "y-M-d") + shiftTime + i}
              key={format(date, "y-M-d") + shiftTime + i}
              className={styles.shiftlist__tdth}
              colSpan={colspan}
              onClick={() => {
                dispatch(handleOpen());
                dispatch(editShift(row));
              }}
            >
              {row.staff_name + row.shift_start}~{row.shift_end}
            </td>
          );
        } else {
          cellData = null;
        }
        break;
      }
    }
    return cellData;
  };

  return (
    <>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => {
          dispatch(handleOpen());
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

      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handlePrint}
      >
        印刷
      </Button>

      <h2>{format(dateState.startDate, "y年M月")}</h2>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(lastWeeks())}
      >
        前の週
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(resetDateState(initialState.dateState))}
      >
        今週
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(afterWeeks())}
      >
        次の週
      </Button>
      <div ref={componentRef}>
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
                    {format(date, "M")}&#047;{getDate(date)}
                  </th>
                  <td
                    key={getDay(date) + getDate(date)}
                    rowSpan={5}
                    className={styles.shiftlist__tdth}
                  >
                    {days[i].ja}
                  </td>
                  {shiftTimes.map((shiftTime) => (
                    <>{staffData(date, shiftTime, 1)}</>
                  ))}
                </tr>
                <tr key={getDate(date) + 2} className={styles.shiftlist__tdth}>
                  {shiftTimes.map((shiftTime) => (
                    <>{staffData(date, shiftTime, 2)}</>
                  ))}
                </tr>
                <tr key={getDate(date) + 3} className={styles.shiftlist__tdth}>
                  {shiftTimes.map((shiftTime) => (
                    <>{staffData(date, shiftTime, 3)}</>
                  ))}
                </tr>
                <tr key={getDate(date) + 4} className={styles.shiftlist__tdth}>
                  {shiftTimes.map((shiftTime) => (
                    <>{staffData(date, shiftTime, 4)}</>
                  ))}
                </tr>
                <tr key={getDate(date) + 5} className={styles.shiftlist__tdth}>
                  {shiftTimes.map((shiftTime) => (
                    <>{staffData(date, shiftTime, 5)}</>
                  ))}
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
      <Modal open={open} onClose={() => dispatch(handleClose())}>
        <div style={modalStyle} className={classes.paper}>
          <ShiftForm />
        </div>
      </Modal>
    </>
  );
};

export default ShiftList;
