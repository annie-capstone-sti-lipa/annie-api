import {
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

  public async saveError(error: any, key: string) {
    await setDoc(doc(this.firestore, "errors", key), error);
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
