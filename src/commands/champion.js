const Discord = require('discord.js');
const { riot } = require('league-api');
const { db } = require('../db');

const exec = config => async(args, msg) => {
    const query = args.join(' ');
    const champion = await riot.champions.find(db, config.keys.riot, query);
    const message = buildMessage(champion);
    msg.channel.send({ embed: message });
};

const buildMessage = champion => new Discord.RichEmbed()
    .setTitle(champion.name)
    .setDescription(champion.title)
    .setThumbnail(champion.imageUrl)
    .addField(`Q *${champion.skills[0].name}*`, champion.skills[0].description)
    .addField(`W *${champion.skills[1].name}*`, champion.skills[1].description)
    .addField(`E *${champion.skills[2].name}*`, champion.skills[2].description)
    .addField(`R *${champion.skills[3].name}*`, champion.skills[3].description);

const cmd = 'champion';

module.exports = {
    exec,
    cmd
};
