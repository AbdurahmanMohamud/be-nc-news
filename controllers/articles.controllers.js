const { findArticle } = require("../models/articles.models");
const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  findArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err)
    });
};
module.exports = { getArticle };