import express from "express";
import multer from "multer";
import SauceNaoHelper from "./saucenao";
import cors from "cors";
import "dotenv/config";
import SuccessResponse from "./types/success-response";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(express.json());

app.post("/sauce", upload.single("image"), async (req, res) => {
  let response: any = {};
  if (req.body.image !== undefined) {
    response["data"] = await sauceNaoHelper.fromLink(req.body.image);
  } else if (req.file !== undefined) {
    response["data"] = await sauceNaoHelper.fromImage(req.file!);
  } else {
    response = { data: [], error: "Image is required!" };
  }
  res.send(response);
});

app.post("/login", async (req, res) => {
  setTimeout(() => {
    // res.send(new SuccessResponse(false, "Failed to login"));
    res.send(new SuccessResponse(true, "Logged in successfully."));
  }, 1000);
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(process.env.PORT);
