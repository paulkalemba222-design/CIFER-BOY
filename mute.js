export const name = "mute";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Commande de groupe uniquement." },
      { quoted: msg }
    );
  }

  try {
    await cifer.groupSettingUpdate(jid, "announcement");

    const text =
      "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔇 Groupe en mode *lecture seule* (seuls les admins peuvent écrire).";

    // Message dans le groupe
    await cifer.sendMessage(
      jid,
      { text },
      { quoted: msg }
    );

    // Message dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      { text }
    );

  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de muter le groupe."
      },
      { quoted: msg }
    );
  }
}