import base64url from "base64url";
import FormData from "form-data";
import crypto from "crypto";
import fetch, { Body } from "node-fetch";
import { fireBaseHelper } from "..";
import AnimeItem from "../types/anime-item";
import { database } from "firebase-admin";
import AnimeStatus from "../types/anime-status";

export default class MyAnimeListHelper {
  clientId: string;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  getAuthLink = (userId: string): string => {
    return `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${
      this.clientId
    }&state=${userId}&code_challenge=${this.getCodeVerifier()}`;
  };

  getCodeVerifier = () => {
    const code_verifier = process.env.CODE_VERIFIER!;

    const base64Digest = crypto
      .createHash("sha256")
      .update(code_verifier)
      .digest("base64");

    return base64url.fromBase64(base64Digest);
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

  async generateMalToken(authResponse: any) {
    let url = "https://myanimelist.net/v1/oauth2/token";

    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: this.getFormUrlEncoded({
        client_id: this.clientId,
        client_secret: this.clientId,
        grant_type: "authorization_code",
        code: authResponse.code,
        code_verifier: this.getCodeVerifier(),
      }),
    }).then((response) => response.json());

    if (response.error === undefined) {
      console.log(response);
      fireBaseHelper.saveUserMalToken(authResponse.state, response);
    }
  }

  private getFormUrlEncoded(details: any) {
    var formBody: any = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    return formBody;
  }

  async completedAnimeStatus(
    animeId: string,
    status: AnimeStatus,
    score: number,
    num_watched_episodes: number,
    userId: string
  ) {
    return fireBaseHelper.getMalToken(userId).then(async (malToken: any) => {
      const response = await fetch(
        `https://api.myanimelist.net/v2/anime/${animeId}/my_list_status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `${malToken.token_type} ${malToken.access_token}`,
          },
          body: this.getFormUrlEncoded({
            status: status,
            score: score,
            num_watched_episodes: num_watched_episodes,
          }),
        }
      );
      return await await response.json();
    });
  }

  async updateAnimeStatus(
    animeId: string,
    status: AnimeStatus,
    userId: string
  ) {
    return fireBaseHelper.getMalToken(userId).then(async (malToken: any) => {
      const response = await fetch(
        `https://api.myanimelist.net/v2/anime/${animeId}/my_list_status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `${malToken.token_type} ${malToken.access_token}`,
          },
          body: this.getFormUrlEncoded({ status: status }),
        }
      );
      return await response.json();
    });
  }
}
