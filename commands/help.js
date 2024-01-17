"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18n_1 = require("../utils/i18n");
const index_1 = require("../index");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder().setName("help").setDescription(i18n_1.i18n.__("help.description")),
    async execute(interaction) {
        let commands = index_1.bot.slashCommandsMap;
        let helpEmbed = new discord_js_1.EmbedBuilder()
            .setTitle(i18n_1.i18n.__mf("help.embedTitle", { botname: interaction.client.user.username }))
            .setDescription(i18n_1.i18n.__("help.embedDescription"))
            .setColor("#FF0000")
			.setFooter({ text: 'Created by shishir_ahmed', iconURL: 'https://cdn.discordapp.com/avatars/265539585025507329/c2adb8479ed055db263dd343e9e27e17.png?size=1024' });
        commands.forEach((cmd) => {
            helpEmbed.addFields({
                name: `**${cmd.data.name}**`,
                value: `${cmd.data.description}`,
                inline: true
            });
        });
        helpEmbed.setTimestamp();
        return interaction.reply({ embeds: [helpEmbed] }).catch(console.error);
    }
};
//# sourceMappingURL=help.js.map