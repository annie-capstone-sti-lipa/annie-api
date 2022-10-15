import Helpers from "../helpers/helpers";
import Kanji from "./kanji";
import KanjiReadings from "./kanji-readings";

class KanjiQuiz {
  character: string;
  correctAnswer: string;
  choices: Array<string> = [];

  constructor(
    index: number,
    readingType: KanjiReadings,
    randomKanjis: Array<Kanji>
  ) {
    let kanjiList = [...randomKanjis];
    let theThing = kanjiList[index];
    this.character = theThing.character;

    switch (readingType) {
      case KanjiReadings.onyomi:
        this.correctAnswer =
          theThing.onyomiReadings[
            Helpers.randomNumber(0, theThing.onyomiReadings.length - 1)
          ];
        break;
      case KanjiReadings.kunyomi:
        this.correctAnswer =
          theThing.kunyomiReadings[
            Helpers.randomNumber(0, theThing.kunyomiReadings.length - 1)
          ];
        break;
      case KanjiReadings.english:
        this.correctAnswer =
          theThing.meanings[
            Helpers.randomNumber(0, theThing.meanings.length - 1)
          ];
        break;
    }
    kanjiList.splice(index, 1);
    kanjiList.sort(() => Math.random() - 0.5);
    kanjiList.splice(3);

    kanjiList.forEach((kanji: Kanji) => {
      switch (readingType) {
        case KanjiReadings.onyomi:
          this.choices.push(
            kanji.onyomiReadings[
              Helpers.randomNumber(0, kanji.onyomiReadings.length - 1)
            ]
          );
          break;
        case KanjiReadings.kunyomi:
          this.choices.push(
            kanji.kunyomiReadings[
              Helpers.randomNumber(0, kanji.kunyomiReadings.length - 1)
            ]
          );
          break;
        case KanjiReadings.english:
          this.choices.push(
            kanji.meanings[Helpers.randomNumber(0, kanji.meanings.length - 1)]
          );
          break;
      }
    });
    this.choices.push(this.correctAnswer);
    this.choices.sort(() => Math.random() - 0.5);
  }
}

export default KanjiQuiz;
