import express from "express";
import multer from "multer";
import SauceNaoHelper from "./saucenao";
import "dotenv/config";

const app = express();
const upload = multer();
const sauceNaoHelper = new SauceNaoHelper(process.env.SAUCENAO!);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sauce", upload.single("image"), async (req, res) => {
  if (req.file === undefined) {
    res.send(await sauceNaoHelper.fromLink(req.body.image));
  } else {
    res.send(await sauceNaoHelper.fromImage(req.file!));
  }
  res.send({ response: "hello world" });
});

app.listen(process.env.PORT);
