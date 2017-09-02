const Discord = require('discord.js');
const { join } = require('path');
const { load } = require('./config');
const { db, migrate } = require('./db');
const champion = require('./commands/champion');
const d = require('debug')('league-discord:index');

const start = async() => {
    await migrate(db);
    const config = await load(join(__dirname, '../config.yml'));
    const client = new Discord.Client();
    client.on('ready', () => {
        d('Discord is ready');
        setupCommands(client, config);
    });
    await client.login(config.discord.token);

};

const setupCollector = (callback, filter) => channel => {
    const collector = new Discord.MessageCollector(channel, msg => {
        return filter.test(msg.content);
    });

    collector.on('collect', msg => {
        callback(filter.exec(msg.content), msg);
    });
};

const setupCommands = (client, config) => {
    const championCollector = setupCollector(champion.exec(config), champion.filter);
    client.channels
        .filter(({ type }) => type !== 'voice')
        .forEach(championCollector);
};

start().catch(err => console.error(err));