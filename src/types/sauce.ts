export default class Sauce {
  similarity: number;
  sauce: string;
  thumbnail: string;
  extUrls: Array<String>;

  constructor(result: any) {
    this.similarity = result?.header?.similarity;
    this.sauce =
      result?.data?.title ??
      result?.data?.creator ??
      result?.data?.source ??
      result?.data?.author;
    this.thumbnail = result?.header?.thumbnail;
    this.extUrls = result?.data.ext_urls;
  }
}
