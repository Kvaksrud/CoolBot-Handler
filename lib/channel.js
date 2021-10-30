function createVoiceChat(name,parent){
    return new Promise((resolve,reject) => {
        /*message.guild.channels.create(channelName, {
            type: "voice", //This create a text channel, you can make a voice one too, by changing "text" to "voice"
            permissionOverwrites: [
               {
                 id: message.guild.roles.everyone, //To make it be seen by a certain role, user an ID instead
                 allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'], //Allow permissions
                 //deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY'] //Deny permissions
               }
            ],
          })*/
          resolve('hello world');
    })
}


module.exports = {
    createVoiceChat: async (name,parent) => { return await createVoiceChat(name,parent); },
}