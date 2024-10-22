function buildSearchParams(requestBody) {
  //destructure the search request params here
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults,
    children,
    infants,
    travelClass,
    tripType,
  } = requestBody;
  let fromTo = [{ from: origin, to: destination, departureDate }];
  if (tripType == "return") {
    fromTo.push({ from: destination, to: origin, departureDate: returnDate });
  }
  return { fromTo, adults, children, infants, travelClass };
}
module.exports = { buildSearchParams };
