import base64url from "base64url";
import crypto from "crypto";
import { fireBaseHelper } from "..";
import AnimeItem from "../types/anime-item";

export default class MyAnimeListHelper {
  clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  getAuthLink = (): string => {
    const code_verifier = process.env.CODE_VERIFIER!;

    const base64Digest = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64");

    return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${
      this.clientId
    }&code_challenge=${base64url.fromBase64(base64Digest)}`;
  };

  getAnimeById = async (id: string): Promise<AnimeItem | null> => {
    return await fireBaseHelper.getAnime(id);
  };

  getSuggestions = async (
    offset: number,
    limit: number = 30
  ): Promise<Array<AnimeItem>> => {
    let response = await fetch(
      `https://api.myanimelist.net/v2/anime/ranking?ranking_type=bypopularity&limit=${limit}&offset=${offset}`,
      {
        method: "GET",
        headers: { "X-MAL-CLIENT-ID": this.clientId },
      }
    )
      .then((data) => data.json())
      .catch((e) => console.log(e));

    let recommendations: Array<AnimeItem> = [];
    if (response.data !== undefined) {
      for (let i = 0; i < response.data.length; i++) {
        let anime = response.data[i];

        recommendations.push(
          await new Promise((resolve) => {
            this.getAnimeById(anime.node.id).then(async (animeFromFirebase) => {
              if (animeFromFirebase) {
                resolve(animeFromFirebase);
              } else {
                await new Promise((resolve) => setTimeout(resolve, 500));
                await fetch(`https://api.jikan.moe/v4/anime/${anime.node.id}`)
                  .then((response) => response.json())
                  .then((data) => {
                    let theAnime = new AnimeItem(data.data);
                    fireBaseHelper.saveAnime(theAnime);
                    resolve(theAnime);
                  })
                  .catch((e) => console.log(e));
              }
            });
          })
        );
      }
    }

    return recommendations;
  };
}
