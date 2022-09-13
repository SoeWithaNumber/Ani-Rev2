const {ModalBuilder, TextInputBuilder, SlashCommandBuilder, ActionRowBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
async function execute(interaction) {

    //Creating the instructions embed
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

    //Creating modal
    const loginModal = new ModalBuilder().setTitle("Login to Anilist!").setCustomId("loginModal")

    const tokenInput = new TextInputBuilder()
        .setLabel("Paste token")
        .setStyle("Paragraph")
        .setCustomId("tokenInput")
        .setPlaceholder("The big wall of text goes here!")

    const row = new ActionRowBuilder().addComponents(tokenInput)

    loginModal.addComponents(row)


    //Creating button for the embed
    const continueButton = new ButtonBuilder()
    .setCustomId("continueLogin")
    .setLabel("Continue")
    .setStyle(ButtonStyle.Primary)

    const buttonRow = new ActionRowBuilder()
    .addComponents(continueButton)

    //Sending embed with button
    let instructionMessage = await interaction.reply({embeds:[instructionEmbed], components: [buttonRow]})
    
    //Collecting the button input and showing modal
    const continueButtonCollector = instructionMessage.createMessageComponentCollector({filter: (interaction)=>interaction.customId=="continueLogin", time:180_000})
    
    continueButtonCollector.on("collect", buttonInteraction =>{
        buttonInteraction.showModal(loginModal)
    })

    //Disable button after finishing collector
    continueButtonCollector.on("end", ()=>{
        buttonRow.components[0].setDisabled(true)
        instructionMessage.interaction.editReply({components:[buttonRow]})
    })
    
    //Taking in the modal input
    let tokenSubmission = await interaction.awaitModalSubmit({filter: submission => submission.customId=="loginModal", time: 180_000})
    tokenSubmission.deferReply()
    let token = tokenSubmission.fields.getTextInputValue("tokenInput")
    
    //Request oauth token from anilist

    let response = await interaction.client.axios.request({
        'baseURL': "",
        'uri': 'https://anilist.co/api/v2/oauth/token',
        data:{
            'grant_type': 'authorization_code',
            'client_id': 6856,
            'client_secret': process.env.ANILIST_SECRET,
            'redirect_uri': 'https://anilist.co/api/v2/oauth/pin',
            'code': token
        }
    }).catch(console.log).then(console.log)
    console.log(response)
    
}

module.exports = {
    execute,
    data: new SlashCommandBuilder()
        .setName("login")
        .setDescription("Log in to anilist.co"),
    name: "login"

}
