import { fireBaseHelper } from "..";

export default class AnimeSchedulesHelper {
  constructor() {}

  static async saveWeekSchedule(): Promise<Array<Object>> {
    async function getScheduleByDay(
      day: string,
      page: number = 1
    ): Promise<Object> {
      let response = await fetch(
        `https://api.jikan.moe/v4/schedules?filter=${day}&sfw=false&page=${
          page ?? 1
        }&kids=false`,
        { method: "GET" }
      ).catch((e) => {
        throw e;
      });
      let res = await response.json();
      if (res?.pagination?.has_next_page ?? false) {
        res.data.push(((await getScheduleByDay(day, page + 1)) as any)["data"]);
      }

      return res;
    }

    let days: Array<string> = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    let schedules: Array<Object> = [];

    for (let i = 0; i < days.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      schedules.push({
        day: days[i],
        schedules: (
          (await getScheduleByDay(days[i]).catch((e) => console.log(e))) as any
        )["data"],
      });
    }

    fireBaseHelper.saveScheduels(schedules);

    return schedules;
  }

  static async getWeekSchedule(): Promise<Array<Object>> {
    return fireBaseHelper.getWeekSchedule();
  }
}
