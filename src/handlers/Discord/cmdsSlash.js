
const fs = require("fs");

/**
 * Load Slash Commands
 */
module.exports = {
    name: 'loadLegacyCommands',
    enabled: true,

    /**
     * @param {Client} client 
     */
    async load(client) {
        console.log(client.chalk.log, `Preparing slashes…`);
        const _base_path = client.cwd + '\\src\\commands\\slash\\';
        let slash = [];

        const commandFolders = fs.readdirSync(_base_path);
        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(_base_path + folder)
                .filter((file) => file.endsWith(".js"));
            
            for (const file of commandFiles) {
                const command = require(_base_path + folder + '\\' + file);
                
                if (command.name) {
                    // https://discord.com/developers/docs/interactions/application-commands
                    if (command.name < 1 || command.name > 32) {
                        console.log(client.chalk.err, `Warning: Command name not in range 1-32, skipping:`);
                        console.log(command);
                        continue;
                    }
                    if (command.description < 1 || command.description > 100) {
                        console.log(client.chalk.err, `Warning: Command description not in range 1-100, skipping:`);
                        console.log(command);
                        continue;
                    }
                    client.slash.set(command.name, command);
                    slash.push(command);
                    console.log(client.chalk.load, client.chalk.ok, `SlashCommand: "${file}"${((command.triggers) ? ('; "' + JSON.stringify(command.triggers) + '"') : (''))}`); // SlashCommand is being loaded:
                } else {
                    console.log(client.chalk.load, client.chalk.err, `SlashCommand missing a help.name or help.name is not in string: "${file}"`);
                    continue;
                }
            }
        }
        // console.log(client.chalk.log, `Waiting for client readiness…`);

        client.on("ready", async() => {
            // Register Slash Commands for a single guild
            // await client.guilds.cache
            //    .get("YOUR_GUILD_ID")
            //    .commands.set(slash);

            const register = 1; // or purge, bool in int
            if (Boolean(register)) {
                console.log(client.chalk.load, `Registering ${slash.length} Slash Commands for all guilds.`);
                //console.log(slash);
                /* for (let i = 0; i < slash.length; i++) {
                    let cmd  = slash[i];
                    let ii   = i < 10 ? ` ${i}`: i;
                    let iii  = cmd.name.length < 10 ? ` ${cmd.name.length}`: cmd.name.length;
                    let iiii = cmd.description.length < 100 ? cmd.description.length < 10 ? `  ${cmd.description.length}`: ` ${cmd.description.length}`: cmd.description.length;
                    console.log(`[${ii}/${slash.length - 1}] (${iii}/32;${iiii}/100) "${cmd.name}", "${cmd.description}"`);
                } */
                await client.application.commands.set(slash);
                /* await client.application.commands.fetch()
                    .then(() => console.log(client.chalk.log, client.chalk.ok, `Registered Slash Commands for all guilds:\n`, slash.keys())); */
                    //((command) => console.log(command.values()));
            } else {
                console.log(client.chalk.log, client.chalk.ok, `Purging all slash commands from old version of bot.`);
                // This takes ~1 hour to update
                await client.application.commands.fetch().then((command) => {
                    console.log(command);
                    command.delete();
                });
                await client.application.commands.set([]);
                // This updates immediately
                client.guilds.cache.get(process.env.MASTER_SERVER).commands.set([]);
            }
        })
        console.log(client.chalk.log, client.chalk.ok, `Preparing slashes done.`);
    }
}
