import { fireBaseHelper, kanjiList } from "..";
import kanaOrdering from "../types/kana-ordering";
import KanjiReadings from "../types/kanji-readings";
import QuizResult from "../types/quiz-result";
import writingSystem from "../types/writing-system";

class Helpers {
  public static randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static ids = [
    "h4RWWHACwlSF68KJHk8LIi8ZsJG2",
    "dm9w6tForVTbfUo0HL25QbbNjRl2",
    "F8lyQstjJ4PgvgQEpl7bpE8W1zk2",
    "ZH7DMbH7yQeWgMEDSBRUiNkvBby2",
    "rVPSPMToDqT9qAs74l0iD6lODzo1",
    "I53oyPHGPiVQVD2STOLagz2CUtt2",
    "HAoYfMfroPgij0i3UAwUccQE9923",
    "Hl6revr25Fg2P2vM3hNZdM17u1Y2",
  ];

  // Helpers.ids.forEach((id) => {
  //   Helpers.saveFakeQuiz(id, writingSystem.hiragana);
  //   Helpers.saveFakeQuiz(id, writingSystem.katakana);
  //   Helpers.saveFakeQuiz(id, writingSystem.kanji);
  // });

  // Helpers.saveFakeQuiz("Hl6revr25Fg2P2vM3hNZdM17u1Y2", writingSystem.hiragana);
  // Helpers.saveFakeQuiz("Hl6revr25Fg2P2vM3hNZdM17u1Y2", writingSystem.katakana);
  // Helpers.saveFakeQuiz("Hl6revr25Fg2P2vM3hNZdM17u1Y2", writingSystem.kanji);

  public static saveFakeQuiz(
    userId: string,
    selectedWritingSystem: writingSystem
  ) {
    let minScore = 5;
    let maxScore = 10;

    for (let i = 0; i < 1; i++) {
      let randomize = Helpers.randomNumber(1, 3);

      if (selectedWritingSystem === writingSystem.kanji) {
        fireBaseHelper
          .saveQuizResult(
            new QuizResult(
              userId,
              writingSystem.kanji,
              randomize === 1
                ? KanjiReadings.onyomi
                : randomize === 2
                ? KanjiReadings.kunyomi
                : KanjiReadings.english,
              10,
              Helpers.randomNumber(minScore, maxScore)
            )
          )
          .then((value) => {
            console.log(value);
            console.log(userId);
          });
      } else {
        fireBaseHelper
          .saveQuizResult(
            new QuizResult(
              userId,
              selectedWritingSystem,
              randomize === 1
                ? kanaOrdering.dakuon
                : randomize === 2
                ? kanaOrdering.gojuuon
                : kanaOrdering.youon,
              10,
              Helpers.randomNumber(minScore, maxScore)
            )
          )
          .then((value) => {
            console.log(value);
            console.log(userId);
          });
      }
    }
  }
}

export default Helpers;
