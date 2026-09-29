export const name = "principal";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Cette commande est réservée aux groupes."
      },
      { quoted: msg }
    );
  }

  try {
    const meta = await cifer.groupMetadata(jid);
    const creatorId = meta.owner;

    if (!creatorId) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Créateur du groupe introuvable."
        },
        { quoted: msg }
      );
    }

    const principalMessage = `╭━━━〔 👑 𝗣𝗥𝗜𝗡𝗖𝗜𝗣𝗔𝗟 〕━━━╮
┃
┃ 👑 Créateur du groupe :
┃
┃ ➤ @${creatorId.split("@")[0]}
┃
╰━━━━━━━━━━━━━━━━━━━━╯

> ⚡ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗`;

    // Envoi dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text: principalMessage,
        mentions: [creatorId]
      },
      { quoted: msg }
    );

  } catch (e) {
    console.error("❌ Erreur principal :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de récupérer le créateur du groupe."
      },
      { quoted: msg }
    );
  }
}