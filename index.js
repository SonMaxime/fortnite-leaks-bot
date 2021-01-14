const request = require("request-promise");
const EGClient = require('epicgames-client').Client;
const Fortnite = require('epicgames-fortnite-client');
const { ESubGame } = Fortnite;
const { EPlatform } = require('epicgames-client');
const { EInputType } = require('epicgames-client');
const { EPartyPrivacy } = require('epicgames-client');
const config = require("./config.json");

var CID = config.cid
var BID = config.bid
var EID = config.eid
var PICKAXE_ID = config.pickaxe_id

let eg = new EGClient({
  email: config.email,
  password: config.password,
  debug: console.log,
  defaultPartyConfig: {
 	  privacy: EPartyPrivacy.PUBLIC,
  	joinConfirmation: false,
  	joinability: 'OPEN',
  	maxSize: 16,
	  subType: 'default',
	  type: 'default',
	  inviteTTL: 14400,
  	chatEnabled: true,
}
  });

  function sleep(milliseconds) {
var start = new Date().getTime();
for (var i = 0; i < 1e7; i++) {
  if ((new Date().getTime() - start) > milliseconds){
    break;
  }
}
}

    eg.init().then(async (success) => {

      var current_party;

      if(!success)
        throw new Error('Ne peut démarrer Epic Games Launcher.');

      if(!await eg.login())
        throw new Error('Erreur de connexion sur le compte Epic Games.');

        const fortnite = await eg.runGame(Fortnite, {
	netCL: config.netcl,
	partyBuildId: '1:1:' + config.netcl,
	});
      const br = await fortnite.runSubGame(ESubGame.BattleRoyale);


      fortnite.communicator.on('party:member:joined', async (member) => {
        console.log(`#${member.id} a rejoint.`);
        console.log(`Nombre de membres : ${fortnite.party.members.length}`);

          fortnite.party.me.setOutfit("/Game/Athena/Items/Cosmetics/Characters/" + CID + "." + CID);

          fortnite.party.me.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + BID + "." + BID);

          fortnite.party.me.setPickaxe("/Game/Athena/Items/Cosmetics/Pickaxes/" + PICKAXE_ID + "." + PICKAXE_ID); // ALL OF THE THINGS ARE PULLED FROM ABOVE!

          fortnite.party.me.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + EID + "." + EID);

          fortnite.party.me.setBattlePass(true, 100, 999999999, 999999999);

	        fortnite.party.me.setBanner(config.banner_level, config.banner, config.banner_color);
      });

      fortnite.communicator.on('party:invitation', async (invitation) => {
        current_party = invitation.party;
        await invitation.accept()
      });

      fortnite.communicator.on('friend:request', async (friendops) => {
        if(config.friendaccept == "true") {
          eg.communicator.sendMessage(friendops.friend.id, "Thanks for friending me! I'm a lobby bot, to use me invite or join my party then send me the CID or EID in private messages!");
          sleep(200);
          eg.acceptFriendRequest(friendops.friend.id)
        }else {
          eg.communicator.sendMessage(friendops.friend.id, "Désolé, le bot n'accepte pas les demandes d'ami");
          sleep(200);
          eg.declineFriendRequest(friendops.friend.id)
        }
      });

      eg.communicator.on('friend:message', async (data) => {

        if(data.message == 'help'){
              eg.communicator.sendMessage(data.friend.id, 'Commands: CID_ , EID_ , BID_ , .banner, .stop, .bp, .status, .ready, .unready');
}

        var args = data.message.split(" ");
        if(args[0].includes('CID_')){
          CID = args[0];
          try {
            fortnite.party.me.setOutfit("/Game/Athena/Items/Cosmetics/Characters/" + args[0] + "." + args[0]);
            eg.communicator.sendMessage(data.friend.id, "Skin set to " + args[0]);
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Please use CID");
          }
        }

        if(args[0].includes('EID_')){
          EID = args[0];
          try {
            fortnite.party.me.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + args[0] + "." + args[0]);
            eg.communicator.sendMessage(data.friend.id, "Emote set to " + args[0]);
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Please use EID");
          }
        }

        if(args[0].includes('Pickaxe_ID_')){
          PICKAXE_ID = args[0];
          try {
            fortnite.party.me.setPickaxe("/Game/Athena/Items/Cosmetics/Pickaxes/" + args[0] + "." + args[0]);
            eg.communicator.sendMessage(data.friend.id, "Pickaxe set to " + args[0]);
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Please use Pickaxe_ID");
          }
        }

        if(args[0].includes('BID_')){
          BID = args[0];
          try {
            fortnite.party.me.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + args[0] + "." + args[0]);
            eg.communicator.sendMessage(data.friend.id, "Backbling set to " + args[0]);
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Please use BID");
          }
        }

        if (args[0].toLowerCase() == ".status"){
            var mess = data.message.replace("!status", "");
            fortnite.communicator.updateStatus(mess);
            communicator.sendMessage(data.friend.id, 'Status set to ' + mess + "!");
    }

    if (args[0].toLowerCase() == ".update"){
      fortnite.party.me.setOutfit("/Game/Athena/Items/Cosmetics/Characters/" + config.cid + "." + config.cid);

      fortnite.party.me.setBackpack("/Game/Athena/Items/Cosmetics/Backpacks/" + config.bid + "." + config.bid);

      fortnite.party.me.setPickaxe("/Game/Athena/Items/Cosmetics/Pickaxes/" + config.pickaxe_id + "." + config.pickaxe_id);

      fortnite.party.me.setEmote("/Game/Athena/Items/Cosmetics/Dances/" + config.eid + "." + config.eid);
    }

        if(args[0].toLowerCase() == ".banner"){
          try {
            fortnite.party.me.setBanner(100, args[1], args[2]);
            eg.communicator.sendMessage(data.friend.id, "Bannière mis à " + args[1] + " " + args[2]);
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Utilisez .banner couleur de la bannière");
          }
        }

        if(args[0].toLowerCase() == ".ready"){
          try {
            fortnite.party.me.setReady(true);
            eg.communicator.sendMessage(data.friend.id, "Prêt!");
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Please use .ready");
          }
        }

        if(args[0].toLowerCase() == ".unready"){
          try {
            fortnite.party.me.setReady(false);
            eg.communicator.sendMessage(data.friend.id, "Unprêt!");
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Utilisez .unready");
          }
        }

        if(args[0].toLowerCase() == ".bp"){
          try {
            fortnite.party.me.setBattlePass(true, args[1], args[2], args[3]);
            eg.communicator.sendMessage(data.friend.id, "BP mis à " + args[1] + " " + args[2] + " " + args[3] + "!");
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Utilisez .bp LEVEL XPPERSO FRIENDXP");
          }
        }

        if(args[0].toLowerCase() == ".stop"){
          try {
            fortnite.party.me.clearEmote();
            eg.communicator.sendMessage(data.friend.id, "Emote stopé !");
          } catch {
            eg.communicator.sendMessage(data.friend.id, "Utilisez .stop");
          }
        }
  });

      fortnite.communicator.updateStatus('| Créé par @SonMaxime.#9355 |');
    });
