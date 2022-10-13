import { fireBaseHelper, hiraganaList, katakanaList } from "..";
import kana from "../types/kana";
import kanaOrdering from "../types/kana-ordering";
import KanaQuiz from "../types/kana-quiz";
import writingSystem from "../types/writing-system";

class QuizHelper {
  // static async getKanaQuiz(
  //   writingSystem: writingSystem,
  //   ordering: kanaOrdering
  // ): Promise<Array<KanaQuiz>> {
  //   let questions: Array<KanaQuiz> = [];
  //   let kanaList = await fireBaseHelper.getKana(writingSystem, ordering);

  //   let indexes = [...Array(kanaList.length).keys()];
  //   indexes.sort(() => Math.random() - 0.5);
  //   indexes.splice(10);

  //   indexes.forEach((index) => {
  //     questions.push(new KanaQuiz(index, kanaList));
  //   });

  //   return questions;
  // }

  public static getKanaQuiz(writing: writingSystem, ordering: kanaOrdering) {
    let kanas: Array<kana> =
      writing == writingSystem.hiragana
        ? hiraganaList
        : writing === writingSystem.katakana
        ? katakanaList
        : [];

    let kanaList = kanas.filter((item: kana) => {
      return item.type === ordering;
    });

    let questions: Array<KanaQuiz> = [];

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
