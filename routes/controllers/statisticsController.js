import * as statisticsService from "../../services/statisticsService.js";

const showStatistics = async ({ render, user }) => {
  render("statistics.eta", {
    numberOfOwnAnswers: await statisticsService.numberOfOwnAnswers(user.id),
    numberOfAnswers: await statisticsService.numberOfAnswers(user.id),
    numberOfCorrectAnswers: await statisticsService.numberOfCorrectAnswers(
      user.id,
    ),
    mostAnsweredQuestions: await statisticsService
      .findFiveUsersWithMostAnsweredQuestions(),
  });
};

export { showStatistics };
