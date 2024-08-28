const {
  findArticle,
  findArticles,
  findCommentsById,
} = require("../models/articles.models");
const getArticle = (req, res, next) => {
  const { article_id } = req.params;
  findArticle(article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  findArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsById = (req, res, next) => {
  const { article_id } = req.params;
  findCommentsById(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticle, getArticles, getCommentsById };
