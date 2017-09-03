const Discord = require('discord.js');
const { riot, championgg } = require('league-api');
const { db } = require('../db');

const exec = config => async(args, msg) => {
    const query = args.join(' ');
    const champion = await riot.champions.find(db, config.keys.riot, query);
    const stats = await championgg.champion(config.keys['champion.gg'], champion.id);
    const message = buildMessage(champion, stats.hashes.skillorderhash.highestCount, stats.hashes.skillorderhash.highestWinrate);
    msg.channel.send({ embed: message });
};

const formatSkillOrder = skillOrder =>
    skillOrder.hash.split('-')
        .filter((_, i) => i > 0)
        .join('>');

const buildMessage = (champion, mostFrequent, highestWin) => new Discord.RichEmbed()
    .setTitle(champion.name)
    .setThumbnail(champion.imageUrl)
    .addField(`Skill Order - Most Frequent (${mostFrequent.count} Games)`, formatSkillOrder(mostFrequent))
    .addField(`Skill Order - Highest Win % (${highestWin.count} Games)`, formatSkillOrder(highestWin));

const cmd = 'build';

module.exports = {
    exec,
    cmd
};
