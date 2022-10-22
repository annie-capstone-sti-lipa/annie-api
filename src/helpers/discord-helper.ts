import { Client, GatewayIntentBits, Partials, DMChannel } from "discord.js";
import { measureMemory } from "vm";

class DiscordHelper {
  client = new Client({
    intents: [
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.Guilds,
    ],
    partials: [Partials.Message, Partials.Channel],
  });

  constructor(token: string) {
    this.client.on("ready", async () => {
      console.log(`Logged in as ${this.client.user!.tag}!`);
    });

    this.client.on("messageCreate", (message) => {
      let isDM = message.channel instanceof DMChannel;

      if (isDM) {
        console.log("is dm");
        message.author.send("heloo");
      } else {
        console.log("is not dm");
        message.channel.send("heloo from channel");
      }
    });

    this.client.login(token);
  }
}

export default DiscordHelper;
