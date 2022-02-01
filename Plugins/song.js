const Asena = require('../events');
const { MessageType, Mimetype } = require('@adiwajshing/baileys');
const got = require('got');
const LOAD_ING = "```𝑳𝒐𝒂𝒅𝒊𝒏𝒈 𝑷𝒍𝒆𝒂𝒔𝒆 𝑾𝒂𝒊𝒕 𝑭𝒆𝒘 𝑴𝒊𝒏𝒖𝒕𝒆𝒔...```"
const Config = require('../config');
const axios = require('axios')
const Axios = require('axios')


Asena.addCommand({pattern: 'song ?(.*)', fromMe: false, desc: 'play song' , dontAddCommandList: true }, async (message, match) => {
	
	await message.client.sendMessage(message.jid, '```𝑯𝒆𝒚 𝑫𝒖𝒅𝒆 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅𝒊𝒏𝒈```' , MessageType.text, { quoted: message.data });
	
	const {data} = await axios(`https://zenzapi.xyz/api/play/playmp3?query=${match[1]}&apikey=whitedevil-terrorboy`)
	
        const { status, result } = data
	
	var img = await Axios.get(`${result.thumb}`, {responseType: 'arraybuffer'})
	
        if(!status) return await message.sendMessage('```𝑹𝒆𝒔𝒖𝒍𝒕 𝑵𝒐𝒕 𝑭𝒐𝒖𝒏𝒅𝒆𝒅```')
	
        await message.client.sendMessage(message.jid, LOAD_ING , MessageType.text, { quoted: message.data });
        let msg = '```'
        msg +=  `TITLE :${result.title}\n\n`        
        msg += '```'
        return await message.client.sendMessage(message.jid,Buffer.from(img.data), MessageType.image, {mimetype: Mimetype.jpg , caption: msg })
        return await message.client.sendMessage(message.jid,Buffer.from(audioBuffer.data), MessageType.document, {filename: msg , mimetype: Mimetype.webma,  quoted : message.data }) 
        });
