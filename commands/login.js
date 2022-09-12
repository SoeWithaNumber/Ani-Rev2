const {ModalBuilder, TextInputBuilder, SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
async function execute(interaction) {

    const instructionEmbed = new EmbedBuilder()
    .setTitle("Welcome to Ani!")
    .setDescription("In order to access some features of this bot, you must [log in](https://anilist.co/api/v2/oauth/authorize?client_id=6856&response_type=code) to Anilist.")
    .addFields(
        { name: "Step 1", value: "Click the [login link](https://anilist.co/api/v2/oauth/authorize?client_id=6856&response_type=code)"},
        { name: "Step 2", value: "Log in to Anilist and copy the big string of text"},
        { name: "Step 3", value: "Once you copy the text, click the button"},
        { name: "Step 4", value: "Paste it in and have fun using Ani!"}
    )
    .setColor("#51c971")
    
    const continueButton = new ButtonBuilder()
    .setCustomId("continueLogin")
    .setLabel("Continue")
    .setStyle(ButtonStyle.Primary)

    const buttonRow = new ActionRowBuilder()
    .addComponents(continueButton)

    await interaction.reply({embeds:[instructionEmbed], components: [buttonRow]})
    
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Log in to anilist.co"),
    name: "login"

}

