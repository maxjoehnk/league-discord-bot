const Discord = require('discord.js');
const { riot } = require('league-api');
const { db } = require('../db');

const exec = config => async(args, msg) => {
    const query = args.join(' ');
    const champion = await riot.champions.find(db, config.keys.riot, query, config.search && config.search.threshold);
    const message = buildMessage(champion);
    msg.channel.send({ embed: message });
};

const buildMessage = champion => new Discord.RichEmbed()
    .setAuthor(champion.name, champion.imageUrl)
    .setTitle(champion.title.slice(0, 1).toUpperCase() + champion.title.slice(1))
    .setDescription(champion.loreExcerpt)
    .addField('Health', `${champion.healthBase} (+${champion.healthPerLevel})`, true)
    .addField('Health Regen', `${champion.healthRegenBase} (+${champion.healthRegenPerLevel})`, true)
    .addField('Attack Damage', `${champion.adBase} (+${champion.adPerLevel})`, true)
    .addField('Attack Speed', `${champion.asBase} (+${champion.asPerLevel}%)`, true)
    .addField('Armor', `${champion.armorBase} (+${champion.armorPerLevel})`, true)
    .addField('Magic Resist', `${champion.mrBase} (+${champion.mrPerLevel})`, true)
    .addField('Movespeed', `${champion.movespeed}`, true)
    .addField(`P ${champion.skills[0].name}`, champion.skills[0].description)
    .addField(`Q ${champion.skills[1].name}`, champion.skills[1].description)
    .addField(`W ${champion.skills[2].name}`, champion.skills[2].description)
    .addField(`E ${champion.skills[3].name}`, champion.skills[3].description)
    .addField(`R ${champion.skills[4].name}`, champion.skills[4].description)
    .setImage(`http://ddragon.leagueoflegends.com/cdn/img/champion/splash/${champion.key}_0.jpg`);

const cmd = 'champion';

module.exports = {
    exec,
    cmd
};
