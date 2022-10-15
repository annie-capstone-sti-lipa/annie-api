import {
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
import { getStorage } from "firebase/storage";
import AnimeItem from "../types/anime-item";
import Kana from "../types/kana";
import kanaOrdering from "../types/kana-ordering";
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

  public async getAnime(id: string): Promise<AnimeItem | null> {
    let document = await getDoc(
      doc(collection(this.firestore, "animes"), id.toString())
    );

    if (document.data !== null) {
      return document.data() as AnimeItem;
    } else {
      return null;
    }
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

  public async saveAnime(anime: AnimeItem): Promise<void> {
    await setDoc(
      doc(this.firestore, "animes", anime.id.toString()),
      anime.toObject()
    );
  }
}
