const OAuthRQ = require("../requests/OAuthRQ");
const moment = require("moment");
const NodeCache = require("node-cache");

// Initialize cache with standard TTL of 30 minutes
const cache = new NodeCache({ stdTTL: 1800 });
const CACHE_KEY = "amadeusOAuth2Token";

async function OAuth() {
  // Try to get token from cache
  let auth = cache.get(CACHE_KEY);

  // Check if the token doesn't exist or has expired
  if (!auth || moment(auth.expires_in).isBefore(moment())) {
    // Fetch a new token from the API
    const wholeRes = await OAuthRQ();
    const OAuthRes = wholeRes.data;

    // Create auth object
    auth = {
      type: OAuthRes.type,
      client_id: OAuthRes.client_id,
      token_type: OAuthRes.token_type,
      access_token: OAuthRes.access_token,
      expires_in: moment()
        .add(OAuthRes.expires_in, "seconds")
        .format("YYYY-MM-DD HH:mm:ss")
        .toString(),
      extraParams: JSON.stringify(OAuthRes),
    };

    // Store in cache
    // Set TTL to slightly less than token expiry time to ensure we refresh before expiration
    const ttl = Math.floor(OAuthRes.expires_in * 0.9); // 90% of expiry time
    cache.set(CACHE_KEY, auth, ttl);
  }

  console.log("Token expires at:", auth.expires_in);
  return auth.access_token;
}

module.exports = { OAuth };
