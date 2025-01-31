import FormData from "form-data";
import fetch from "node-fetch";
import { fireBaseHelper } from "..";
import Sauce from "../types/sauce";

export default class SauceNaoHelper {
  private apiKey;
  private url = "https://saucenao.com/search.php";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  fromImage = (image: Express.Multer.File) => {
    let formData = new FormData();
    formData.append("file", Buffer.from(image.buffer), image.originalname);

    return this.sendRequest(formData);
  };

  fromLink = (image: String) => {
    let formData = new FormData();
    formData.append("url", image);

    return this.sendRequest(formData);
  };

  private sendRequest = async (formData: FormData): Promise<Array<Sauce>> => {
    formData.append("output_type", "2");
    formData.append("numres", "1");
    formData.append("minsim", "80");
    formData.append("hide", "2");
    formData.append("api_key", this.apiKey);

    let response = await fetch(this.url, {
      body: formData,
      method: "POST",
    })
      .then((data) => data.json())
      .catch((e) => fireBaseHelper.saveError(e.toString(), "saucenao error"));

    let results: Array<Sauce> = [];

    response?.results?.forEach((result: any) => {
      if (result.header.similarity > 45) {
        results.push(new Sauce(result));
      }
    });

    return results;
  };
}
