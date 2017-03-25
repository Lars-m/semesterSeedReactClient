import React, {Component} from 'react'
import auth from '../authorization/auth';

export default class Dashboard extends Component{
 
  render() {
    console.log("Dashboard"+auth.token)
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <h3>This Page is a left-over from the original React-Router login-example to demonstrate how to "force a login" 
        when requesting a protected page - without being logged-in</h3>
        <p>This is the current token in use: {auth.token}</p>
      </div>
    )
  }
}