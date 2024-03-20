"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN, CHANNEL_ID } = process.env;

class LoggerService {
  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    // add channelId
    this.channelId = CHANNEL_ID;

    this.client.on("ready", () => {
      console.log(`Connected to Discord successful as ${this.client.user.tag}`);
    });
    this.client.login(DISCORD_TOKEN);
  }

  sendToMessage(msg = "message") {
    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.error(`Couldn't find the channel ::: ${this.channelId}`);
      return;
    }

    channel.send(msg).catch((e) => console.error(e));
  }

  sendToFormatCode(logData) {
    const {
      code,
      message = "This is some additional about the code",
      title = "Code example",
    } = logData;
    const codeMessage = {
      content: message,
      embeds: [
        {
          color: parseInt("00ff00", 16), // convert hexadecimal color code to integer
          title,
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n ```",
        },
      ],
    };
    this.sendToMessage(codeMessage);
  }
}

const loggerService = new LoggerService();
module.exports = loggerService;
