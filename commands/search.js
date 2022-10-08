const { SlashCommandBuilder } = require("discord.js");
const {searchEmbedGenerator} = require("../helper/searchEmbed")
function execute(interaction) {

}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("search")
        .setDescription("Search for any media on Anilist")
        .addStringOption(option =>
            option.setName("title")
            .setDescription("The title of the media you want to search for")
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("format")
            .setDescription("The format you want to search for")
            .setRequired(false)
            .addChoices(
                { name: "Anime", value: "anime" },
                { name: "Manga", value: "manga" }
            )

        ),
        
    name: "help"

}

