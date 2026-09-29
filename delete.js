export const name = "delete";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const quoted = msg.message?.extendedTextMessage?.contextInfo;

  if (!quoted?.stanzaId) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds au message à supprimer." },
      { quoted: msg }
    );
  }

  try {
    await cifer.sendMessage(jid, {
      delete: {
        remoteJid: jid,
        fromMe: false,
        id: quoted.stanzaId,
        participant: quoted.participant,
      },
    });
  } catch (e) {
    await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de supprimer ce message." },
      { quoted: msg }
    );
  }
}