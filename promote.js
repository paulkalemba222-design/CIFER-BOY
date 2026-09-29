export const name = "promote";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Commande de groupe uniquement."
      },
      { quoted: msg }
    );
  }

  const mentioned =
    msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];

  const participant =
    msg.message?.extendedTextMessage?.contextInfo?.participant;

  const targets = mentioned.length
    ? mentioned
    : participant
      ? [participant]
      : [];

  if (!targets.length) {
    return await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Usage : .promote @membre"
      },
      { quoted: msg }
    );
  }

  try {
    await cifer.groupParticipantsUpdate(jid, targets, "promote");

    const promoteMessage = `╭━━━〔 👑 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮
┃
┃ ✅ Promotion réussie !
┃
┃ 👑 ${targets
      .map((t) => "@" + t.split("@")[0])
      .join(", ")}
┃
┃ ⭐ Est/sont maintenant admin(s).
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    // Envoi dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text: promoteMessage,
        mentions: targets
      },
      { quoted: msg }
    );

  } catch (e) {
    console.error("❌ Erreur promote :", e);

    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de promouvoir le membre."
      },
      { quoted: msg }
    );
  }
}