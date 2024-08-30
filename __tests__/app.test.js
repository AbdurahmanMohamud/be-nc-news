const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const articleData = require("../db/data/test-data/articles");
const commentData = require("../db/data/test-data/comments");
const indexData = require("../db/data/test-data/index");
const topicData = require("../db/data/test-data/topics");
const userData = require("../db/data/test-data/users");
const endpointsData = require("../endpoints.json");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("invalid enpoint", () => {
  test("GET: 404, Responds with a 404 status code due to an invalid endpoint", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("not found");
      });
  });
});

describe("GET: /api/topics", () => {
  test("GET: 200, Responds with: an array of topic objects, each of which should have the following properties:slug, description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const topics = response.body.topics;
        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length > 0).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});

describe("GET: /api", () => {
  test("GET: 200, Should: Be available on /api. Document all other endpoints available.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;
        expect(endpoints).toEqual(endpointsData);
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/topics");
        expect(endpoints).toHaveProperty("GET /api/articles");
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("GET: 200 Responds with: an article object, which should have the following properties: author, title, article_id, body, topic, created_at, votes, article_img_url", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const article = response.body[0];
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
      });
  });
  test("GET: 404 responds with a 404 status code if id is not found", () => {
    return request(app).get("/api/articles/0123456789").expect(404);
  });
  test("GET: 400 responds with a 400 status code if invalid id is given", () => {
    return request(app)
      .get("/api/articles/five")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid request");
      });
  });
});

describe("GET: /api/articles", () => {
  test("GET: 200, Responds with: an articles array of article objects, each of which should have the following properties: author, title, article_id, topic, created_at, votes, article_img_url, comment_count. The articles should also be sorted by date in descending order.", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        const articles = res.body;
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length > 0).toBe(true);
        articles.forEach((article) => {
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
          expect(article).not.toHaveProperty("body");
        });
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("GET:200, Responds with: an array of comments for the given article_id of which each comment should have the following properties: comment_id, votes, created_at, author, body, article_id, Comments should be served with the most recent comments first.", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        const comments = res.body;
        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length > 0).toBe(true);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
      });
  });
  test("GET:404 responds with a 404 status code if id is not found", () => {
    return request(app).get("/api/articles/123456789/comments").expect(404);
  });
  test("GET: 400 responds with a 400 status code if invalid id is given", () => {
    return request(app)
      .get("/api/articles/five/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid request");
      });
  });
});

describe("POST: /api/articles/:article_id/comments", () => {
  test("POST:201 should add a comment for an article. Request body accepts an object with the following properties:username, body. Responds with the posted comment.", () => {
    const commentToAdd = {
      username: "butter_bridge",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/2/comments")
      .send(commentToAdd)
      .expect(201)
      .then((res) => {
        const postedComment = res.body.body;
        expect(postedComment).toBe("This is a comment");
      });
  });
  test("POST:404 responds with a 404 status code if id is not found", () => {
    const commentToAdd = {
      username: "lurker",
      body: "This is another comment",
    };
    return request(app)
      .post("/api/articles/22222/comments")
      .send(commentToAdd)
      .expect(404);
  });
  test("POST: 400 responds with a 400 status code if invalid id is given", () => {
    const commentToAdd = {
      username: "lurker",
      body: "This is another comment",
    };
    return request(app)
      .post("/api/articles/six/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid request");
      });
  });
  test("POST: 400 responds with a 400 status code if username or body is missing", () => {
    const commentToAdd = {
      username: "",
      body: "",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(commentToAdd)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("comment body or username missing");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("POST: 200 should update an article by article_id.", () => {
    const vote = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/1")
      .send(vote)
      .expect(200)
      .then((res) => {
        const article = res.body;
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("body");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");

        expect(article.votes).toBe(150);
      });
  });
  test("POST: 404 responds with a 404 status code if id is not found", () => {
    const vote = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/123456789")
      .send(vote)
      .expect(404)
      .then(({ res }) => {
        expect(res.statusMessage).toBe("Not Found");
      });
  });
  test("POST: 400 responds with a 400 status code if invalid id is given", () => {
    const vote = { inc_votes: 50 };
    return request(app)
      .patch("/api/articles/six")
      .send(vote)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid request");
      });
  });
  test("POST: 400 responds with a 400 status code if inc_votes is not a number", () => {
    const vote = { inc_votes: "fifty" };
    return request(app)
      .patch("/api/articles/123456789")
      .send(vote)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("invalid request");
      });
  });
});
