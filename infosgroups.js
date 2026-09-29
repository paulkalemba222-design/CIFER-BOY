export const name = "infosgroups";

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
    const admins = meta.participants.filter((p) => p.admin);
    const desc = meta.desc || "Pas de description";

    const text = `╭════۩۞۩════╮
   ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD - Infos Groupe
╰════۩۞۩════╯

📛 *Nom:* ${meta.subject}
👥 *Membres:* ${meta.participants.length}
👑 *Admins:* ${admins.length}
📝 *Description:* ${desc}
🔒 *Restriction:* ${meta.announce ? "Admins seulement" : "Tous"}
🆔 *ID:* ${meta.id}`;

    await cifer.sendMessage(jid, { text }, { quoted: msg });
  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de récupérer les infos du groupe.",
      },
      { quoted: msg }
    );
  }
}