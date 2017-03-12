
import { extendObservable } from "mobx";
import fetchHelper from "./fetchHelpers"

const URL = require("../../package.json").serverURL;

class UserDataHandler {

  constructor(url) {
    console.log("Constructed");
    this.url = url;
    extendObservable(this, {
      messageFromServer: "",
      errorMessage: ""
    });
  }

  getData = () => {
    this.errorMessage = "";
    this.messageFromServer = "";
    let errorCode = 200;
    const options = fetchHelper.makeOptions("GET", true);
    fetch(this.url + "api/demouser", options)
      .then((res) => {
        if (res.status > 210 || !res.ok) {
          errorCode = res.status;
        }
        return res.json();
      })
      .then((res) => {
        if (errorCode !== 200) {
          throw new Error(`${res.error.message} (${res.error.code})`);
        }
        else {
          this.messageFromServer = res.message;
        }
      }).catch(err => {
        //This is the only way (I have found) to veryfy server is not running
        this.errorMessage = fetchHelper.addJustErrorMessage(err);
      })
  }
}
let userDataHandler = new UserDataHandler(URL);

//Only for debugging
window.userDataHandler = userDataHandler;
export default userDataHandler;
