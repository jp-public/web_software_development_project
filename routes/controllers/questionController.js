import * as questionService from "../../services/questionService.js";
import { validasaur } from "../../deps.js";

const questionValidationRules = {
  title: [validasaur.required, validasaur.minLength(1)],
  question_text: [validasaur.required, validasaur.minLength(1)],
};

const getQuestionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  return {
    title: params.get("title"),
    question_text: params.get("question_text"),
  };
};

const addQuestion = async ({ request, response, user, render }) => {
  const questionData = await getQuestionData(request);

  const [passes, errors] = await validasaur.validate(
    questionData,
    questionValidationRules,
  );

  if (!passes) {
    render("questions.eta", {
      questions: await questionService.listQuestionsByUser(user.id),
      title: questionData.title,
      question_text: questionData.question_text,
      errors: errors,
    });
  } else {
    await questionService.addQuestion(
      user.id,
      questionData.title,
      questionData.question_text,
    );

    response.redirect("/questions");
  }
};

const optionValidationRules = {
  option_text: [validasaur.required, validasaur.minLength(1)],
};

const getOptionData = async (request) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  let isCorrect = false;
  if (params.get("is_correct")) {
    isCorrect = true;
  }
  return {
    option_text: params.get("option_text"),
    is_correct: isCorrect,
  };
};

const addOption = async ({ request, response, params, user, render }) => {
  const optionData = await getOptionData(request);

  const question = await questionService.findQuestionById(params.id);
  if (question.user_id == user.id) {
    const [passes, errors] = await validasaur.validate(
      optionData,
      optionValidationRules,
    );

    if (!passes) {
      render("question.eta", {
        question: question,
        options: await questionService.listOptions(params.id),
        errors: errors,
      });
    } else {
      await questionService.addOption(
        params.id,
        optionData.option_text,
        optionData.is_correct,
      );
      response.redirect(`/questions/${params.id}`);
    }
  } else {
    response.redirect(`/questions`);
  }
};

const viewQuestion = async ({ render, params }) => {
  render("question.eta", {
    question: await questionService.findQuestionById(params.id),
    options: await questionService.listOptions(params.id),
  });
};

const listQuestionsByUser = async ({ render, user }) => {
  render("questions.eta", {
    questions: await questionService.listQuestionsByUser(user.id),
    title: "",
  });
};

const viewQuizQuestion = async ({ render, params }) => {
  render("quizQuestion.eta", {
    question: await questionService.findQuestionById(params.id),
    options: await questionService.listOptions(params.id),
  });
};

const answerQuestion = async ({ params, response, user }) => {
  const answeredOption = await questionService.findOptionById(params.optionId);
  const isCorrect = answeredOption.is_correct;
  await questionService.addAnswer(
    user.id,
    params.questionId,
    params.optionId,
    isCorrect,
  );
  if (isCorrect) {
    response.redirect(`/quiz/${params.questionId}/correct`);
  } else {
    response.redirect(`/quiz/${params.questionId}/incorrect`);
  }
};

const correctAnswer = ({ render }) => render("correct.eta");

const incorrectAnswer = async ({ render, params }) => {
  render("incorrect.eta", {
    correct: await questionService.findCorrectOption(params.id),
  });
};

const getRandomQuestion = async ({ render, response }) => {
  const question = await questionService.listRandomQuestion();
  if (question == -1) {
    render("quiz.eta");
  } else {
    response.redirect(`/quiz/${question.id}`);
  }
};

const deleteOption = async ({ response, params, user }) => {
  const question = await questionService.findQuestionById(params.questionId);
  if (question.user_id == user.id) {
    await questionService.deleteOption(params.optionId);
    response.redirect(`/questions/${params.questionId}`);
  } else {
    response.redirect(`/questions`);
  }
};

const deleteQuestion = async ({ response, params, user }) => {
  const question = await questionService.findQuestionById(params.id);
  if (question.user_id == user.id) {
    await questionService.deleteQuestion(params.id);
  }
  response.redirect("/questions");
};

export {
  addOption,
  addQuestion,
  answerQuestion,
  correctAnswer,
  deleteOption,
  deleteQuestion,
  getRandomQuestion,
  incorrectAnswer,
  listQuestionsByUser,
  viewQuestion,
  viewQuizQuestion,
};
