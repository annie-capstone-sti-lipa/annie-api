export default class SauceNaoHelper {
  private static apiKey = process.env.SAUCENAO!;
  private static url = "http://saucenao.com/search.php";

  static fromImage = (image: string) => {
    let formData = new FormData();
    formData.append("output_type", "2");
    formData.append("numres", "1");
    formData.append("minsim", "80");
    formData.append("api_key", SauceNaoHelper.apiKey);
    formData.append("file", image);

    fetch(SauceNaoHelper.url, {
      body: formData,
      method: "post",
    })
      .then((data) => data.json())
      .then((result) => console.log(result));
  };
}
