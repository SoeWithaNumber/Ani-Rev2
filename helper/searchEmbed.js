const {EmbedBuilder} = require("discord.js");
function searchEmbedGenerator(interaction,mediaInfo){
    const searchEmbed = new EmbedBuilder()
    .setTitle(mediaInfo.title.userPreferred) //stuff that stays the same
    .setColor(mediaInfo.coverImage.color)
    .setDescription(mediaInfo.description)
    .setThumbnail(mediaInfo.coverImage.large)
    .setImage(mediaInfo.bannerImage)

   if (mediaInfo.type == "ANIME") {
        searchEmbed.addFields(
            {name:"Episodes", value:mediaInfo.episodes.toString(),inline:true},
            {name:"Episode Length", value:mediaInfo.duration.toString(),inline:true},
        
        ) 
    } else {
        searchEmbed.addFields(
            {name:"Volumes", value:mediaInfo.volumes.toString(),inline:true},
            {name:"Chapters", value:mediaInfo.chapters.toString(),inline:true}
        )
    }
    mediaInfo.status = mediaInfo.status[0]+mediaInfo.status.toLowerCase().substring(1).replaceAll("_"," ")
    mediaInfo.format = mediaInfo.format[0]+mediaInfo.format.toLowerCase().substring(1).replaceAll("_"," ")
    searchEmbed.addFields(
        {name:"Genres", value:mediaInfo.genres.join(", ")},
        {name:mediaInfo.type == "ANIME"?"Air Status":"Publishing Status", value:mediaInfo.status,inline:true},
        {name:"Format", value:mediaInfo.format,inline:true}
    )
    
    if(!interaction.client.anilistUsers.has(interaction.user.id) || mediaInfo?.mediaListEntry?.private || !mediaInfo.mediaListEntry) return searchEmbed
    mediaInfo.mediaListEntry.status = mediaInfo.mediaListEntry.status[0]+mediaInfo.mediaListEntry.status.toLowerCase().substring(1).replaceAll("_"," ")
    searchEmbed.addFields(
        {name:mediaInfo.type == "ANIME"?"Watch Status":"Read Status", value:mediaInfo.mediaListEntry.status},
        {name:mediaInfo.type == "ANIME"?"Episodes Watched":"Chapters Read", value:mediaInfo.mediaListEntry.progress,inline:true}
    )
    if(mediaInfo.type == "MANGA") searchEmbed.addFields({name:"Volumes Read", value:mediaInfo.mediaListEntry.progressVolumes})

    if(mediaInfo.mediaListEntry.user.scoreFormat == "POINT_3"){
        switch(mediaInfo.mediaListEntry.score){
            case 0: searchEmbed.addFields({name:"Score", value:"Unrated",inline:true}); break
            case 1: searchEmbed.addFields({name:"Score", value:"☹",inline:true}); break
            case 2: searchEmbed.addFields({name:"Score", value:"😐",inline:true}); break
            case 3: searchEmbed.addFields({name:"Score", value:"☺",inline:true}); break
        }
    } else {
        searchEmbed.addFields({name:"Score", value:mediaInfo.mediaListEntry.score > 0?mediaInfo.mediaListEntry.score.toString():"Unrated",inline:true})
    }
    searchEmbed.addFields({name:"Favorited", value:mediaInfo.isFavourite ?"Yes":"No",inline:true})
    return searchEmbed;
}

module.exports = {
    searchEmbedGenerator,
}

