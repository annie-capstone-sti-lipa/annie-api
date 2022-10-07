import { fireBaseHelper } from ".";
import kanaOrdering from "./types/kana-ordering";
import KanaQuiz from "./types/kana-quiz";
import writingSystem from "./types/writing-system";

class QuizHelper {
  static async getKanaQuiz(
    writingSystem: writingSystem,
    ordering: kanaOrdering
  ): Promise<Array<KanaQuiz>> {
    let questions: Array<KanaQuiz> = [];
    let kanaList = await fireBaseHelper.getKana(writingSystem, ordering);

    let indexes = [...Array(kanaList.length).keys()];
    indexes.sort(() => Math.random() - 0.5);
    indexes.splice(10);

    indexes.forEach((index) => {
      questions.push(new KanaQuiz(index, kanaList));
    });

    return questions;
  }
}

export default QuizHelper;
