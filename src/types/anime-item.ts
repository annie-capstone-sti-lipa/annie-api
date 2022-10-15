export default class AnimeItem {
  id: number;
  name: string;
  thumbnail: string;
  score: number;
  popularity: number;
  synopsis: string;
  genres: Array<string>;
  trailer?: string;
  startDate: string;
  endDate: string;

  constructor(jikanMoeData: any) {
    this.id = jikanMoeData.mal_id;
    this.name = jikanMoeData.title;
    this.thumbnail = jikanMoeData.images.jpg.large_image_url;
    this.score = jikanMoeData.score;
    this.synopsis = jikanMoeData.synopsis;
    this.popularity =
      jikanMoeData.popularity === null || jikanMoeData.popularity === 0
        ? 99999999
        : jikanMoeData.popularity!;
    this.genres = jikanMoeData.genres.map((genre: any) => genre.name);
    this.startDate = jikanMoeData.aired.from;
    this.endDate = jikanMoeData.aired.to;

    this.trailer = jikanMoeData.trailer.embed_url;
  }

  toObject = () => JSON.parse(JSON.stringify(this));
}
