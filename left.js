export const name = "left";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Commande de groupe uniquement." },
      { quoted: msg }
    );
  }

  await cifer.sendMessage(
    jid,
    { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 👋🏾 Au revoir !" },
    { quoted: msg }
  );

  await cifer.groupLeave(jid);
}