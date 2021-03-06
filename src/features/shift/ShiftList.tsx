import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ShiftList.module.css";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button, Modal } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

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
} from "./shiftSlice";
import { AppDispatch } from "../../app/store";
import { initialState } from "./shiftSlice";
import ShiftForm from "./ShiftForm";

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(3),
    color: "white",
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
  mainPaper: {
    width: "90%",
    padding: theme.spacing(2),
    marginLeft: theme.spacing(3),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
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
    { en: "mon", ja: "???" },
    { en: "tue", ja: "???" },
    { en: "wed", ja: "???" },
    { en: "thu", ja: "???" },
    { en: "fri", ja: "???" },
    { en: "sat", ja: "???" },
    { en: "sun", ja: "???" },
  ];

  const shiftTimes: string[] = [];
  for (let i = 0; i < 24; ++i) {
    shiftTimes.push(("00" + i).slice(-2) + ":00");
    shiftTimes.push(("00" + i).slice(-2) + ":30");
  }

  const shiftDisplayTimes: string[] = [];
  for (let i = 0; i < 24; ++i) {
    shiftDisplayTimes.push(("00" + i).slice(-2));
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
  }, [dateState]);

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
              className={
                styles.shiftlist__tdth + " " + styles.shiftlist__pointer
              }
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
        size="small"
        color="primary"
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
        ?????????????????????
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        size="small"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handlePrint}
      >
        ??????
      </Button>
      <h2 className={styles.shiftlist__month}>
        {format(dateState.startDate, "y???M???")}
      </h2>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(lastWeeks())}
      >
        ?????????
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(resetDateState(initialState.dateState))}
      >
        ??????
      </Button>
      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => dispatch(afterWeeks())}
      >
        ?????????
      </Button>
      <Paper className={classes.mainPaper}>
        <div ref={componentRef} className={styles.shiftlist__print}>
          <p className={styles.shiftlist__printTitle}>
            {format(dateState.startDate, "y???M???")}????????????
          </p>
          <table className={styles.shiftlist__table}>
            <thead>
              <tr>
                <td className={styles.shiftlist__thead}></td>
                <td className={styles.shiftlist__thead}></td>
                {shiftDisplayTimes.map((time) => (
                  <>
                    <td key={time + 30} className={styles.shiftlist__thead}>
                      {time}
                    </td>
                    <td
                      key={time + 60}
                      className={styles.shiftlist__thead}
                    ></td>
                  </>
                ))}
              </tr>
            </thead>
            <tbody>
              {calendar.map((date, i) => (
                <>
                  <tr key={getDate(date) + 1}>
                    <th
                      key={getDate(date)}
                      rowSpan={5}
                      className={
                        days[i].en !== "sun"
                          ? styles.shiftlist__tdth +
                            " " +
                            styles.shiftlist__borderBold
                          : styles.shiftlist__tdth
                      }
                    >
                      {format(date, "M")}&#047;{getDate(date)}
                    </th>
                    <td
                      key={getDay(date) + getDate(date)}
                      rowSpan={5}
                      className={
                        days[i].en !== "sun"
                          ? styles.shiftlist__tdth +
                            " " +
                            styles.shiftlist__borderBold
                          : styles.shiftlist__tdth
                      }
                    >
                      {days[i].ja}
                    </td>
                    {shiftTimes.map((shiftTime) => (
                      <>{staffData(date, shiftTime, 1)}</>
                    ))}
                  </tr>
                  <tr
                    key={getDate(date) + 2}
                    className={styles.shiftlist__tdth}
                  >
                    {shiftTimes.map((shiftTime) => (
                      <>{staffData(date, shiftTime, 2)}</>
                    ))}
                  </tr>
                  <tr
                    key={getDate(date) + 3}
                    className={styles.shiftlist__tdth}
                  >
                    {shiftTimes.map((shiftTime) => (
                      <>{staffData(date, shiftTime, 3)}</>
                    ))}
                  </tr>
                  <tr
                    key={getDate(date) + 4}
                    className={styles.shiftlist__tdth}
                  >
                    {shiftTimes.map((shiftTime) => (
                      <>{staffData(date, shiftTime, 4)}</>
                    ))}
                  </tr>
                  <tr
                    key={getDate(date) + 5}
                    className={styles.shiftlist__tdth}
                  >
                    {shiftTimes.map((shiftTime) => (
                      <>{staffData(date, shiftTime, 5)}</>
                    ))}
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>
      <Modal open={open} onClose={() => dispatch(handleClose())}>
        <div style={modalStyle} className={classes.paper}>
          <ShiftForm />
        </div>
      </Modal>
    </>
  );
};

export default ShiftList;
