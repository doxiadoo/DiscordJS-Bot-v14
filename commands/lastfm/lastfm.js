const { EmbedBuilder } = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "lastfm",
    aliases: [],
    punitop: false,
    adminPermit: false,
    ownerPermit: false,
    cat: "lastfm",
    run: async (client, message, args, prefix) => {
        const apiKey = "441d9fa53651e70467524ed75141759c"; // Replace with your Last.fm API Key

        // Check if a username was provided
        const username = args[0];
        if (!username) {
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription("Please provide a Last.fm username.\nUsage: `" + prefix + "lastfm <username>`")
                ]
            });
        }

        try {
            // Call the Last.fm API to get recent tracks
            const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json`);
            const data = await response.json();

            // Check if the user exists
            if (data.error || !data.recenttracks) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF0000")
                            .setDescription(`No information found for the user **${username}** on Last.fm.`)
                    ]
                });
            }

            const recentTracks = data.recenttracks.track;
            if (!recentTracks || recentTracks.length === 0) {
                return message.channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("#FF0000")
                            .setDescription(`The user **${username}** has no recent tracks on Last.fm.`)
                    ]
                });
            }

            // Get the most recent track
            const track = recentTracks[0];
            const nowPlaying = track["@attr"] && track["@attr"].nowplaying ? "Now Playing" : "Last Played";

            const embed = new EmbedBuilder()
                .setColor("#1DB954")
                .setAuthor({ name: `${username} on Last.fm`, iconURL: track.image[1]["#text"], url: `https://www.last.fm/user/${username}` })
                .setDescription(`**${nowPlaying}**\n[${track.name}](https://www.last.fm/music/${encodeURIComponent(track.artist["#text"])}/${encodeURIComponent(track.name)}) by **${track.artist["#text"]}**`)
                .setThumbnail(track.image[2]["#text"] || null)
                .setFooter({ text: "Data retrieved from Last.fm", iconURL: "https://upload.wikimedia.org/wikipedia/commons/6/69/Last.fm_Logo.png" });

            return message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FF0000")
                        .setDescription("An error occurred while trying to fetch data from Last.fm. Please try again later.")
                ]
            });
        }
    }
};
