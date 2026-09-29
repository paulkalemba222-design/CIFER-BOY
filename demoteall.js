export const name = "demoteall";

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
    const meta = await cifer.groupMetadata(jid);
    const botId = cifer.user?.id;

    const admins = meta.participants.filter(
      (p) => p.admin && p.id !== botId
    );

    if (!admins.length) {
      return await cifer.sendMessage(
        jid,
        { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Aucun admin à rétrograder." },
        { quoted: msg }
      );
    }

    for (const a of admins) {
      await cifer.groupParticipantsUpdate(jid, [a.id], "demote").catch(() => {});
    }

    await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ ${admins.length} admin(s) rétrogradé(s).`,
      },
      { quoted: msg }
    );
  } catch (e) {
    await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur demoteall." },
      { quoted: msg }
    );
  }
}