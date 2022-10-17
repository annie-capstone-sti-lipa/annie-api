import kanaOrdering from "./kana-ordering";
import KanjiReadings from "./kanji-readings";
import writingSystem from "./writing-system";

class QuizResult {
  userId: string;
  writingSystem: writingSystem;
  type: kanaOrdering | KanjiReadings;
  items: number;
  score: number;

  constructor(
    userId: string,
    writingSystem: writingSystem,
    type: kanaOrdering | KanjiReadings,
    items: number,
    score: number
  ) {
    this.userId = userId;
    this.writingSystem = writingSystem;
    this.type = type;
    this.items = items;
    this.score = score;
  }

  toObject = () => JSON.parse(JSON.stringify(this));
}

export default QuizResult;
