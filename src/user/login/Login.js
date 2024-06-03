import React, { Component } from "react";
import "./Login.css";
import { GOOGLE_AUTH_URL } from "../../constants";
import { Redirect } from "react-router-dom";
import googleLogo from "../../img/google-logo.png";
import Alert from "react-s-alert";
import Cookies from 'universal-cookie';
import axios from 'axios';

class Login extends Component {

  componentDidMount() {

    if (this.props.location.state && this.props.location.state.error) {
      setTimeout(() => {
        Alert.error(this.props.location.state.error, {
          timeout: 5000
        });
        this.props.history.replace({
          pathname: this.props.location.pathname,
          state: {}
        });
      }, 100);
    }
  }

  render() {
    if (this.props.authenticated) {
      return (
        <Redirect
          to={{
            pathname: "/",
            state: { from: this.props.location }
          }}
        />
      );
    }

    return (
      <div className="login-container">
        <div className="login-content">
          <h1 className="login-title">Login</h1>
          <SampleLogin />
        </div>
      </div>
    );
  }
}

const handleClick = (e) => {
  const cookies = new Cookies();

  e.preventDefault();
  axios.get(GOOGLE_AUTH_URL)
    .then(function (response) {
      console.log(response);
      cookies.set('Auth-Identification', response.headers['auth-identification'], { path: '/' });
      window.location.replace(response.data.redirectUrl)
    })

}

class SampleLogin extends Component {
  render() {
    return (
      <div className="social-login">
        <a className="btn btn-block social-btn google" onClick={handleClick}>
          <img src={googleLogo} alt="Google" /> Log in with Google
        </a>
      </div>
    );
  }
}

export default Login;
