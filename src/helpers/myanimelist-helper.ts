import base64url from "base64url";
import crypto from "crypto";
import fetch from "node-fetch";
import { fireBaseHelper } from "..";
import AnimeItem from "../types/anime-item";

export default class MyAnimeListHelper {
  clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  getAuthLink = (userId: string): string => {
    const code_verifier = process.env.CODE_VERIFIER!;

    const base64Digest = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64");

    return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${
      this.clientId
    }&state=${userId}&code_challenge=${base64url.fromBase64(base64Digest)}`;
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
      .then(async (data) => await data.json())
      .catch((e) => fireBaseHelper.saveError(e.toString(), "mal error"));

    let recommendations: Array<AnimeItem> = [];

    if (response.data !== undefined) {
      for (let i = 0; i < response.data.length; i++) {
        let anime = response.data[i];

        recommendations.push(
          await new Promise((resolve) => {
            fireBaseHelper.saveError("got error", "before firebase request");
            this.getAnimeById(anime.node.id).then(async (animeFromFirebase) => {
              fireBaseHelper.saveError("got error", "after firebase request");
              if (animeFromFirebase) {
                resolve(animeFromFirebase);
              } else {
                await new Promise((resolve) => setTimeout(resolve, 500));
                fireBaseHelper.saveError("got error", "before jikan request");
                await fetch(`https://api.jikan.moe/v4/anime/${anime.node.id}`)
                  .then((response) => response.json())
                  .then((data) => {
                    fireBaseHelper.saveError(
                      "got error",
                      "after jikan request"
                    );
                    let theAnime = new AnimeItem(data.data);
                    fireBaseHelper.saveAnime(theAnime);
                    resolve(theAnime);
                  })
                  .catch((e) => fireBaseHelper.saveError(e, "jikan error"));
              }
            });
          })
        );
      }
    }

    fireBaseHelper.saveError(recommendations, "recommendations");
    return recommendations;
  };

  //   testingAuth(){
  //  let url = 'https://myanimelist.net/v1/oauth2/token'
  //   let data = {
  //       'client_id': this.clientId,
  //       'code': authorisation_code,
  //       'code_verifier': code_verifier,
  //       'grant_type': 'authorization_code'
  //   }

  //   response = requests.post(url, data)
  //   response.raise_for_status()  # Check whether the request contains errors

  //   token = response.json()
  //   response.close()
  //   print('Token generated successfully!')

  //   }
}
