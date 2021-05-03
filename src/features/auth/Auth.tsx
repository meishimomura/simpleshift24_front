import React, { useState } from "react";
import styles from "./Auth.module.css";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import Logo from "../../static/images/logo2.png";

import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import {
  toggleMode,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncCreateProf,
  selectIsLoginView,
} from "./authSlice";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(2),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 4),
    color: "#ffffff",
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

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const isLoginView = useSelector(selectIsLoginView);
  const [credential, setCredential] = useState({ username: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setCredential({ ...credential, [name]: value });
  };
  const login = async () => {
    if (isLoginView) {
      await dispatch(fetchAsyncLogin(credential));
    } else {
      const result = await dispatch(fetchAsyncRegister(credential));
      if (fetchAsyncRegister.fulfilled.match(result)) {
        await dispatch(fetchAsyncLogin(credential));
        await dispatch(fetchAsyncCreateProf());
      }
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <h1>
              <img src={Logo} alt="ロゴ" width="300px" />
            </h1>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {isLoginView ? "ログイン" : "新規会員登録"}
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="店舗番号"
                type="text"
                name="username"
                value={credential.username}
                autoFocus
                onChange={handleInputChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                label="パスワード"
                type="password"
                name="password"
                value={credential.password}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                size="large"
                color="secondary"
                className={classes.submit}
                onClick={login}
              >
                {isLoginView ? "ログイン" : "新規会員登録"}
              </Button>
              <Grid container justify="center" alignItems="center">
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => dispatch(toggleMode())}
                  >
                    {isLoginView ? "新規会員登録" : "ログイン"}
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Auth;
