const db = require("../db/connection");

const findTopics = () => {
  return db.query(`SELECT * FROM topics;`);
};

module.exports = { findTopics };
