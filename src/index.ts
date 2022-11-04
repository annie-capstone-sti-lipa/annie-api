import express from "express";
import multer from "multer";
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
import UserInfo from "./types/user-info";
import AnimeStatus from "./types/anime-status";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());

initializeApp(require("../config.json"));

export const myAnimeListHelper = new MyAnimeListHelper(process.env.CLIENT_ID!);
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

app.post("/update-anime-status", async (req, res) => {
  let body = req.body;
  if ((await fireBaseHelper.getMalToken(body.userId)) === undefined) {
    res.send({
      error:
        "You need to grant permissions to your MyAnimeList account to perform such actions.",
      link: myAnimeListHelper.getAuthLink(body.userId),
    });
  } else {
    if (req.body.status === AnimeStatus.completed) {
      res.send(
        await myAnimeListHelper.completedAnimeStatus(
          body.animeId,
          body.status,
          body.score,
          body.num_watched_episodes,
          body.userId
        )
      );
    } else {
      res.send(
        await myAnimeListHelper.updateAnimeStatus(
          body.animeId,
          body.status,
          body.userId
        )
      );
    }
  }
});

app.post("/save-user-info", async (req, res) => {
  fireBaseHelper
    .saveUserInfo(new UserInfo(req.body.name, req.body.bio), req.body.userId)
    .then((result) => {
      res.send(result);
    });
});

app.get("/user-info", async (req, res) => {
  fireBaseHelper.getUserInfo(req.query.userId!.toString()).then((result) => {
    res.send({ userInfo: result });
  });
});

app.get("/getWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedulesHelper.getWeekSchedule());
});

app.get("/saveWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedulesHelper.saveWeekSchedule());
});

app.get("/discord-auth", (req, res) => {
  res.send({
    message: `.register ${req.query.userId}`,
    link: "https://discord.com/users/955202644702556260",
  });
});

app.get("/mal-auth", (req, res) => {
  res.send({
    authLink: myAnimeListHelper.getAuthLink(req.query.userId as string),
  });
});

app.get("/save-auth-code", (req, res) => {
  myAnimeListHelper.generateMalToken(req.query);
  res.redirect("https://client-annie.me");
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

app.get("/", async (_, res) => {
  res.redirect("https://client-annie.me");
});

app.get("/recommendations", async (req, res) => {
  res.send(
    await myAnimeListHelper.getSuggestions(
      req.query.userId as string,
      Number(req.query.offset ?? "0") ?? 0,
      Number(req.query.limit ?? "0")
    )
  );
});

app.get("/recommendations-discord", async (req, res) => {
  fireBaseHelper
    .getUserIdFromDiscordId(req.query.discord_id as string)
    .then(async (userId) => {
      if (userId === null) {
        res.send({ error: "no userId" });
      } else {
        res.send(
          (
            await myAnimeListHelper.getSuggestions(
              userId ?? "",
              Number(req.query.offset ?? "0") ?? 0,
              Number(1)
            )
          )[0]
        );
      }
    });
});

app.get("/quiz-scores", async (req, res) => {
  fireBaseHelper
    .getQuizScores(req.query.userId!.toString())
    .then((scores) => res.send(scores));
});

app.listen(process.env.PORT);
