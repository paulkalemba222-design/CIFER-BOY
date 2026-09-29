import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "setppg";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Cette commande doit être utilisée dans un groupe."
      },
      { quoted: msg }
    );
  }

  const ctxInfo =
    msg.message?.extendedTextMessage?.contextInfo;

  if (!ctxInfo?.quotedMessage?.imageMessage) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds à une image pour changer la photo de profil du groupe."
      },
      { quoted: msg }
    );
  }

  try {
    const quoted = ctxInfo.quotedMessage.imageMessage;

    const stream = await downloadContentFromMessage(
      quoted,
      "image"
    );

    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      throw new Error("Image vide.");
    }

    // Change réellement la photo du groupe
    await cifer.updateProfilePicture(
      jid,
      buffer
    );

    const successMessage =
      "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🖼️ Photo de profil du groupe mise à jour avec succès ! ✅";

    // Confirmation dans le groupe
    await cifer.sendMessage(
      jid,
      {
        text: successMessage
      },
      { quoted: msg }
    );

    // Confirmation dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text: successMessage
      }
    );

  } catch (e) {
    console.error("❌ Erreur setppg :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de changer la photo de profil du groupe.\n> " +
          (e?.message || "Erreur inconnue")
      },
      { quoted: msg }
    );
  }
}