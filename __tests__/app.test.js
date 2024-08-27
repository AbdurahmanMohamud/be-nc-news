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

describe("/api/topics", () => {
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

describe("/api", () => {
  test("GET: 200, Should: Be available on /api. Document all other endpoints available.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        const endpoints = response.body;
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/topics");
        expect(endpoints).toHaveProperty("GET /api/articles");
      });
  });
});

describe("/api/articles/:article_id", () => {
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
