import React, { useEffect } from "react";
import styles from "./Default.module.css";
import { Grid, Avatar, AppBar } from "@material-ui/core";
import {
  makeStyles,
  createMuiTheme,
  MuiThemeProvider,
  Theme,
} from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { ThemeProvider } from "@material-ui/styles";

import { Switch, Route, NavLink } from "react-router-dom";
import App from "./App";
import Staff from "./features/staff/Staff";

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

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginTop: theme.spacing(3),
    cursor: "none",
  },
  avatar: {
    marginLeft: theme.spacing(1),
  },
  header: {
    color: "#fff",
    padding: "0px 20px",
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ff8f00",
      light: "#ffc046",
      dark: "#c56000",
    },
    secondary: {
      main: "#00c853",
      light: "#5efa81",
      dark: "#009423",
    },
  },
});

const Default: React.FC = () => {
  const classes = useStyles();
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
    <ThemeProvider theme={theme}>
      <div>
        <AppBar color="primary" position="static" className={classes.header}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <h1>シンプルシフト24</h1>
            </Grid>
            <Grid item xs={4}>
              <button onClick={Logout} className={styles.default__iconLogout}>
                <ExitToAppIcon fontSize="large" />
                ログアウト
              </button>
              <input
                type="file"
                id="imageInput"
                hidden={true}
                onChange={(e) => {
                  dispatch(
                    fetchAsyncUpdateProf({
                      id: loginProfile.id,
                      img: e.target.files !== null ? e.target.files[0] : null,
                    })
                  );
                }}
              />
              <button
                className={styles.default__btn}
                onClick={handlerEditPicture}
              >
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </Grid>
          </Grid>
        </AppBar>
        <Grid container>
          <Grid>
            <NavLink
              to="/shift"
              exact
              activeClassName="my-active"
              activeStyle={{
                color: "#fa923f",
                textDecoration: "underline",
              }}
            >
              シフト
            </NavLink>
            <NavLink
              to="/staff"
              exact
              activeClassName="my-active"
              activeStyle={{
                color: "#fa923f",
                textDecoration: "underline",
              }}
            >
              スタッフ
            </NavLink>
          </Grid>
        </Grid>
        <main>
          <Switch>
            <Route exact path="/shift" component={App} />
            <Route exact path="/staff" component={Staff} />
          </Switch>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default Default;
