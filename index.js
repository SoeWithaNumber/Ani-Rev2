const {Client,Collection,GatewayIntentBits}=require("discord.js");
const {readdirSync}=require("node:fs");
const axios = require("axios")
require("dotenv").config();

const bot = new Client({
    intents: [GatewayIntentBits.GuildMessages]
});

//Configuring axios and attaching to discord client
bot.axios = axios.create({
    method: "POST",
    baseUrl: "https://graphql.anilist.co/",
    headers:{
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
})
bot.axios.interceptors.response.use((response) => {
  return response.data.data
})

//welcome to the world :)
const token = process.env.DISCORD_BOT_TOKEN;
bot.login(token);

//pulling commands
bot.commands = new Collection();
const commandFiles = readdirSync("./commands/").filter(file => file.endsWith(".js"));
for (let i = 0; i < commandFiles.length; i++) {
    const command = require("./commands/"+commandFiles[i]);
    bot.commands.set(command.name,command);
};

//when bot is ready
bot.on("ready",()=>{
    console.log("Paw patrol is on a roll")
});

bot.on("interactionCreate", (interaction)=>{
    if (!interaction.isChatInputCommand()) return;
    switch(interaction.commandName){
        case "help": bot.commands.get("help").execute(interaction)
        break
        case "login": bot.commands.get("login").execute(interaction)
    }
    
})