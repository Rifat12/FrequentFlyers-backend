//build a OAuhRQ like flightOffersSearchRQ
//compare this snippet from requests/flighOffersSearchRQ.js:
const sender = require("../utils/sender");
async function OAuthRQ(params) {
  const apiVersion = "v1";
  const endPoint = "security/oauth2/token";
  const reqType = "OAuth";
  const httpMethod = "POST";
  const formData = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: "client_credentials",
  };
  authHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const dataUrlEncoded = new URLSearchParams(formData).toString();
  return await sender.sendRequest(
    apiVersion,
    endPoint,
    reqType,
    httpMethod,
    dataUrlEncoded,
    authHeaders
  );
}

module.exports = OAuthRQ;
