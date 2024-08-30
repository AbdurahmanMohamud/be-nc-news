const {
  findArticle,
  findArticles,
  findCommentsById,
  addCommentById,
  changeArticleById,
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

const postCommentById = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  addCommentById(body, article_id, username)
    .then((comment) => {
      res.status(201).send(comment);
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = {
  getArticle,
  getArticles,
  getCommentsById,
  postCommentById,
  patchArticleById,
};
