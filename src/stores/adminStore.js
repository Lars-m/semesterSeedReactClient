
import { extendObservable,action } from "mobx";
import fetchHelper from "./fetchHelpers"
const URL = require("../../package.json").serverURL;

/* encapsulates Data related to Admins */
class AdminStore {

  constructor(url) {
    this.url = url;
    extendObservable(this, {
      messageFromServer: "",
      errorMessage: "",
      getData : action(this.getData),
      setErrorMessage : action(this.setErrorMessage),
      setMessageFromServer : action(this.setMessageFromServer)
    });
  }

  setErrorMessage(err){
    this.errorMessage = err;
  }

  setMessageFromServer(msg){
    this.messageFromServer = msg;
  }


  getData = () => {
    this.errorMessage = "";
    this.messageFromServer = "";
    let errorCode = 200;
    const options = fetchHelper.makeOptions("GET", true);
    fetch(this.url + "api/demoadmin", options)
      .then((res) => {
        if (res.status > 200 || !res.ok) {
          errorCode = res.status;
        }
        return res.json();
      })
      .then((res) => {
        if (errorCode !== 200) {
          throw new Error(`${res.error.message} (${res.error.code})`);
        }
        else {
          this.setMessageFromServer(res.message);
        }
      }).catch(err => {
        //This is the only way (I have found) to veryfy server is not running
        this.setErrorMessage(fetchHelper.addJustErrorMessage(err));
        
      })
  
}
}
let admStore = new AdminStore(URL);

//Only for debugging
//window.adminStore = adminStore;
export default admStore;