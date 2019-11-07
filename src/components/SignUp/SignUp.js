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

// import FirebaseAuth from "firebase/auth";

const firebase = require('firebase');

export class SignUp extends Component {
  state = {
    email: null,
    password: null,
    passwordConfirmation: null,
    signUpError: ""
  };

  submitSignUp = e => {
    e.preventDefault();
    if (!this.passwordConfirmation()) {
      this.setState({signUpError: 'Passwords do not match.'})
      return 
    }

    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(authRes => {
        console.log(authRes)
        const userObject = {
          email: authRes.user.email
        }
        firebase
          .firestore()
          .collection('users')
          .doc(this.state.email)
          .set(userObject)
          .then(() => {
            this.props.history.push('/')
          }, dbError => {
            console.log(dbError)
        this.setState({signUpError: 'Failed to add user'})
          })
      }, authError => {
        console.log(authError)
        this.setState({signUpError: authError.message})
      })


    console.log(this.state);
  };

  handleChange = (type, e) => {
    switch (type) {
      case 'email':
        this.setState({email: e.target.value})
        break;
      case 'password':
        this.setState({password: e.target.value})
        break;
      case 'passwordConfirmation':
        this.setState({passwordConfirmation: e.target.value})
        break;
      default:
        break;
    }
  };

  passwordConfirmation = () => this.state.password === this.state.passwordConfirmation

  render() {
    const { classes } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline></CssBaseline>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
          <form onSubmit={e => this.submitSignUp(e)} className={classes.form}>
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-email-input">Enter Email</InputLabel>
              <Input
                type="email"
                autoComplete="email"
                autoFocus
                id="signup-email-input"
                onChange={e => this.handleChange("email", e)}
              ></Input>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-input">
                Create A Password
              </InputLabel>
              <Input
                type="password"
                id="signup-password-input"
                onChange={e => this.handleChange("password", e)}
              ></Input>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="signup-password-confirmation-input">
                Confirm Password
              </InputLabel>
              <Input
                type="password"
                id="signup-password-confirmation-input"
                onChange={e => this.handleChange("passwordConfirmation", e)}
              ></Input>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              
            >
              Submit
            </Button>
          </form>

          {this.state.signUpError ? (
            <Typography
              component="h5"
              variant="h6"
              className={classes.errorText}
            >
              {this.state.signUpError}
            </Typography>
          ) : (
            null
          )}

          <Typography
            component="h5"
            variant="h6"
            className={classes.hasAcountHeader}
          >
            Already Have An Account?
          </Typography>
          <Link to="/login" className={classes.loginLink}>
            Login
          </Link>
        </Paper>
      </main>
    );
  }
}

export default withStyles(styles)(SignUp);
