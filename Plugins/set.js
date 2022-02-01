const Asena = require('../events');
const {MessageType, MessageOptions, Mimetype} = require('@adiwajshing/baileys');
const axios = require('axios');
const Config = require('../config');
const config = require('../config');
const fs = require("fs")
const Language = require('../language');
const Lang = Language.getString('gitlink');

Asena.addCommand({pattern: 'git', fromMe: false, desc: Lang.GL}, (async (message, match) => {

    var respoimage = await axios.get(Config.TAURUS, { responseType: 'arraybuffer' })


    await message.sendMessage(Buffer(respoimage.data), MessageType.image, {quoted: message.data , thumbnail: fs.readFileSync('taurus.jpg'), mimetype: Mimetype.png, caption: `╭───────────────────╮
    ` + Config.BOTV2 + `
╰───────────────────╯
╭───────────────────╮
│
│
┣𝕾⃝🌺 *ᴄʀᴇᴀᴛᴇʀ* : ᴍᴜʜᴀᴍᴍᴇᴅ
┣𝕾⃝🌺 *ʙᴏᴛ* : ᴛᴀᴜʀᴜs
┣𝕾⃝🌺 *ᴠᴇʀsɪᴏɴ* : 2.0.0
┣𝕾⃝🌺 *ᴍᴏᴅᴇ* : ᴘᴜʙʟɪᴄ
┣𝕾⃝🌺 *ᴘʀᴇғɪx* : *. ; !*
│
│      ▎▍▌▌▉▏▎▌▉▐▏▌▎
│      ▎▍▌▌▉▏▎▌▉▐▏▌▎
│       ©919961050829
│
│
│☘︎ *ᴛᴏ ᴄʜᴇᴄᴋ ᴜᴘᴅᴀᴛᴇ ᴛʏᴘᴇ:*
│*.ᴜᴘᴅᴀᴛᴇ*
│
│
│
│☘︎ *ʜᴏᴡ ᴛᴏ ᴜᴘᴅᴀᴛᴇ:*
│*.ᴜᴘᴅᴀᴛᴇ ɴᴏᴡ*
│
│
│
│☘︎ *ʜᴏᴡ ᴛᴏ ᴍᴀᴋᴇ ʙᴏᴛ : 
│ *https://t.ly/TGSb*
│
│
│
│☘︎ *ʜᴏᴡ ᴛᴏ ᴍᴀᴋᴇ ʜᴇʀᴏᴋᴜ 
│ᴀᴄᴄᴏᴜɴᴛ : 
│ *https://t.ly/coJ1*
│
│
│
│☘︎ *ɢɪᴛʜᴜʙ ʟɪɴᴋ :*
│ **
│
│
│
│☘︎ *ᴀᴜᴅɪᴏ ᴄᴏᴍᴍᴀɴᴅs :*
│ **
│
│
│
│☘︎ *sᴛɪᴄᴋᴇʀ ᴄᴏᴍᴍᴀɴᴅs :* 
│ **
│
│
│
│☘︎ *ᴡʜᴀᴛsᴀᴘᴘ ɢʀᴏᴜᴘ :*
│ **
│
│
│
│☘︎ *ᴏᴡɴᴇʀ :*
│ *https://bit.ly/3dZkOUC*
│
│ 
│    ❏᪥ᴍᴜʜᴀᴍᴍᴇᴅ᪥❏
╰───────────────────╯

`}) 

}));
