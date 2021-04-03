import React, { useState, useEffect } from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Button,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody,
} from "@material-ui/core";
import Pagination from "material-ui-flat-pagination";

import { useSelector, useDispatch } from "react-redux";
import { fetchAsyncDeleteStaff, editStaff, selectStaff } from "./staffSlice";
import { selectLoginUser } from "../auth/authSlice";
import { AppDispatch } from "../../app/store";
import { initialState, fetchAsyncGetStaff } from "./staffSlice";
import { READ_STAFF, PAGE_STATE } from "../types";

const useStyles = makeStyles((theme: Theme) => ({
  table: {
    tableLayout: "fixed",
  },
  button: {
    margin: theme.spacing(3),
    color: "white",
  },
  small: {
    margin: "auto",
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}));

const StaffList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const staff = useSelector(selectStaff);
  const loginUser = useSelector(selectLoginUser);

  const [state, setState] = useState<PAGE_STATE>({
    rows: staff,
    offset: 0,
    parPage: 2,
  });

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetStaff());
    };
    fetchBootLoader();
  }, [dispatch]);

  useEffect(() => {
    setState((state) => ({
      ...state,
      rows: staff,
    }));
  }, [staff]);

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
            editStaff({
              id: 0,
              staff_name: "",
            })
          );
        }}
      >
        スタッフ新規登録
      </Button>

      {staff[0]?.staff_name && (
        <>
          <Table size="small">
            <TableBody>
              {state.rows
                .slice(state.offset, state.offset + state.parPage)
                .map((row, rowIndex) => (
                  <TableRow hover key={rowIndex}>
                    <TableCell>
                      <span>{row["staff_name"]}</span>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <Pagination
            limit={state.parPage}
            offset={state.offset}
            total={state.rows.length}
            onClick={(e, offset) => {
              setState((state) => ({
                ...state,
                offset: offset,
              }));
            }}
          />
        </>
      )}
    </>
  );
};

export default StaffList;
