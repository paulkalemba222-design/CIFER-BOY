import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "vv";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  const contextInfo =
    msg.message?.extendedTextMessage?.contextInfo;

  if (!contextInfo?.quotedMessage) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> ????? ??: ?? R¨¦ponds ¨¤ un m¨¦dia view once."
      },
      { quoted: msg }
    );
  }

  try {
    const quotedMessage = contextInfo.quotedMessage;

    const qMsg = {
      key: {
        remoteJid: jid,
        id: contextInfo.stanzaId,
        participant: contextInfo.participant
      },
      message: quotedMessage
    };

    let type = null;

    if (quotedMessage.imageMessage) {
      type = "image";
    } else if (quotedMessage.videoMessage) {
      type = "video";
    }

    if (!type) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> ????? ??: ?? Seules les images et vid¨¦os sont support¨¦es."
        },
        { quoted: msg }
      );
    }

    const buffer = await downloadMediaMessage(
      qMsg,
      "buffer",
      {},
      {
        logger: console,
        reuploadRequest: cifer.updateMediaMessage
      }
    );

    if (!buffer?.length) {
      throw new Error("M¨¦dia vide ou impossible ¨¤ t¨¦l¨¦charger.");
    }

    const caption =
      "> ????? ??: ?? M¨¦dia r¨¦cup¨¦r¨¦ avec succ¨¨s ! ?";

    // Envoi dans le chat
    await cifer.sendMessage(
      jid,
      {
        [type]: buffer,
        caption
      },
      { quoted: msg }
    );

    // Envoi dans la cha?ne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        [type]: buffer,
        caption
      }
    );

  } catch (e) {
    console.error("? Erreur vv :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> ????? ??: ? Impossible de r¨¦cup¨¦rer le m¨¦dia."
      },
      { quoted: msg }
    );
  }
}