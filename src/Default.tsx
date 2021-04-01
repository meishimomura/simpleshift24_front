import React, { useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import styles from "./Default.module.css";
import { Grid, Avatar, AppBar, Box, Tabs, Tab } from "@material-ui/core";
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
import Shift from "./features/shift/Shift";

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
    cursor: "none",
  },
  avatar: {
    marginRight: theme.spacing(2),
  },
  header: {
    color: "#fff",
    padding: "0px 50px",
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
  typography: {
    htmlFontSize: 10,
  },
});

const Default: React.FC = () => {
  const history = useHistory();
  const { page } = useParams();

  interface TAB_NAME_TO_INDEX {
    0: string;
    1: string;
    [key: number]: string;
  }

  const tabNameToIndex: TAB_NAME_TO_INDEX = {
    0: "shift",
    1: "staff",
  };

  interface INDEX_TO_TAB_NAME {
    shift: number;
    staff: number;
    [key: string]: number;
  }

  const indexToTabName: INDEX_TO_TAB_NAME = {
    shift: 0,
    staff: 1,
  };

  const [selectedTab, setSelectedTab] = React.useState(indexToTabName[page]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    history.push(`/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

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
      <>
        <AppBar color="primary" position="static" className={classes.header}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <h1>シンプルシフト24</h1>
            </Grid>
            <Grid item xs={4}>
              <Grid container alignItems="center" justify="flex-end">
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
                <button onClick={Logout} className={styles.default__iconLogout}>
                  <div className={styles.default__logoutWrap}>
                    <ExitToAppIcon style={{ fontSize: 35 }} color="action" />
                    <Box fontWeight="fontWeightBold" fontSize={16}>
                      ログアウト
                    </Box>
                  </div>
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
              </Grid>
            </Grid>
          </Grid>
        </AppBar>
        <Grid container>
          <Grid>
            <AppBar position="static">
              <Tabs value={selectedTab} onChange={handleChange}>
                <Tab label="シフト" />
                <Tab label="スタッフ" />
              </Tabs>
            </AppBar>
          </Grid>
        </Grid>
        <main>
          {selectedTab === 0 && <Shift />}
          {selectedTab === 1 && <Staff />}
        </main>
      </>
    </ThemeProvider>
  );
};

export default Default;
