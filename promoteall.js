export const name = "promoteall";

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

  try {
    const meta = await cifer.groupMetadata(jid);

    const nonAdmins = meta.participants.filter((p) => !p.admin);

    if (!nonAdmins.length) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 👑 Tout le monde est déjà admin."
        },
        { quoted: msg }
      );
    }

    for (const p of nonAdmins) {
      await cifer.groupParticipantsUpdate(
        jid,
        [p.id],
        "promote"
      ).catch(() => {});
    }

    const promoteAllMessage = `╭━━━〔 👑 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮
┃
┃ ⚡ PROMOTE ALL
┃
┃ ✅ ${nonAdmins.length} membre(s)
┃ ont été promu(s) admin.
┃
┃ 👑 Tous les membres sont
┃ maintenant administrateurs.
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    // Envoi dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text: promoteAllMessage
      },
      { quoted: msg }
    );

  } catch (e) {
    console.error("❌ Erreur promoteall :", e);

    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur lors de la promotion."
      },
      { quoted: msg }
    );
  }
}