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
        const topics = response.body.topics.rows;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
  test("GET: 404, Responds with a 404 status code due to an invalid endpoint", () => {
    return request(app).get("/api/not-a-route").expect(404);
  });
});
