import FormData from "form-data";
import fetch from "node-fetch";

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

  private sendRequest = (formData: FormData): Promise<Object> => {
    formData.append("output_type", "2");
    formData.append("numres", "1");
    formData.append("minsim", "80");
    formData.append("api_key", this.apiKey);

    let response = fetch(this.url, {
      body: formData,
      method: "POST",
    })
      .then((data) => data.json())
      .catch((e) => console.log(e));

    return response;
  };
}
