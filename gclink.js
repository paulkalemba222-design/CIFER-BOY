export const name = "gclink";

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
    const code = await cifer.groupInviteCode(jid);

    await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔗 Lien d'invitation du groupe :
https://chat.whatsapp.com/${code}`,
      },
      { quoted: msg }
    );
  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de récupérer le lien (vérifiez mes droits admin).",
      },
      { quoted: msg }
    );
  }
}