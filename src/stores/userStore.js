
import { extendObservable,action } from "mobx";
import fetchHelper from "./fetchHelpers"
const URL = require("../../package.json").serverURL;


class UserStore {

  constructor(url) {
    console.log("Constructed");
    this.url = url;
    extendObservable(this, {
      messageFromServer: "",
      errorMessage: "",
      getData : action(this.getData),
      setErrorMessage : action(this.setErrorMessage)
    });
  }

  setErrorMessage(err){
    this.errorMessage = err;
  }


  getData = () =>{
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
      .then(action((res) => {  //Note the action wrapper to allow for useStrict
        if (errorCode !== 200) {
          throw new Error(`${res.error.message} (${res.error.code})`);
        }
        else {
          this.messageFromServer = res.message;
        }
      })).catch(err => {
        //This is the only way (I have found) to veryfy server is not running
        this.setErrorMessage(fetchHelper.addJustErrorMessage(err));
      })
  }
}

let uStore = new UserStore(URL);

//Only for debugging
//window.userStore = uStore;
export default uStore;
