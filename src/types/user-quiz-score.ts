import UserInfo from "./user-info";
import QuizScores from "./quiz-scores";

class UserQuizScore {
  user: UserInfo;
  quizScores: QuizScores;

  constructor(user: UserInfo, quizScores: QuizScores) {
    this.user = user;
    this.quizScores = quizScores;
  }
}

export default UserQuizScore;
