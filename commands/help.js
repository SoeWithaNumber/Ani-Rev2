const {EmbedBuilder,SlashCommandBuilder} = require("discord.js");
function execute(interaction){
    const helpEmbed = new EmbedBuilder()
    .setTitle("Welcome to Ani!")
    .setColor("Blue")
    .setDescription("WIP")
    .setFooter({text:"Version 0.5.0-dev"})
    interaction.reply({embeds:[helpEmbed]})
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Ani-bot Help Command"),
    name:"help"
        
}

