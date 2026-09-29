import { downloadContentFromMessage } from "@whiskeysockets/baileys";
import axios from "axios";
import fs from "fs";
import path from "path";
import FormData from "form-data";

export const name = "url";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  let filePath = null;

  try {
    const contextInfo =
      msg.message?.extendedTextMessage?.contextInfo;

    const quoted = contextInfo?.quotedMessage;
    const message = quoted || msg.message;

    let mediaMessage;
    let mediaType;
    let extension;

    if (message?.imageMessage) {
      mediaMessage = message.imageMessage;
      mediaType = "image";
      extension = "jpg";
    } else if (message?.videoMessage) {
      mediaMessage = message.videoMessage;
      mediaType = "video";
      extension = "mp4";
    } else if (message?.audioMessage) {
      mediaMessage = message.audioMessage;
      mediaType = "audio";
      extension = "mp3";
    } else {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds à une image, vidéo ou audio."
        },
        { quoted: msg }
      );
    }

    const stream = await downloadContentFromMessage(
      mediaMessage,
      mediaType
    );

    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    if (!buffer.length) {
      throw new Error("Le média téléchargé est vide.");
    }

    const tempDir = path.join(
      process.cwd(),
      "temp"
    );

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, {
        recursive: true
      });
    }

    filePath = path.join(
      tempDir,
      `media_${Date.now()}.${extension}`
    );

    fs.writeFileSync(filePath, buffer);

    const form = new FormData();

    form.append("reqtype", "fileupload");

    form.append(
      "fileToUpload",
      fs.createReadStream(filePath),
      {
        filename: path.basename(filePath)
      }
    );

    const response = await axios.post(
      "https://catbox.moe/user/api.php",
      form,
      {
        headers: form.getHeaders(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        timeout: 120000
      }
    );

    const url = String(response.data).trim();

    if (!url || !url.startsWith("https://")) {
      throw new Error(
        `Réponse Catbox invalide : ${url}`
      );
    }

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      filePath = null;
    }

    const resultText =
      `╭━━━〔 🔗 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮
┃
┃ ✅ URL générée avec succès !
┃
┃ 📁 Type : ${mediaType}
┃ 🔗 ${url}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    // Dans le chat
    await cifer.sendMessage(
      jid,
      {
        text: resultText
      },
      { quoted: msg }
    );

    // Dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text: resultText
      }
    );

  } catch (e) {
    console.error("❌ Erreur URL :", e);

    try {
      if (
        filePath &&
        fs.existsSync(filePath)
      ) {
        fs.unlinkSync(filePath);
      }
    } catch {}

    await cifer.sendMessage(
      jid,
      {
        text:
          `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Échec de génération de l'URL.\n> ${e?.message || "Erreur inconnue"}`
      },
      { quoted: msg }
    );
  }
}