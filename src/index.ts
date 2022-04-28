import express from "express";
import multer from "multer";

require("dotenv").config();

const app = express();
const upload = multer();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/sauce", upload.none(), (req, res) => {
  console.log(req.body);
  res.send({ response: "hello world" });
});

app.listen(process.env.PORT);
