import React, { useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styles from "./Default.module.css";
import { Grid, Avatar, AppBar, Box, Tabs, Tab } from "@material-ui/core";
import { makeStyles, createMuiTheme, Theme } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { ThemeProvider } from "@material-ui/styles";
import Logo from "./static/images/logo1.png";

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

import { fetchAsyncGetStaff } from "./features/staff/staffSlice";
import {
  selectDateState,
  fetchAsyncGetShifts,
} from "./features/shift/shiftSlice";

import { AppDispatch } from "./app/store";

declare module "@material-ui/core/styles/createPalette" {
  interface Palette {
    customColor1: Palette["primary"];
  }
  interface PaletteOptions {
    customColor1: PaletteOptions["primary"];
  }
}

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
    customColor1: {
      main: "#f60257",
    },
  },
  typography: {
    htmlFontSize: 10,
  },
});

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

const Default: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const page = location.pathname.split("/")[1];

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

  const DateState = useSelector(selectDateState);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetMyProf());
      await dispatch(fetchAsyncGetProfs());
      await dispatch(fetchAsyncGetStaff());
      await dispatch(fetchAsyncGetShifts(DateState));
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <>
        <AppBar color="primary" position="static" className={classes.header}>
          <Grid container alignItems="center">
            <Grid item xs={8}>
              <h1>
                <img src={Logo} alt="ロゴ" width="300px" />
              </h1>
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
        <AppBar
          color="secondary"
          position="static"
          style={{ backgroundColor: "#ffffff" }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleChange}
            indicatorColor="secondary"
          >
            <Tab label="シフト管理" />
            <Tab label="スタッフ管理" />
          </Tabs>
        </AppBar>
        <main>
          {selectedTab === 0 && <Shift />}
          {selectedTab === 1 && <Staff />}
        </main>
      </>
    </ThemeProvider>
  );
};

export default Default;
