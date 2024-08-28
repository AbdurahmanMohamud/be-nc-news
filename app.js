const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getApi } = require("./controllers/api.controllers");
const {
  getArticle,
  getArticles,
} = require("./controllers/articles.controllers");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticle);

app.get("/api/articles", getArticles);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "invalid request" });
  } else {
    next(err);
  }
});
module.exports = app;
