const fs = require('fs');
const path = require('path');
const https = require('https');
const {
    Client
} = require('discord.js');

const token = 'MTExNDMxNjYyNjY1ODA3MDUyOA.GpNibs.b0whY8CTp3BgtwGV-2szxwGVT-bbx9IB2DpG8g';
const serverId = '1109565980071428146';
// Enable or disable tag retrieval (true to enable, false to disable)
const includeTag = true;
const client = new Client();

client.once('ready', () => {
    console.log(client.user.tag,'Connected');

    const server = client.guilds.cache.get(serverId);
    if (!server) {
        console.log('Invalid server ID');
        client.destroy();
        return;
    }

    const avatarsFolder = path.join(__dirname, 'avatars');
    if (!fs.existsSync(avatarsFolder)) {
        fs.mkdirSync(avatarsFolder);
    }

    const usernamesFolder = path.join(__dirname, 'username');
    if (!fs.existsSync(usernamesFolder)) {
        fs.mkdirSync(usernamesFolder);
    }

    const currentDate = new Date();
    const filename = `${currentDate.getTime()}.txt`;
    const filePath = path.join(usernamesFolder, filename);

    server.members.cache.each((member) => {

        if (member.user.avatar) {
            const avatarPath = path.join(avatarsFolder, `${member.user.id}.png`);
            const avatarURL = `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png`;

            const file = fs.createWriteStream(avatarPath);
            https.get(avatarURL, (response) => {
                response.pipe(file);
                console.log(`Registered user's avatar ${member.user.tag}.`);
            });
        }

        const username = includeTag ? member.user.tag : member.user.username;

        fs.appendFileSync(filePath, username + '\n');
        console.log(`Registered username of ${member.user.tag}.`);
    });

    client.destroy();
});

client.login(token);