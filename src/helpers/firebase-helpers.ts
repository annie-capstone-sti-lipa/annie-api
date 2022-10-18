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
import AnimeItem from "../types/anime-item";
import Kana from "../types/kana";
import kanaOrdering from "../types/kana-ordering";
import QuizResult from "../types/quiz-result";
import QuizScores from "../types/quiz-scores";
import UserInfo from "../types/user-info";
import writingSystem from "../types/writing-system";

export default class FireBaseHelper {
  firestore = getFirestore();
  storage = getStorage();

  public async getKana(
    writingSystem: writingSystem,
    ordering: kanaOrdering
  ): Promise<Array<Kana>> {
    let response: Array<Kana> = [];

    const q = query(
      collection(this.firestore, writingSystem),
      where("type", "==", ordering),
      limit(12)
    );
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      response.push(new Kana(doc.data()));
    });

    return response;
  }

  public async saveScheduels(schedules: Object[]) {
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
      doc(collection(this.firestore, "animes"), id.toString())
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
      collection(this.firestore, "users-quiz"),
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
      doc(this.firestore, "users-info", userId),
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
        collection(this.firestore, "users-quiz"),
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

  public async getUserInfo(userId: string): Promise<UserInfo | null> {
    let document = await getDoc(
      doc(collection(this.firestore, "users-info"), userId)
    ).catch((e) => {
      this.saveError(e, "firebase error");
    });

    return (document?.data() as UserInfo) ?? null;
  }

  public async saveAnime(anime: AnimeItem): Promise<void> {
    await setDoc(
      doc(this.firestore, "animes", anime.id.toString()),
      anime.toObject()
    );
  }
}
