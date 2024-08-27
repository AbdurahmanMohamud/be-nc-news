const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const articleData = require("../db/data/test-data/articles");
const commentData = require("../db/data/test-data/comments");
const indexData = require("../db/data/test-data/index");
const topicData = require("../db/data/test-data/topics");
const userData = require("../db/data/test-data/users");

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
    return request(app).get("/api/not-a-route").expect(404);
  });
});

describe("/api", () => {
  test("GET: 200, Should: Be available on /api. Document all other endpoints available.", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        console.log(response.body);
        const endpoints = response.body;
        expect(endpoints).toHaveProperty("GET /api");
        expect(endpoints).toHaveProperty("GET /api/topics");
        expect(endpoints).toHaveProperty("GET /api/articles");
      });
  });
});
