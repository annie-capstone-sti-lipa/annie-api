import { fireBaseHelper, hiraganaList, kanjiList, katakanaList } from "..";
import kana from "../types/kana";
import kanaOrdering from "../types/kana-ordering";
import KanaQuiz from "../types/kana-quiz";
import Kanji from "../types/kanji";
import KanjiQuiz from "../types/kanji-quiz";
import KanjiReadings from "../types/kanji-readings";
import writingSystem from "../types/writing-system";
import Helpers from "./helpers";

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

  public static getKanjiQuiz(kanjiReadings: KanjiReadings): Array<KanjiQuiz> {
    let randomKanjis: Array<Kanji> = [];

    while (randomKanjis.length < 10) {
      let theKanji = kanjiList[Helpers.randomNumber(0, kanjiList.length - 1)];
      if (!randomKanjis.map((e) => e.character).includes(theKanji.character)) {
        randomKanjis.push(new Kanji(theKanji));
      }
    }

    let questions: Array<KanjiQuiz> = [];

    randomKanjis.forEach((_, index) => {
      questions.push(new KanjiQuiz(index, kanjiReadings, randomKanjis));
    });
    return questions;
  }
}

export default QuizHelper;
