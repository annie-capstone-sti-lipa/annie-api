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

app.listen(process.env.PORT);
