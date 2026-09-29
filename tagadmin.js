export const name = "tagadmin";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid?.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Commande de groupe uniquement."
      },
      { quoted: msg }
    );
  }

  try {
    const meta = await cifer.groupMetadata(jid);

    const admins = meta.participants.filter(
      (p) => p.admin
    );

    if (!admins.length) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Aucun admin trouvé."
        },
        { quoted: msg }
      );
    }

    const mentions = admins.map(
      (p) => p.id
    );

    const text =
      `╭━━━〔 👑 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮\n` +
      `┃\n` +
      `┃ 👑 *Admins du groupe :*\n` +
      `┃\n` +
      mentions
        .map((m) => `┃ ➤ @${m.split("@")[0]}`)
        .join("\n") +
      `\n┃\n` +
      `╰━━━━━━━━━━━━━━━━━━━━╯`;

    // Résultat dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text,
        mentions
      },
      { quoted: msg }
    );

    // Résultat dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text:
          `📢 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 — 𝗧𝗔𝗚 𝗔𝗗𝗠𝗜𝗡\n\n` +
          text
      }
    );

  } catch (e) {
    console.error("❌ Erreur tagadmin :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur tagadmin."
      },
      { quoted: msg }
    );
  }
}