import { executeQuery } from "../database/database.js";

const numberOfAnswers = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*) FROM question_answers WHERE user_id = $1;`,
    userId,
  );
  return res.rows[0];
};

const numberOfCorrectAnswers = async (userId) => {
  const res = await executeQuery(
    `SELECT count(*) FROM question_answers WHERE user_id = $1 and correct = true;`,
    userId,
  );
  return res.rows[0];
};

const numberOfOwnAnswers = async (userId) => {
  const res = await executeQuery(
    `SELECT question_id FROM question_answers WHERE user_id = $1;`,
    userId,
  );
  let count = 0;
  for (const id in res.rows) {
    const question = await executeQuery(
      `SELECT user_id FROM questions WHERE id = $1;`,
      res.rows[id].question_id,
    );
    if (question.rows[0].user_id == userId) {
      count++;
    }
  }
  return count;
};

const findFiveUsersWithMostAnsweredQuestions = async () => {
  const res = await executeQuery(
    `SELECT users.email as email, count(*) as count FROM users
    JOIN question_answers ON users.id = question_answers.user_id
    GROUP BY users.email
    ORDER BY count DESC
    LIMIT 5`,
  );

  return res.rows;
};

export {
  findFiveUsersWithMostAnsweredQuestions,
  numberOfAnswers,
  numberOfCorrectAnswers,
  numberOfOwnAnswers,
};
