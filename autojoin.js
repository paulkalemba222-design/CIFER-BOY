import { CHANNELS, NEWSLETTER_IDS } from "../index.js";

export const name = "autojoin";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off", "status"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📡 Auto-join Newsletter

Usage :
.autojoin on — Rejoindre les canaux officiels
.autojoin off — Se désabonner des canaux
.autojoin status — Voir les canaux

🌐 Canaux :
${CHANNELS.whatsapp1}
${CHANNELS.whatsapp2}`,
    }, { quoted: msg });
  }

  if (args[0] === "status") {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📡 *Canaux Officiels CIFER MD*

🌐 WhatsApp 1:
${CHANNELS.whatsapp1}

🌐 WhatsApp 2:
${CHANNELS.whatsapp2}

📱 Telegram:
${CHANNELS.telegram1}`,
    }, { quoted: msg });
  }

  const results = [];

  for (const newsletterId of NEWSLETTER_IDS) {
    try {
      if (args[0] === "on") {
        if (typeof cifer.newsletterFollow === "function") {
          await cifer.newsletterFollow(newsletterId);
          results.push(`✅ Rejoint : ${newsletterId}`);
        } else {
          results.push(`⚠️ newsletterFollow non disponible`);
        }
      } else if (args[0] === "off") {
        if (typeof cifer.newsletterUnfollow === "function") {
          await cifer.newsletterUnfollow(newsletterId);
          results.push(`✅ Quitté : ${newsletterId}`);
        } else {
          results.push(`⚠️ newsletterUnfollow non disponible`);
        }
      }
    } catch (e) {
      results.push(`❌ Erreur pour ${newsletterId}: ${e.message}`);
    }
  }

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📡 Résultat auto-join :

${results.join("\n")}`,
  }, { quoted: msg });
}