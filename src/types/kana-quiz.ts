import Kana from "./kana";

class KanaQuiz {
  kana: string;
  correctAnswer: string;
  romajiChoices: Array<string> = [];

  constructor(index: number, kanaList: Array<Kana>) {
    this.kana = kanaList[index].kana;
    this.correctAnswer = kanaList[index].romaji;

    let indexes = [...Array(kanaList.length).keys()];
    indexes.splice(index, 1);
    indexes.sort(() => Math.random() - 0.5);
    indexes.splice(3);

    indexes.forEach((index) => {
      this.romajiChoices.push(kanaList[index].romaji);
    });
    this.romajiChoices.push(this.correctAnswer);

    this.romajiChoices.sort(() => Math.random() - 0.5);
  }
}

export default KanaQuiz;
