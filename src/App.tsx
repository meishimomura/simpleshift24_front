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

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    marginTop: theme.spacing(3),
    cursor: "none",
  },
  avatar: {
    marginLeft: theme.spacing(1),
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

const App: React.FC = () => {
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
        <Grid container>
          <Grid item xs={4}>
            <h1>シンプルシフト24</h1>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <div>
              <button onClick={Logout}>
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
              <button onClick={handlerEditPicture}>
                <Avatar
                  className={classes.avatar}
                  alt="avatar"
                  src={
                    loginProfile?.img !== null ? loginProfile?.img : undefined
                  }
                />
              </button>
            </div>
          </Grid>
          <Grid item xs={6}>
            <ShiftList />
          </Grid>
          <Grid item xs={6}>
            <Grid
              container
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: "80vh" }}
            >
              <Grid item>
                {editedShift.shift_date ? <ShiftForm /> : <ShiftDisplay />}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default App;
