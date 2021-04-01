import React, { useEffect } from "react";
import styles from "./App.module.css";
import { Grid, Avatar } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
  Theme,
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { ThemeProvider } from "@material-ui/styles";

import { useSelector, useDispatch } from "react-redux";

import {
  selectLoginUser,
  selectProfiles,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncUpdateProf,
} from "./features/auth/authSlice";
import {
  fetchAsyncGetShifts,
  fetchAsyncGetStaff,
  selectEditedShift,
  selectEditedStaff,
} from "./features/shift/shiftSlice";

import ShiftList from "./features/shift/ShiftList";
import ShiftForm from "./features/shift/ShiftForm";
import ShiftDisplay from "./features/shift/ShiftDisplay";

import { AppDispatch } from "./app/store";

const App: React.FC = () => {
  // const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const editedShift = useSelector(selectEditedShift);
  const editedStaff = useSelector(selectEditedStaff);

  const loginUser = useSelector(selectLoginUser);
  const profiles = useSelector(selectProfiles);

  const loginProfile = profiles.filter(
    (prof) => prof.user_profile === loginUser.id
  )[0];

  const Logout = () => {
    localStorage.removeItem("localJWT");
    window.location.href = "/";
  };

  const handlerEditPicture = () => {
    const fileInput = document.getElementById("imageInput");
    fileInput?.click();
  };

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetShifts());
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetStaff());
      await dispatch(fetchAsyncGetProfs());
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <p>テスト</p>
    </div>
  );
};

export default App;
