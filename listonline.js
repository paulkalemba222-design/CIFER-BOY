export const name = "listonline";

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
    const chats = cifer.chats || {};

    const online = Object.entries(chats)
      .filter(([id, chat]) =>
        id.endsWith("@s.whatsapp.net") &&
        chat?.presences &&
        meta.participants.some((p) => id.startsWith(p.id))
      )
      .map(([id], i) => `*${i + 1}.* @${id.split("@")[0]}`)
      .join("\n");

    await cifer.sendMessage(
      jid,
      {
        text: `> ╭════۩۞۩════╮
> 👤 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 - LIST ONLINE
> ╰════۩۞۩════╯
<==================>
${online || "Aucun membre en ligne."}`,
      },
      { quoted: msg }
    );
  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text: `> ⚠️ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Impossible de récupérer la liste.
Raison: ${e.message}`,
      },
      { quoted: msg }
    );
  }
}