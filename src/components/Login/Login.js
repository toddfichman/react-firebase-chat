import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  Input,
  Paper,
  withStyles,
  CssBaseline,
  Typography,
  Button
} from "@material-ui/core";
import styles from "./styles";

const firebase = require('firebase')

export class Login extends Component {
  state = {
    email: null,
    password: null,
    passwordConfirmation: null,
    loginError: ""
  };

  sumbitLogin = e => {
    e.preventDefault();
    console.log(this.state)

    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.props.history.push('/')
      }, err => {
        this.setState({loginError: 'Incorrect Email Or Password'})
        console.log(err)
      })
  };

  handleChange = (type, e) => {
    switch (type) {
      case "email":
        this.setState({ email: e.target.value });
        break;
      case "password":
        this.setState({ password: e.target.value });
        break;
      default:
        break;
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form onSubmit={e => this.sumbitLogin(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-email-input">Enter Email</InputLabel>
              <Input
                type="email"
                autoComplete="email"
                autoFocus
                id="login-email-input"
                onChange={e => this.handleChange("email", e)}
              ></Input>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="login-password-input">
                Enter Password
              </InputLabel>
              <Input
                type="password"
                id="login-password-input"
                onChange={e => this.handleChange("password", e)}
              ></Input>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Login
            </Button>
          </form>

          {this.state.loginError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              {this.state.loginError}
            </Typography>
          ) : (
            null
          )}

          <Typography
            component="h5"
            variant="h6"
            className={classes.noAccountHeader}
          >
            Don't Have An Account?
          </Typography>
          <Link to="/signup" className={classes.signUpLink}>
            Sign Up
          </Link>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(Login);
