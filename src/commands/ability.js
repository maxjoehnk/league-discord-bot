const Discord = require('discord.js');
const { riot } = require('league-api');
const { db } = require('../db');

const identifiers = ['Passive', 'Q', 'W', 'E', 'R'];

const exec = config => async(args, msg) => {
    const champQuery = args[0];
    const skillQuery = args[1];
    const champion = await riot.champions.find(db, config.keys.riot, champQuery, config.search && config.search.threshold);
    if (skillQuery) {
        const index = identifiers.findIndex(label => {
            if (label.toLowerCase() !== skillQuery.toLowerCase()) {
                return false;
            }
            return true;
        });
        const skill = Object.assign({}, champion.skills[index], {
            identifier: identifiers[index]
        });
        const message = buildMessage(champion, skill);
        msg.channel.send({ embed: message });
    }else {
        champion.skills.forEach((skill, i) => {
            const message = buildMessage(champion, Object.assign({}, skill, {
                identifier: identifiers[i]
            }));
            msg.channel.send({ embed: message });
        });
    }
};

const buildMessage = (champion, skill) => {
    const builder = new Discord.RichEmbed()
        .setAuthor(champion.name, champion.imageUrl)
        .setTitle(`${skill.identifier} - ${skill.name}`)
        .setThumbnail(skill.imageUrl);
    if (skill.tooltip) {
        builder.setDescription(`${skill.description}\n\n${skill.tooltip}`);
    }else {
        builder.setDescription(skill.description);
    }
    if (skill.cost) {
        builder.addField('Cost', skill.cost, true);
    }
    if (skill.cooldown) {
        builder.addField('Cooldown', skill.cooldown, true);
    }
    if (skill.range && skill.range > 0) {
        builder.addField('Range', skill.range, true);
    }
    return builder;
};

const cmd = 'ability';

module.exports = {
    exec,
    cmd
};
