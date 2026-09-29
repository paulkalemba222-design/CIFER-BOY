import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "photo";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const quoted =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.stickerMessage;

    if (!quoted) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Réponds au sticker à convertir en image."
        },
        { quoted: msg }
      );
    }

    const stream = await downloadContentFromMessage(
      quoted,
      "sticker"
    );

    let buffer = Buffer.from([]);

    for await (const chunk of stream) {
      buffer = Buffer.concat([buffer, chunk]);
    }

    const caption =
      "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Conversion réussie ✅";

    // Image dans le chat
    await cifer.sendMessage(
      jid,
      {
        image: buffer,
        caption
      },
      { quoted: msg }
    );

    // Image dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        image: buffer,
        caption
      }
    );

  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text:
          "❌ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Erreur conversion sticker → photo : " +
          e.message
      },
      { quoted: msg }
    );
  }
}