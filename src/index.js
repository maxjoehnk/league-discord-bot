const Discord = require('discord.js');
const { join } = require('path');
const { load } = require('./config');
const { db, migrate } = require('./db');
const champion = require('./commands/champion');
const build = require('./commands/build');
const d = require('debug')('league-discord:index');

const start = async() => {
    await migrate(db);
    const config = await load(join(__dirname, '../config.yml'));
    const client = new Discord.Client();
    client.on('ready', () => {
        d('Discord is ready');
    });
    client.on('message', async msg => {
        if (msg.content.startsWith(config.discord.prefix)) {
            const args = msg.content
                .slice(config.discord.prefix.length)
                .trim()
                .split(/ +/g);
            const cmd = args.shift();
            try {
                switch (cmd) {
                    case champion.cmd:
                        return await champion.exec(config)(args, msg);
                    case build.cmd:
                        return await build.exec(config)(args, msg);
                }
            }catch (err) {
                console.error(err);
                return await msg.reply(err.message);
            }
        }
        if (msg.content.startsWith('!lb')) {
            const args = msg.content
                .slice('!lb'.length)
                .trim()
                .split(/ +/g);
            try {
                return await build.exec(config)(args, msg);
            }catch (err) {
                console.error(err);
                return await msg.reply(err.message);
            }
        }
    });
    await client.login(config.discord.token);
};

start().catch(err => console.error(err));