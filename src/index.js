const Discord = require('discord.js');
const { join } = require('path');
const { load } = require('./config');
const { db, migrate } = require('./db');
const champion = require('./commands/champion');
const build = require('./commands/build');
const ability = require('./commands/ability');
const d = require('debug')('league-discord:index');

const parseMsg = prefix => msg => msg.content
    .slice(prefix.length)
    .trim()
    .split(/ +/g);

const captureHandler = async(msg, handler) => {
    try {
        await handler();
    }catch (err) {
        console.error(err);
        await msg.reply(err.message);
    }
};

const shortcut = (cmd, executor) => {
    const parse = parseMsg(cmd);
    return async msg => {
        if (msg.content.startsWith(cmd)) {
            const args = parse(msg);
            await captureHandler(msg, () => executor(args, msg));
        }
    };
};

const start = async() => {
    await migrate(db);
    const config = await load(join(__dirname, '../config.yml'));
    const client = new Discord.Client();
    client.on('ready', () => {
        d('Discord is ready');
    });
    const championShortcut = shortcut('!lc', champion.exec(config));
    const buildShortcut = shortcut('!lb', build.exec(config));
    const abilityShortcut = shortcut('!la', ability.exec(config));
    const parsePrimary = parseMsg(config.discord.prefix);
    client.on('message', async msg => {
        if (msg.content.startsWith(config.discord.prefix)) {
            const args = parsePrimary(msg);
            const cmd = args.shift();
            await captureHandler(msg, async() => {
                switch (cmd) {
                    case champion.cmd:
                        return await champion.exec(config)(args, msg);
                    case build.cmd:
                        return await build.exec(config)(args, msg);
                    case ability.cmd:
                        return await ability.exec(config)(args, msg);
                }
            });
        }
        await championShortcut(msg);
        await buildShortcut(msg);
        await abilityShortcut(msg);
    });
    await client.login(config.discord.token);
};

start().catch(err => console.error(err));
