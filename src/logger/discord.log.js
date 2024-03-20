"use strict";

const { Client, GatewayIntentBits } = require("discord.js");
const { DISCORD_TOKEN } = process.env;
console.log("DISCORD_TOKEN", DISCORD_TOKEN);

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`Connected to Discord successful as ${client.user.tag}`);
});
client.login("");
