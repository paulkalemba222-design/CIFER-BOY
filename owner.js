import { BOT_NAME, CHANNELS } from "../index.js";

export const name = "owner";

const OWNER_NUMBERS = [
  "2250506420978",
  "2250141496944"
];

const CHANNEL_JID = "120363408953987969@newsletter";
const OWNER_IMAGE = "./nsys.png";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  const text = `╔═══•❥🌑•❥═══•❥🌑•❥═══╗
        🏅 ${BOT_NAME} 🏅
╚═══•❥🌑•❥═══•❥🌑•❥═══╝

╔══════•⊰👁️‍🗨️⊱•══════╗
     🕷️ 𝘽𝙔 𝘿𝙀𝙑 𝗖𝗜𝗙𝗘𝗥 🕷️
╚══════•⊰👁️‍🗨️⊱•══════╝

│ ⚫ *Rejoins la Confrérie ${BOT_NAME}* ⚫
│
│ 🖤 CIFER : +${OWNER_NUMBERS[0]}
│ 🖤 CIFER MD : +${OWNER_NUMBERS[1]}
│ 🖤 Telegram : t.me/Deploiement_cifer_bot

╭─────•⊰ 🔮 Canaux Officiels 🔮 ⊱•─────╮
│ 🕯️ WhatsApp :
│ ${CHANNELS.whatsapp1}
│
│ 🕯️ WhatsApp 2 :
│ https://whatsapp.com/channel/0029Vb92v2mKAwEnqxURI22g
│
│ 🕯️ Telegram :
│ t.me/Deploiement_cifer_bot
╰━━━━━━━•⊰⚫⊱•━━━━━━━╯`;

  // Dans le chat
  await cifer.sendMessage(
    jid,
    {
      image: { url: OWNER_IMAGE },
      caption: text
    },
    { quoted: msg }
  );

  // Dans la chaîne
  await cifer.sendMessage(
    CHANNEL_JID,
    {
      image: { url: OWNER_IMAGE },
      caption: text
    }
  );
}