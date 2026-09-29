export const name = "kick";

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
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Mentionne un membre : .kick @membre" },
      { quoted: msg }
    );
  }

  try {
    await cifer.groupParticipantsUpdate(jid, targets, "remove");

    await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🦹 Vilain retiré du groupe : ${targets
          .map((t) => "@" + t.split("@")[0])
          .join(", ")}`,
        mentions: targets,
      },
      { quoted: msg }
    );
  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible d'expulser (vérifiez mes droits admin).",
      },
      { quoted: msg }
    );
  }
}