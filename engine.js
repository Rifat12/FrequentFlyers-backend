const express = require("express");
const { flightSearch } = require("./services/flightSearch");

async function search(args) {
  const response = {
    success: true,
    responseType: "flight-search",
    data: await flightSearch(args),
  };
  return response;
}

async function book(args) {
  return {
    success: true,
    data: {},
  };
}
module.exports = {
  search,
  book,
};
