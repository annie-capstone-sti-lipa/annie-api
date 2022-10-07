import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import SauceNaoHelper from "./saucenao";
import cors from "cors";
import "dotenv/config";
import SuccessResponse from "./types/success-response";
import AnimeSchedules from "./schedules";
import MyAnimeListHelper from "./myanimelist";
import helmet from "helmet";
import FireBaseHelper from "./helpers/firebase-helpers";
import { initializeApp } from "firebase/app";
import { secureHeapUsed } from "crypto";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);
const myAnimeListHelper = new MyAnimeListHelper(process.env.CLIENT_ID!);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use(cookieParser(process.env.COOKIE_SECRET));

initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
});

export const fireBaseHelper = new FireBaseHelper();

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

app.post("/login", async (req, res) => {
  setTimeout(() => {
    res.send(new SuccessResponse(true, "Logged in successfully."));
  }, 1000);
});

app.get("/getWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedules.getWeekSchedule());
});

app.get("/saveWeekSchedule", async (req, res) => {
  res.send(await AnimeSchedules.saveWeekSchedule());
});

app.get("/mal-auth", (req, res) => {
  res.send({
    authLink: myAnimeListHelper.getAuthLink(),
  });
});

app.get("/quizQuestions", (req, res) => {
  req.query.writingSystem;
  req.query.difficulty;

  res.send({
    authLink: myAnimeListHelper.getAuthLink(),
  });
});

app.get("/", async (req, res) => {
  res.send(
    "Hello there!, You shouldn't be here go <a href='https://client-annie.me'>here</a> instead."
  );
});

app.listen(process.env.PORT);
