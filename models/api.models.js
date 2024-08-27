const db = require("../db/connection");
const fs = require("fs/promises");
const findApi = () => {
  return fs.readFile(`./endpoints.json`).then((data) => {
    return JSON.parse(data);
  });
};

module.exports = { findApi };
