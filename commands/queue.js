"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const i18n_1 = require("../utils/i18n");
exports.default = {
    data: new discord_js_1.SlashCommandBuilder().setName("queue").setDescription(i18n_1.i18n.__("queue.description")),
    cooldown: 5,
    permissions: [discord_js_1.PermissionsBitField.Flags.AddReactions, discord_js_1.PermissionsBitField.Flags.ManageMessages],
    async execute(interaction) {
        const queue = index_1.bot.queues.get(interaction.guild.id);
        if (!queue || !queue.songs.length)
            return interaction.reply({ content: i18n_1.i18n.__("queue.errorNotQueue") });
        let currentPage = 0;
        const embeds = generateQueueEmbed(interaction, queue.songs);
        await interaction.reply("⏳ Loading queue...");
        if (interaction.replied)
            await interaction.editReply({
                content: `**${i18n_1.i18n.__mf("queue.currentPage")} ${currentPage + 1}/${embeds.length}**`,
                embeds: [embeds[currentPage]]
            });
        const queueEmbed = await interaction.fetchReply();
        try {
            await queueEmbed.react("⬅️");
            await queueEmbed.react("⏹");
            await queueEmbed.react("➡️");
        }
        catch (error) {
            console.error(error);
            interaction.channel.send(error.message).catch(console.error);
        }
        const filter = (reaction, user) => ["⬅️", "⏹", "➡️"].includes(reaction.emoji.name) && interaction.user.id === user.id;
        const collector = queueEmbed.createReactionCollector({ filter, time: 60000 });
        collector.on("collect", async (reaction, user) => {
            try {
                if (reaction.emoji.name === "➡️") {
                    if (currentPage < embeds.length - 1) {
                        currentPage++;
                        queueEmbed.edit({
                            content: i18n_1.i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                }
                else if (reaction.emoji.name === "⬅️") {
                    if (currentPage !== 0) {
                        --currentPage;
                        queueEmbed.edit({
                            content: i18n_1.i18n.__mf("queue.currentPage", { page: currentPage + 1, length: embeds.length }),
                            embeds: [embeds[currentPage]]
                        });
                    }
                }
                else {
                    collector.stop();
                    reaction.message.reactions.removeAll();
                }
                await reaction.users.remove(interaction.user.id);
            }
            catch (error) {
                console.error(error);
                return interaction.channel.send(error.message).catch(console.error);
            }
        });
    }
};
function generateQueueEmbed(interaction, songs) {
    let embeds = [];
    let k = 10;
    for (let i = 0; i < songs.length; i += 10) {
        const current = songs.slice(i, k);
        let j = i;
        k += 10;
        const info = current.map((track) => `${++j} - [${track.title}](${track.url})`).join("\n");
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle(i18n_1.i18n.__("queue.embedTitle"))
            .setThumbnail(interaction.guild?.iconURL())
            .setColor("#F8AA2A")
            .setDescription(i18n_1.i18n.__mf("queue.embedCurrentSong", { title: songs[0].title, url: songs[0].url, info: info }))
            .setTimestamp();
        embeds.push(embed);
    }
    return embeds;
}
//# sourceMappingURL=queue.js.map