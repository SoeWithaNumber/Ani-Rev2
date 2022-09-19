const {EmbedBuilder} = require("discord.js");
function userEmbedGenerator(interaction,userInfo){
    const userEmbed = new EmbedBuilder()
    .setTitle("Logged in as "+userInfo.name)
    .setColor("Green")
    .setDescription(userInfo.about)
    .setThumbnail(userInfo.avatar.large)
    .addFields(
        {name:"Anime Watched",value:userInfo.statistics.anime.count.toString(),inline:true},
        {name:"Manga Watched",value:userInfo.statistics.manga.count.toString(),inline:true},
    )
    .setFooter({text:userInfo.siteUrl})
    interaction.reply({embeds:[userEmbed]})
}

module.exports = {
    userEmbedGenerator,
}