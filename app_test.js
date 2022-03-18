import { superoak } from "./deps.js";
import { app } from "./app.js";

const users = [];

Deno.test({
  name: "Test1 main",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test2 api random question",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/api/questions/random").expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test3 api answer question",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer").send(
      '{"questionId": 1 , "optionId": 1 }',
    ).expect({ "correct": true });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test4 api answer question with wrong option_id",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer").send(
      '{"questionId": 1 , "optionId": 999 }',
    ).expect({ error: "Question or option not correct" });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test5 api answer question with completely wrong json",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/api/questions/answer").send(
      '{"cats": 1 , "dogs": 999 }',
    ).expect({ error: "Bad JSON data" });
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test6 try to access content without auth",
  async fn() {
    const testClient = await superoak(app);
    await testClient.get("/statistics").expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test7 registration",
  async fn() {
    const random = Math.random(1000000);
    users.push(`test${random}@mail.com`);
    const testClient = await superoak(app);
    await testClient.post("/auth/register").send(
      `email=test${random}@mail.com&password=password`,
    ).expect("Redirecting to /auth/login.");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test8 login",
  async fn() {
    const testClient = await superoak(app);
    await testClient.post("/auth/login").send(
      `email=${users[0]}&password=password`,
    ).expect("location", "/questions");
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test9 access content logged in",
  async fn() {
    let response = await superoak(app);
    const res = await response.post("/auth/login").send(
      `email=${users[0]}&password=password`,
    ).expect("location", "/questions");

    const headers = res.headers["set-cookie"];
    const cookie = headers.split(";")[0];

    response = await superoak(app);
    await response
      .get("/statistics")
      .set("Cookie", cookie)
      .expect(200);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "Test10 quiz logged in",
  async fn() {
    let response = await superoak(app);
    const res = await response.post("/auth/login").send(
      `email=${users[0]}&password=password`,
    ).expect("location", "/questions");

    const headers = res.headers["set-cookie"];
    const cookie = headers.split(";")[0];

    response = await superoak(app);
    await response
      .get("/quiz")
      .set("Cookie", cookie)
      .expect("location", RegExp("/quiz/"));
  },
  sanitizeResources: false,
  sanitizeOps: false,
});
