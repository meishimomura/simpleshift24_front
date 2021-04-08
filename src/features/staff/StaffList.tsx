import React, { useState, useEffect } from "react";

import { makeStyles, Theme } from "@material-ui/core/styles";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import DeleteOutlineOutlinedIcon from "@material-ui/icons/DeleteOutlineOutlined";
import SaveIcon from "@material-ui/icons/Save";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import {
  Button,
  Table,
  TableCell,
  TableRow,
  TableBody,
  Modal,
  TextField,
} from "@material-ui/core";
import Pagination from "material-ui-flat-pagination";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchAsyncDeleteStaff,
  editStaff,
  selectStaff,
  selectEditedStaff,
} from "./staffSlice";
import { AppDispatch } from "../../app/store";
import {
  initialState,
  fetchAsyncCreateStaff,
  fetchAsyncUpdateStaff,
} from "./staffSlice";
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
  field: {
    margin: theme.spacing(2),
    minWidth: 240,
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

const StaffList: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();

  const staff = useSelector(selectStaff);
  const editedStaff = useSelector(selectEditedStaff);

  const [open, setOpen] = useState(false);
  const [modalStyle] = useState(getModalStyle);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const isDisabled = editedStaff.staff_name.length === 0;

  const handleInputTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(editStaff({ ...editedStaff, staff_name: e.target.value }));
  };

  const [state, setState] = useState<PAGE_STATE>({
    rows: staff,
    offset: 0,
    parPage: 10,
  });

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
        onClick={handleOpen}
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
                    <TableCell align="center">
                      <button
                        onClick={() => {
                          dispatch(
                            fetchAsyncDeleteStaff({ ...row, is_active: false })
                          );
                        }}
                      >
                        <DeleteOutlineOutlinedIcon />
                      </button>
                      <button
                        onClick={() => {
                          dispatch(editStaff(row));
                          handleOpen();
                        }}
                      >
                        <EditOutlinedIcon />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {state.rows.length > state.parPage && (
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
          )}
        </>
      )}
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          <TextField
            className={classes.field}
            InputLabelProps={{
              shrink: true,
            }}
            label={editedStaff.id ? "スタッフ名変更" : "新規スタッフ"}
            type="text"
            value={editedStaff.staff_name}
            onChange={handleInputTextChange}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.saveModal}
            startIcon={<SaveIcon />}
            disabled={isDisabled}
            onClick={() => {
              editedStaff.id !== 0
                ? dispatch(fetchAsyncUpdateStaff(editedStaff))
                : dispatch(fetchAsyncCreateStaff(editedStaff.staff_name));
              handleClose();
            }}
          >
            {editedStaff.id !== 0 ? "更新" : "追加"}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default StaffList;
