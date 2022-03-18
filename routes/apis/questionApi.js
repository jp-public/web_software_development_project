import * as questionService from "../../services/questionService.js";

const listRandomQuestion = async ({ response }) => {
  const question = await questionService.listRandomQuestion();
  const options = await questionService.listOptions(question.id);
  const optionList = [];
  for (let i = 0; i < options.length; i++) {
    optionList.push({
      "optionId": options[i].id,
      "optionText": options[i].option_text,
    });
  }
  let responseJSON = {};
  if (question) {
    responseJSON = {
      "questionId": question.id,
      "questionTitle": question.title,
      "questionText": question.question_text,
      "answerOptions": optionList,
    };
  }
  response.body = responseJSON;
};

const answerQuestion = async ({ request, response }) => {
  const body = request.body({ type: "json" });
  const answer = await body.value;
  if (answer.questionId && answer.optionId) {
    const option = await questionService.findOptionById(answer.optionId);
    if (option != undefined) {
      response.body = { "correct": option.is_correct };
    } else {
      response.body = { "error": "Question or option not correct" };
    }
  } else {
    response.body = { "error": "Bad JSON data" };
  }
};

export { answerQuestion, listRandomQuestion };
