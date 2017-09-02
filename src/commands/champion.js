const Discord = require('discord.js');
const { riot } = require('league-api');
const { db } = require('../db');

const exec = config => async(query, msg) => {
    const champions = await riot.champions(db, config.keys.riot);
    const champion = champions.find(champ => champ.name === query[1]);
    if (champion) {
        const message = buildMessage(champion);
        msg.channel.send({ embed: message });
    }else {
        msg.reply('Unknown Champion');
    }
};

const buildMessage = champion => new Discord.RichEmbed()
    .setTitle(champion.name)
    .setDescription(champion.title)
    .setThumbnail(champion.imageUrl)
    .addField(`Q *${champion.skills[0].name}*`, champion.skills[0].description)
    .addField(`W *${champion.skills[1].name}*`, champion.skills[1].description)
    .addField(`E *${champion.skills[2].name}*`, champion.skills[2].description)
    .addField(`R *${champion.skills[3].name}*`, champion.skills[3].description)

const filter = /^!league champion ([a-zA-Z\s']+)/;

module.exports = {
    exec,
    filter
};