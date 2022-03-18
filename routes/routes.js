import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as questionController from "./controllers/questionController.js";
import * as registrationController from "./controllers/registrationController.js";
import * as loginController from "./controllers/loginController.js";
import * as statisticsController from "./controllers/statisticsController.js";
import * as questionApi from "./apis/questionApi.js";

const router = new Router();

router.get("/", mainController.showMain);

router.get("/questions", questionController.listQuestionsByUser);
router.post("/questions", questionController.addQuestion);
router.get("/questions/:id", questionController.viewQuestion);
router.post("/questions/:id/options", questionController.addOption);
router.post(
  "/questions/:questionId/options/:optionId/delete",
  questionController.deleteOption,
);
router.post("/questions/:id/delete", questionController.deleteQuestion);

router.get("/auth/register", registrationController.showRegistrationForm);
router.post("/auth/register", registrationController.registerUser);

router.get("/auth/login", loginController.showLoginForm);
router.post("/auth/login", loginController.processLogin);

router.get("/quiz", questionController.getRandomQuestion);
router.get("/quiz/:id", questionController.viewQuizQuestion);
router.post(
  "/quiz/:questionId/options/:optionId",
  questionController.answerQuestion,
);
router.get("/quiz/:id/correct", questionController.correctAnswer);
router.get("/quiz/:id/incorrect", questionController.incorrectAnswer);

router.get("/statistics", statisticsController.showStatistics);

router.get("/api/questions/random", questionApi.listRandomQuestion);
router.post("/api/questions/answer", questionApi.answerQuestion);

export { router };
