import express from "express";
import multer from "multer";
import cookieParser from "cookie-parser";
import SauceNaoHelper from "./saucenao";
import cors from "cors";
import "dotenv/config";
import SuccessResponse from "./types/success-response";
import AnimeSchedules from "./schedules";
import MyAnimeListHelper from "./myanimelist";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);
const myAnimeListHelper = new MyAnimeListHelper(process.env.CLIENT_ID!);

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

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

app.get("/weekSchedule", async (req, res) => {
  res.send(await AnimeSchedules.getWeekSchedule());
});

app.get("/mal-auth", (req, res) => {
  console.log("hehe");
  res.send({
    authLink: myAnimeListHelper.getAuthLink(),
  });
});

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT);
