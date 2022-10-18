import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import SauceNaoHelper from "./helpers/saucenao-helper";
import cors from "cors";
import "dotenv/config";
import AnimeSchedulesHelper from "./helpers/schedules-helper";
import MyAnimeListHelper from "./helpers/myanimelist-helper";
import helmet from "helmet";
import FireBaseHelper from "./helpers/firebase-helpers";
import { initializeApp } from "firebase/app";
import kanaOrdering from "./types/kana-ordering";
import writingSystem from "./types/writing-system";
import QuizHelper from "./helpers/quiz-helper";
import hiraganas from "./jsons/hiragana";
import katakanas from "./jsons/katakana";
import kanjis from "./jsons/kanji";
import KanjiReadings from "./types/kanji-readings";
import QuizResult from "./types/quiz-result";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);
const myAnimeListHelper = new MyAnimeListHelper(process.env.CLIENT_ID!);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

initializeApp(require("../config.json"));

export const fireBaseHelper = new FireBaseHelper();

export const hiraganaList = hiraganas;
export const katakanaList = katakanas;
export const kanjiList = kanjis;

app.post("/sauce", upload.single("image"), async (req, res) => {
  let response: any = {};
  if (req.file !== undefined) {
    response["data"] = await sauceNaoHelper.fromImage(req.file!);
  } else if (req.body.imageLink !== undefined) {
    response["data"] = await sauceNaoHelper.fromLink(req.body.imageLink);
  } else {
    response = { data: [], error: "Image is required!" };
  }
  if (response["data"].length === 0) {
    response.error = "There were no matches for this image.";
  }
  res.send(response);
});

app.post("/save-quiz-result", async (req, res) => {
  fireBaseHelper
    .saveQuizResult(
      new QuizResult(
        req.body.userId,
        req.body.writingSystem,
        req.body.type,
        req.body.items,
        req.body.score
      )
    )
    .then((result) => {
      res.send(result);
    });
});

app.get("/getWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedulesHelper.getWeekSchedule());
});

app.get("/saveWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedulesHelper.saveWeekSchedule());
});

app.get("/mal-auth", (req, res) => {
  res.send({
    authLink: myAnimeListHelper.getAuthLink(),
  });
});

app.get("/kana-quiz", async (req, res) => {
  res.send(
    QuizHelper.getKanaQuiz(
      (req.query.writing as string).toLowerCase() as writingSystem,
      (req.query.ordering as string).toLowerCase() as kanaOrdering
    )
  );
});

app.get("/kanji-quiz", async (req, res) => {
  res.send(
    QuizHelper.getKanjiQuiz(
      (req.query.reading as string).toLowerCase() as KanjiReadings
    )
  );
});

app.get("/", async (req, res) => {
  res.send(
    "Hello there!, You shouldn't be here, go <a href='https://client-annie.me'>here</a> instead."
  );
});

app.get("/recommendations", async (req, res) => {
  res.send(
    await myAnimeListHelper.getSuggestions(
      Number(req.query.offset ?? "0") ?? 0,
      Number(req.query.limit ?? "0")
    )
  );
});

app.get("/quiz-scores", async (req, res) => {
  fireBaseHelper
    .getQuizScores(req.query.userId!.toString())
    .then((scores) => res.send(scores));
});

app.listen(process.env.PORT);
