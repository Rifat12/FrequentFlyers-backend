const OAuthRQ = require("../requests/OAuthRQ");
const moment = require("moment");
const db = require("../models");

async function OAuth() {
  // Find the existing OAuth token
  let auth = await db.auth.findOne({
    where: {
      type: "amadeusOAuth2Token",
    },
  });

  // Check if the token doesn't exist or has expired
  if (!auth || moment(auth.expires_in).isBefore(moment())) {
    // Fetch a new token from the API
    const wholeRes = await OAuthRQ();
    const OAuthRes = wholeRes.data;

    if (auth) {
      await db.auth.destroy({
        where: {
          type: "amadeusOAuth2Token",
        },
      });
    }

    console.log(OAuthRes, "OAuthRes");

    // Save the new token to the database
    auth = await db.auth.create({
      type: OAuthRes.type,
      client_id: OAuthRes.client_id,
      token_type: OAuthRes.token_type,
      access_token: OAuthRes.access_token,
      expires_in: moment()
        .add(OAuthRes.expires_in, "seconds")
        .format("YYYY-MM-DD HH:mm:ss")
        .toString(),
      extraParams: JSON.stringify(OAuthRes),
    });
  }
  console.log("Expiry", auth.expires_in);
  return auth.access_token;
}

module.exports = { OAuth };
