import { executeQuery } from "../database/database.js";

const addQuestion = async (userId, title, questionText) => {
  await executeQuery(
    `INSERT INTO questions
      (user_id, title, question_text)
        VALUES ($1, $2, $3)`,
    userId,
    title,
    questionText,
  );
};

const listRandomQuestion = async () => {
  const res = await executeQuery(
    `SELECT * FROM questions 
    ORDER BY RANDOM() 
    LIMIT 1;`,
  );
  if (res && res.rows.length > 0) {
    return res.rows[0];
  } else {
    return -1;
  }
};

const listQuestionsByUser = async (id) => {
  const res = await executeQuery(
    "SELECT * FROM questions WHERE user_id = $1;",
    id,
  );
  return res.rows;
};

const listOptions = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM question_answer_options WHERE question_id = $1;",
    id,
  );
  return result.rows;
};

const findQuestionById = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM questions WHERE id = $1;",
    id,
  );
  return result.rows[0];
};

const findOptionById = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM question_answer_options WHERE id = $1;",
    id,
  );
  return result.rows[0];
};

const findCorrectOption = async (id) => {
  const result = await executeQuery(
    "SELECT * FROM question_answer_options where question_id = $1 and is_correct = true;",
    id,
  );
  return result.rows[0];
};

const addOption = async (questionId, optionText, isCorrect) => {
  await executeQuery(
    `INSERT INTO question_answer_options
          (question_id, option_text, is_correct)
            VALUES ($1, $2, $3)`,
    questionId,
    optionText,
    isCorrect,
  );
};

const addAnswer = async (userId, questionId, optionId, isCorrect) => {
  await executeQuery(
    `INSERT INTO question_answers
          (user_id, question_id, question_answer_option_id, correct)
            VALUES ($1, $2, $3, $4)`,
    userId,
    questionId,
    optionId,
    isCorrect,
  );
};
const deleteOption = async (id) => {
  await executeQuery("DELETE FROM question_answer_options WHERE id = $1;", id);
  await executeQuery(
    "DELETE FROM question_answers WHERE question_answer_option_id = $1;",
    id,
  );
};

const deleteQuestion = async (id) => {
  await executeQuery("DELETE FROM questions WHERE id = $1;", id);
};

export {
  addAnswer,
  addOption,
  addQuestion,
  deleteOption,
  deleteQuestion,
  findCorrectOption,
  findOptionById,
  findQuestionById,
  listOptions,
  listQuestionsByUser,
  listRandomQuestion,
};
