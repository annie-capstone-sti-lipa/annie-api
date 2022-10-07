import { fireBaseHelper } from "..";
import kanaOrdering from "../types/kana-ordering";
import KanaQuiz from "../types/kana-quiz";
import writingSystem from "../types/writing-system";

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

  public async saveKanji() {
    const fs = require("fs");

    let rawdata = fs.readFileSync("src/helpers/kanji.json");

    let kanji = JSON.parse(rawdata);
    let filteredKanji = [];

    for (let i = 0; i < Object.keys(kanji).length; i++) {
      let key = Object.keys(kanji)[i];
      let theThing = kanji[key];

      let meanings = theThing["meanings"];
      let onyomi = theThing["readings_on"];
      let kunyomi = theThing["readings_kun"];

      if (meanings.length > 0 && onyomi.length > 0 && kunyomi.length > 0) {
        filteredKanji.push({
          character: Object.keys(kanji)[i],
          meanings: meanings,
          onyomi_readings: onyomi,
          kunyomi_readings: kunyomi,
        });
        console.log("added :" + key);
        console.log("index :" + i + " out of " + Object.keys(kanji).length);
      } else {
        console.log("SKIPPED");
      }

      // if (meanings.length > 0 && onyomi.length > 0 && kunyomi.length > 0) {
      //   await setDoc(doc(this.firestore, "kanji", key), {
      //     character: Object.keys(kanji)[i],
      //     meanings: meanings,
      //     onyomi_readings: onyomi,
      //     kunyomi_readings: kunyomi,
      //   });
      //   console.log("added :" + key);
      //   console.log("index :" + i + " out of " + Object.keys(kanji).length);
      // } else {
      //   console.log("SKIPPED");
      // }
    }

    fs.writeFileSync(
      "src/jsons/filtered-kanji.json",
      JSON.stringify(filteredKanji)
    );
    console.log("donezo");
  }
}

export default QuizHelper;
