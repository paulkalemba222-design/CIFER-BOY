export const name = "unmute";

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
    // 🔊 Ouvre réellement le groupe
    await cifer.groupSettingUpdate(
      jid,
      "not_announcement"
    );

    const text =
      "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔊 Groupe *démuté* — tout le monde peut écrire. ✅";

    // Message dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text
      },
      { quoted: msg }
    );

    // Notification dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔊 Un groupe a été démuté. ✅"
      }
    );

  } catch (e) {
    console.error("❌ Erreur unmute :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de démuter le groupe."
      },
      { quoted: msg }
    );
  }
}