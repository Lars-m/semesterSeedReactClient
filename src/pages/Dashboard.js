import React, {Component} from 'react'
import auth from '../authorization/auth';

export default class Dashboard extends Component{
 
  render() {
    console.log("Dashboard"+auth.token)
    return (
      <div>
        <h1>Dashboard</h1>
        <p>You made it!</p>
        <p>{auth.token}</p>
      </div>
    )
  }
}