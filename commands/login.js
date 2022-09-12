const {ModalBuilder} = require("discord.js");
function execute(interaction) {

}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Log in to anilist.co"),
    name: "login"

}

