export const name = "whois";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const participant =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    const target =
      mentioned ||
      participant ||
      (jid.endsWith("@g.us") ? msg.key.participant : jid);

    if (!target) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Mentionne un utilisateur ou réponds à son message."
        },
        { quoted: msg }
      );
    }

    let pp = "Pas de photo";

    try {
      pp = await cifer.profilePictureUrl(target, "image");
    } catch {}

    const text = `╭════۩۞۩════╮
   𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 - WHOIS
╰════۩۞۩════╯

📱 *Numéro:* +${target.split("@")[0]}
🔗 *JID:* ${target}`;

    if (pp !== "Pas de photo") {
      await cifer.sendMessage(
        jid,
        {
          image: { url: pp },
          caption: text
        },
        { quoted: msg }
      );
    } else {
      await cifer.sendMessage(
        jid,
        { text },
        { quoted: msg }
      );
    }

  } catch (e) {
    console.error("❌ Erreur whois :", e);

    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur whois."
      },
      { quoted: msg }
    );
  }
}