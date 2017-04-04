
export default {
  /**
   * @param {*} method POST,GET,DELETE, etc.
   * @param {*} authenticate pass in true, if the authentication heades must be attached
   * @param {*} data , if any, for POST or PUT
   */
  makeOptions: function(method, authenticate, data) {
    let headers = {
      "Content-type": "Application/json"
    };
    if (authenticate) {
      headers.Authorization = `Bearer ${sessionStorage.token}`;
    }
    let options = {
      method,
      headers
    }
    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }
    return options;
  },
  /**
   * Provide a better error message, that the one supplied by fetch
   * @param {*} err 
   */
  addJustErrorMessage(err){
    return  (err.message) === "Failed to fetch" ? `${err.message} (is the server running?)`: err.message;
  }
}