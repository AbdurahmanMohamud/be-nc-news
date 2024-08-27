const db = require("../db/connection");

const findArticle = (id) => {
  return db
    .query(
      `SELECT * FROM articles
        WHERE article_id = $1;`,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({
          status: 404,
          message: "This id does not exist",
        });
      else 
      return rows;
    });
};
module.exports = { findArticle };
