import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { myAnimeListHelper } from "..";
import AnimeItem from "../types/anime-item";
import Kana from "../types/kana";
import kanaOrdering from "../types/kana-ordering";
import QuizResult from "../types/quiz-result";
import QuizScores from "../types/quiz-scores";
import UserInfo from "../types/user-info";
import writingSystem from "../types/writing-system";
import MyAnimeListHelper from "./myanimelist-helper";

export default class FireBaseHelper {
  firestore = getFirestore();
  storage = getStorage();

  malAuthCollection = "mal-user-auth-code";
  malTokenCollection = "mal-user-token";
  userInfoCollection = "users-info";
  usersQuizCollection = "users-quiz";
  animesCollections = "animes";
  userDiscordIdCollection = "users-discord";

  public async saveSchedules(schedules: Object[]) {
    schedules.forEach(async (sched: any) => {
      await setDoc(
        doc(this.firestore, "schedules", sched["day"]),
        sched["schedules"] !== undefined ? sched : {}
      );
    });
  }

  public async saveError(error: any, key: string) {
    await setDoc(doc(this.firestore, "errors", key), { error: error });
  }

  public async getAnime(id: string): Promise<AnimeItem | null> {
    let document = await getDoc(
      doc(collection(this.firestore, this.animesCollections), id.toString())
    ).catch((e) => {
      this.saveError(e, "firebase error");
    });

    if (document?.data !== null) {
      return document!.data() as AnimeItem;
    } else {
      return null;
    }
  }

  public async saveQuizResult(quizResult: QuizResult): Promise<any> {
    return await addDoc(
      collection(this.firestore, this.usersQuizCollection),
      quizResult.toObject()
    )
      .then(() => ({
        success: true,
        message: "Quiz Result Saved Successfully!",
      }))
      .catch((e) => ({ success: false, message: e.toString() }));
  }

  public async saveUserInfo(userInfo: UserInfo, userId: string): Promise<any> {
    return await setDoc(
      doc(this.firestore, this.userInfoCollection, userId),
      userInfo.toObject()
    )
      .then(() => ({
        success: true,
        message: "User Info Updated!",
      }))
      .catch((e) => ({ success: false, message: e.toString() }));
  }

  public async getWeekSchedule(): Promise<Array<Object>> {
    let schedules: Array<Object> = [];

    const querySnapshot = await getDocs(
      collection(this.firestore, "schedules")
    );
    querySnapshot.forEach((doc: any) => {
      let data = doc.data();
      schedules.push(data);
    });

    return schedules;
  }

  public async getQuizScores(userId: string) {
    const querySnapshot = await getDocs(
      query(
        collection(this.firestore, this.usersQuizCollection),
        where("userId", "==", userId)
      )
    );

    let hiraganaScores: Array<any> = [];
    let katakanaScores: Array<any> = [];
    let kanjiScores: Array<any> = [];

    querySnapshot.forEach((doc: any) => {
      let data = doc.data();

      switch (data.writingSystem.toLowerCase()) {
        case writingSystem.hiragana:
          hiraganaScores.push(data);
          break;
        case writingSystem.katakana:
          katakanaScores.push(data);
          break;
        case writingSystem.kanji:
          kanjiScores.push(data);
          break;
      }
    });

    function getTotal(data: Array<any>) {
      let items = 0;
      let score = 0;
      data.forEach((element) => {
        items += element.items;
        score += element.score;
      });

      return (score / items) * 100;
    }

    return new QuizScores(
      getTotal(kanjiScores),
      getTotal(hiraganaScores),
      getTotal(katakanaScores)
    );
  }

  public async saveUserMalToken(userId: string, response: any) {
    await setDoc(
      doc(this.firestore, this.malTokenCollection, userId),
      response
    );
  }

  public async getMalToken(userId: string): Promise<any> {
    let document = await getDoc(
      doc(collection(this.firestore, this.malTokenCollection), userId)
    ).catch((e) => {
      this.saveError(e, "firebase error");
    });
    return document?.data();
  }

  public async getUserInfo(userId: string): Promise<UserInfo | null> {
    let document = await getDoc(
      doc(collection(this.firestore, this.userInfoCollection), userId)
    ).catch((e) => {
      this.saveError(e, "firebase error");
    });

    return (document?.data() as UserInfo) ?? null;
  }

  public async getUserIdFromDiscordId(
    discordId: string
  ): Promise<string | null> {
    let querySnapshot = await getDocs(
      query(
        collection(this.firestore, this.userDiscordIdCollection),
        where("discordId", "==", discordId)
      )
    ).catch((e) => {
      this.saveError(e, "firebase error");
    });

    let firebaseId = null;
    querySnapshot?.forEach((doc: any) => {
      firebaseId = doc.id;
    });

    return firebaseId;
  }

  public async saveAnime(anime: AnimeItem): Promise<void> {
    await setDoc(
      doc(this.firestore, this.animesCollections, anime.id.toString()),
      anime.toObject()
    );
  }
}
