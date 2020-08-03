const { Command } = require('discord.js-commando');
const config = require('../../config.json')
const Discord = require("discord.js")
const client = new Discord.Client()

module.exports = class InhousesCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'inhouses',
            aliases: ['ih', 'inhouse'],
            group: 'utility',
            memberName: 'inhouses',
            description: 'Set up custom inhouse lobbies easily!',
            examples: [`${config.prefix} inhouses firstArg`],
            args: [{
                key: 'teamSize',
                    prompt: 'How many people will be on each team?',
                    type: 'integer',
            }]
        });
    }

    async run(msg, args) {
        /* Top is gotten by typing \:emoji_name: 
           Bottom is the snowflake. */
        let reactionEmojiString = '<:paw:739673498481328129>'
        let reactionEmoji = '739673498481328129'
        var numPlayers
        var players = [];
        var team1 = [];
        var team2 = [];


        /* Embed message */
        const embed = new Discord.MessageEmbed()
            .setColor('#F56600')
            .setTitle(`🐯 Clemson Esports Inhouses 🐯`)
            .setDescription(`React to this message with a ${reactionEmojiString} to be put into the random team generation!`)
            .setThumbnail('https://www.clemson.edu/brand/resources/logos/paw/orange.png')
            .setTimestamp();

        const filter = (reaction, user) => reaction.emoji.id === reactionEmoji && user.id === msg.author.id;

        /* Send the message and start the reaction to it! */
        msg.say(embed).then(sentEmbed => {
            sentEmbed.react(reactionEmoji);
            // wait for user reaction
            sentEmbed.awaitReactions(filter, {time: 1000 * 5})
            .then(async collected => {
                // check if there is enough player for inhouse
                numPlayers = collected.first().users.cache.size - 1;
                if (numPlayers < args.teamSize) {
                    sentEmbed.say(`Not enough players, only ${numPlayers} user(s) signed up`)
                }
                else {
                    collected.first().users.cache.each(user => {
                        // make sure user is not bot
                        if (!user.bot) {
                            players.push(user.username);
                        }
                    })
                    // assign players to teams
                    var temp;
                    for (var i=0; i < 2; i++) {
                        for (var j =0; j < args.teamSize; j++) {
                            temp = Math.floor(Math.random() * players.length);
                            if (i === 0) {
                                team1[j] = players[temp];
                                players.splice(temp, 1);
                            }
                            else {
                                team2[j] = players[temp];
                                players.splice(temp, 1);
                            }
                        }
                    }
                    // send team embed
                    var description = await formatPlayer(team1, team2);
                    sentEmbed.say(embed
                        .setDescription(description)
                        .setTimestamp());
                }
            })
            .catch(collected => sentEmbed.say("Error, command failed"));
        });


    }
};

async function formatPlayer(team1, team2) {

    let str = ''

    str += '▬▬▬▬▬▬▬▬▬Blue Team▬▬▬▬▬▬▬▬▬\n\n'

    for (var i = 0; i < team1.length; i++) {
        str += ':small_blue_diamond:' + ' ' + team1[i] + '\n';
    }

    str += '▬▬▬▬▬▬▬▬▬Red Team▬▬▬▬▬▬▬▬▬\n\n'

    for (var i = 0; i < team2.length; i++) {
        str += ':small_red_triangle_down:' + ' ' + team2[i] + '\n';
    }
    
    str += '**▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬**'

    return str
}