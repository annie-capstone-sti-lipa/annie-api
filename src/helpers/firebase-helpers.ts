import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

export default class FireBaseHelper {
  firestore = getFirestore();
  storage = getStorage();

  constructor() {}

  public async saveScheduels(schedules: Object[]) {
    schedules.forEach(async (sched: any) => {
      await setDoc(
        doc(this.firestore, "schedules", sched["day"]),
        sched["schedules"] !== undefined ? sched : {}
      );
    });
  }

  public async getKanji() {
    const fs = require("fs");

    let rawdata = fs.readFileSync("src/helpers/kanji.json");

    let kanji = JSON.parse(rawdata);

    for (let i = 0; i < Object.keys(kanji).length; i++) {
      let key = Object.keys(kanji)[i];
      let theThing = kanji[key];

      let meanings = theThing["meanings"];
      let onyomi = theThing["readings_on"];
      let kunyomi = theThing["readings_kun"];

      if (meanings.length > 0 && onyomi.length > 0 && kunyomi.length > 0) {
        await setDoc(doc(this.firestore, "kanji", key), {
          character: Object.keys(kanji)[i],
          meanings: meanings,
          onyomi_readings: onyomi,
          kunyomi_readings: kunyomi,
        });
        console.log("added :" + key);
        console.log("index :" + i + " out of " + Object.keys(kanji).length);
      } else {
        console.log("SKIPPED");
      }
    }
  }

  public async getHiragana() {
    const fs = require("fs");

    let rawdata = fs.readFileSync("src/helpers/hiragana.json");

    let hiragana = JSON.parse(rawdata);

    for (let i = 0; i <= hiragana.length; i++) {
      let theThing = hiragana[i];
      let key = theThing["kana"];

      await setDoc(doc(this.firestore, "hiragana", key), theThing);
      console.log("added :" + key);
      console.log("index :" + i + " out of " + hiragana.length);
    }
  }

  public async getKatakana() {
    const fs = require("fs");

    let rawdata = fs.readFileSync("src/helpers/katakana.json");

    let katakana = JSON.parse(rawdata);

    for (let i = 0; i < katakana.length; i++) {
      let theThing = katakana[i];
      let key = theThing["kana"];

      await setDoc(doc(this.firestore, "katakana", key), theThing);
      console.log("added :" + key);
      console.log("index :" + i + " out of " + katakana.length);
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
}
