const Discord = require('discord.js');
const { riot, championgg } = require('league-api');
const { db } = require('../db');

const exec = config => async(args, msg) => {
    const query = args.join(' ');
    const champion = await riot.champions.find(db, config.keys.riot, query);
    const items = await riot.items.all(db, config.keys.riot);
    const stats = await championgg.champion(config.keys['champion.gg'], champion.id);
    const message = buildMessage(champion, stats.hashes.skillorderhash.highestCount.hash, stats.hashes.skillorderhash.highestWinrate.hash);
    msg.channel.send({ embed: message });
};

const buildMessage = (champion, mostFrequent, highestWin) => new Discord.RichEmbed()
    .setTitle(champion.name)
    .setThumbnail(champion.imageUrl)
    .addField(`Most Frequent`, mostFrequent)
    .addField(`Highest Win %`, highestWin);

const cmd = 'build';

module.exports = {
    exec,
    cmd
};