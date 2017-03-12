import React, { Component } from 'react'

import auth from "../authorization/auth";
import { observer } from "mobx-react";
import { observe } from "mobx";

const Login = observer(class Login extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this)
    this.updateRoutesAfterLogin = this.updateRoutesAfterLogin.bind(this);
    observe(auth, "loggedIn", (data) => this.updateRoutesAfterLogin(data))
  }

  //Refactor this method into auth.js (reuires a way to get the router/location in this class)
  updateRoutesAfterLogin(val) {
    const { location } = this.props

    if (location.state && location.state.nextPathname) {
      this.props.router.replace(location.state.nextPathname)
    } else {
      this.props.router.replace('/')
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    const email = this.refs.username.value
    const pass = this.refs.pass.value
    auth.login(email, pass, (loggedIn) => { })
  }

  render() {
    return (
      <div className="container">
        <form className="form-signin" onSubmit={this.handleSubmit}>
          <h2 className="form-signin-heading">Please sign in</h2>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="text" ref="username" className="form-control" placeholder="User Name" required autoFocus />
          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" ref="pass" className="form-control" placeholder="Password" required />
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
          <br/>
          {auth.failedLogin && (<p style={{color: "darkred"}}>{auth.errorMessage}</p> )}
        </form>
      </div>
    )
  }
})

export default Login;
