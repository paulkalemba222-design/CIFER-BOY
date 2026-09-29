export const name = "tag";

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

  const text = args.join(" ");

  if (!text) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Usage : .tag <message>"
      },
      { quoted: msg }
    );
  }

  try {
    const meta = await cifer.groupMetadata(jid);

    const mentions = meta.participants.map(
      (p) => p.id
    );

    // Tag dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text,
        mentions
      },
      { quoted: msg }
    );

    // Notification dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text:
          `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📢 TAG GROUPE\n\n${text}`
      }
    );

  } catch (e) {
    console.error("❌ Erreur tag :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur tag."
      },
      { quoted: msg }
    );
  }
}