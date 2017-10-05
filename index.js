const login = require('./data.json');
const token = login.token;


const discord = require('discord.js');
const client = new discord.Client();
const fs = require('fs');

String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

client.login(token)
    .then(() => console.log('Tout est ok je suis connecté sur ' + client.user.username))
    .catch(() => console.log('Change de token'));

client.on("message", msg => {
    let level = JSON.parse(fs.readFileSync("./level.json", "utf8"));
    var prefix = "%"
    if(msg.content.startsWith(prefix + 'rank')){
        var cmd = msg.content.split(' ').slice(1)[0]; // => commande
        switch(cmd){ // => ça va etre choisi
            case 'enabled' : 
                // Partie commande pour enabled
                if(level[msg.guild.id]) return msg.reply('la commande est déja activé');
                level[msg.guild.id] = {
                    niveau : 'enabled'
                }
                fs.writeFile("./level.json", JSON.stringify(level), err =>{
                    if(err) niv.reply('Erreur lors de la sauvegarde : ' + err)
                });
                if(!level[msg.guild.id]){
                    return msg.reply('Une erreur inconnue est survenue');
                } else {
                    return msg.reply('Le système de level a été activé');
                }
            break;
            case 'disabled' : 
                // Partie commande pour disabled
                if(!level[msg.guild.id]) return msg.reply('la commande est déja désactivé');
                delete level[msg.guild.id];
                fs.writeFile("./level.json", JSON.stringify(level), err =>{
                    if(err) niv.reply('Erreur lors de la sauvegarde : ' + err)
                });
                if(level[msg.guild.id]){
                    return msg.reply('Une erreur inconnue est survenue');
                } else {
                    return msg.reply('Le système des levels a été désactivé');
                }
            break;
            default : 
                //Partie user
                var serv = level[msg.guild.id];
                var verif = serv[msg.author.id];
                if(verif == undefined){
                    var xp = '0';
                } else {
                    var xp = verif.xp;
                }
                var xp_summ = require('./level.js');
                xp_summ.xp(msg, xp)
                    .then( result =>{
                        console.log(result)
                        msg.reply(`Votre level est ${result} avec ${xp} xp`);
                    })
            return;

        }
    }
});

client.on('message', niv =>{
    let level = JSON.parse(fs.readFileSync("./level.json", "utf8"));
    if(!level[niv.guild.id]) return; // => commande non activé
    if(niv.author.bot) return; // => on ne veux pas de vous
    var serv = level[niv.guild.id];
    if(!serv[niv.author.id]){
        console.log('Ajout d\'un nouvelle utilisateur');
        serv[niv.author.id] = {
            xp : 0
        }
    }
    console.log(serv[niv.author.id]);
    var old_xp = serv[niv.author.id].xp || '0';

    //Aller l'user peux maximum avoir 20 pts par message;
    function randomInt(high){
        return Math.floor(Math.random() * high)
    }
    console.log(randomInt(20));
    serv[niv.author.id].xp = randomInt(20) + parseInt(old_xp, 10);
    fs.writeFile("./level.json", JSON.stringify(level), err =>{
        if(err) niv.reply('Erreur lors de la sauvegarde : ' + err)
    });
})
