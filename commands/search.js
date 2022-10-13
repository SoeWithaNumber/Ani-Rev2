const { SlashCommandBuilder, ChatInputCommandInteraction } = require("discord.js");
const {searchEmbedGenerator} = require("../helper/searchEmbed")
/**
 * @param {ChatInputCommandInteraction} interaction 
 */
async function execute(interaction) {
    let name = interaction.options.getString("title")
    let type = interaction.options.getString("format") ? interaction.options.getString("format") : "ANIME"
    let anilistUsers = interaction.client.anilistUsers
    await interaction.deferReply()

    let request = {
        data: JSON.stringify({
            query: `query($name: String!, $type: MediaType){
                Media(search: $name, type: $type) {
                    title {
                        romaji
                        english
                        native
                        userPreferred
                    }
                    type
                    description(asHtml: false)
                    episodes
                    chapters
                    volumes
                    genres
                    status
                    format
                    duration
                    bannerImage
                    isFavourite
                    coverImage{
                        large
                        color
                    }
                    mediaListEntry{
                        private
                        status
                        progress
                        progressVolumes
                        notes
                        score
                        user{
                            mediaListOptions{
                                scoreFormat
                            }
                        }

                    }
                }
            }`,
            variables: {
                name,
                type
            }
        })
    }

    if(anilistUsers.has(interaction.user.id)) request.headers = {Authorization: `Bearer ${anilistUsers.get(interaction.user.id)}`}
    let hasFailed = false
    let mediaInfo = await interaction.client.axios.request(request).catch(error=>{// Error handling
        hasFailed = true

        if (error.response.status == 404) {
            interaction.editReply("Uh oh! Couldn't find the media... Check spelling!")
        }
        else {
            interaction.editReply("Uh oh! An unknown error occurred... Try again later!")
        }
    })
    if(hasFailed) return

    let mediaEmbed = searchEmbedGenerator(interaction, mediaInfo.Media)

    interaction.editReply({embeds:[mediaEmbed]})

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
                { name: "Anime", value: "ANIME" },
                { name: "Manga", value: "MANGA" }
            )

        ),
        
    name: "search",
    description: "Search for any media.\nSyntax: `/search [title] [format]`"

}

