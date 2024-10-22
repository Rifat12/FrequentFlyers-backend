const axios = require("axios");
const baseURL = process.env.API_URL;

async function sendRequest(
  apiVersion,
  endPoint,
  reqType,
  httpMethod,
  body,
  headersData = undefined
) {
  try {
    const headers = {};

    let config = {
      method: httpMethod,
      url: `${baseURL}/${apiVersion}/${endPoint}`,
      data: body,
      headers: headersData ? headersData : headers,
    };
    console.log("API WAS HIT!");
    //log requestType and url and use proper language
    console.log(
      `Request Type: ${reqType} \nRequest URL: ${
        config.url
      } \nRequest Body: ${JSON.stringify(config.data)}`
    );
    const response = await axios(config);

    return { success: true, data: response.data };
  } catch (error) {
    console.error(error.data);
    return { success: false, error: error.data };
  }
}
module.exports = { sendRequest };
