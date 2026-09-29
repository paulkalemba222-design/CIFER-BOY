export const name = "demote";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Commande de groupe uniquement." },
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
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Usage : .demote @membre" },
      { quoted: msg }
    );
  }

  try {
    await cifer.groupParticipantsUpdate(jid, targets, "demote");

    await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ ${targets
          .map((t) => "@" + t.split("@")[0])
          .join(", ")} n'est/ne sont plus admin(s).`,
        mentions: targets,
      },
      { quoted: msg }
    );
  } catch (e) {
    await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de rétrograder." },
      { quoted: msg }
    );
  }
}