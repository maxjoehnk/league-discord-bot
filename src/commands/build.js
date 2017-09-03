const Discord = require('discord.js');
const { riot, championgg } = require('league-api');
const { db } = require('../db');

const exec = config => async(args, msg) => {
    const champion = await riot.champions.find(db, config.keys.riot, args[0]);
    let stats;
    if (args.length === 2) {
        stats = await championgg.byRole(config.keys['champion.gg'], champion.id, args[1]);
    }else {
        stats = await championgg.mostPlayed(config.keys['champion.gg'], champion.id);
    }
    const message = buildMessage(champion, stats);
    msg.channel.send({ embed: message });
};

const formatSkillOrder = skillOrder =>
    skillOrder.hash.split('-')
        .filter((_, i) => i > 0)
        .join('>');

const buildMessage = (champion, stats) => {
    const { highestCount, highestWinrate } = stats.hashes.skillorderhash;
    const role = championgg.getLabelForRole(stats.role);
    return new Discord.RichEmbed()
        .setTitle(champion.name)
        .setDescription(role)
        .setThumbnail(champion.imageUrl)
        .addField(`Skill Order - Most Frequent (${highestCount.count} Games)`, formatSkillOrder(highestCount))
        .addField(`Skill Order - Highest Win % (${highestWinrate.count} Games)`, formatSkillOrder(highestWinrate));
};

const cmd = 'build';

module.exports = {
    exec,
    cmd
};
