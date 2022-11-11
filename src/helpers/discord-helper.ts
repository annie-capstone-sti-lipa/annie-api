import { fireBaseHelper } from "..";

class DiscordHelper {
  static async getFirebaseIdFromDiscordId(discordId: string): Promise<string> {
    return await fireBaseHelper
      .getUserIdFromDiscordId(discordId)
      .then((userId) => {
        if (userId === null) {
          throw {
            error:
              "Sorry but I don't recognize your discord account, have you linked you discord account in https://client-annie.me ?",
          };
        }
        return userId;
      });
  }

  static async noMalToken(userId: string): Promise<boolean> {
    return (await fireBaseHelper.getMalToken(userId)) === undefined;
  }
}

export default DiscordHelper;
