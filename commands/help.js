const {EmbedBuilder,SlashCommandBuilder} = require("discord.js");
function execute(interaction){
    const helpEmbed = new EmbedBuilder();
    helpEmbed.setTitle("Welcome to Ani!")
    .setColor("Blue")
    .setDescription("WIP")
    .setFooter("Version Dev_0.1")
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Ani-bot Help Command"),
    name:"help"
        
}

