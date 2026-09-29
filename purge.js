export const name = "purge";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  const count = Math.min(parseInt(args[0]) || 10, 50);

  try {
    await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚜️ Purge de ${count} messages en cours...`
      },
      { quoted: msg }
    );

    const messages = await cifer.fetchMessagesFromWA(jid, count);

    if (!messages?.length) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Aucun message trouvé à supprimer."
        },
        { quoted: msg }
      );
    }

    let deleted = 0;

    for (const message of messages) {
      if (!message?.key?.id) continue;

      try {
        await cifer.sendMessage(jid, {
          delete: message.key
        });

        deleted++;
      } catch {}
    }

    const purgeMessage =
      `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ Purge terminée.\n` +
      `> 🗑️ ${deleted} message(s) supprimé(s).`;

    // Résultat dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text: purgeMessage
      },
      { quoted: msg }
    );

  } catch (e) {
    console.error("❌ Erreur purge :", e);

    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible d'effectuer la purge."
      },
      { quoted: msg }
    );
  }
}