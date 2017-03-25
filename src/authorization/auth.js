import { extendObservable, computed,action } from "mobx";

const jwtDecode = require("jwt-decode");
const URL = require("../../package.json").serverURL;
import fetchHelper from "../stores/fetchHelpers"

class AuthenticationHandler {

  constructor() {
    extendObservable(this, {
      token: null,  //Keps users logged in, even after a refresh of the page
      failedLogin: false,
      userName: "",
      isAdmin: false,
      errorMessage: "",
      isUser: false,
      loggedIn: computed(function () {
        return this.token !== null;
      }),
      setFailedLogin : action(this.setFailedLogin),
      setToken : action(this.setToken),
      initDataFromToken : action(this.initDataFromToken),
      setFailedLogin : action(this.setFailedLogin),
      logout: action(this.logout)
    })
  }

  setToken = (value) => {
    localStorage.token = value;
    this.initDataFromToken();
  }

  initDataFromToken = () => {
    console.log("Initializing Data From Token");
    if (!localStorage.token) {
      return;
    }
    this.token = localStorage.token;
    var decoded = jwtDecode(this.token);
    this.userName = decoded.username;
    this.isAdmin = false;
    this.isUser = false;
    decoded.roles.forEach(function (role) {
      if (role === "Admin") {
        this.isAdmin = true;
      }
      if (role === "User") {
        this.isUser = true;
      }
    }, this);
  }

  setFailedLogin = (value, msg) => {
    this.failedLogin = value;
    this.errorMessage = msg;
  }

  logout = () => {
    console.log("Logout");
    delete localStorage.token;
    this.token = null;
    this.userName = "";
    this.username = "";
    this.isAdmin = false;
    this.isUser = false;
    this.errorMessage = "";
  }

  login = (username, password, cb) => {
    var self = this; //Required because of exception handling below, which looses this
    this.setFailedLogin(false, "");
    console.log("Login: " + self.token)
    cb = arguments[arguments.length - 1]
    if (this.token != null) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }

    var user = { username, password };

    var options = {
      method: "POST",
      body: JSON.stringify(user),
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    }
    fetch(URL + "api/login", options).then(res => {
      if (res.status === 400) {
        throw new Error("No Response from Server");
      }
      if (res.status === 401 || res.status === 403) {
        throw new Error("Sorry, you could not be authenticed");
      }
      if (res.status > 200 || !res.ok) {
        throw new Error("Unknow error while trying to login").b;
      }
      res.json().then(data => {
        this.setToken(data.token);
      });
    }).catch(err => {
      console.log(err.message);
      //Self because we use this with exceptions
      self.setFailedLogin(true, fetchHelper.addJustErrorMessage( err));
      
    })
    return;
  }
  
}

var auth = new AuthenticationHandler();

//Call init, if a new Instance was created due to a refresh (F5 or similar)
auth.initDataFromToken();

//Comment out for debugging
//window.auth = auth;

export default auth;


