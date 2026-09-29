import fs from "fs";
import path from "path";
import { execFile } from "child_process";
import { promisify } from "util";
import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "sticker";

const CHANNEL_JID = "120363408953987969@newsletter";

const execFileAsync = promisify(execFile);

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  let inputPath = null;
  let outputPath = null;

  try {
    const contextInfo =
      msg.message?.extendedTextMessage?.contextInfo;

    const quotedMessage = contextInfo?.quotedMessage;

    let targetMessage = msg;

    if (quotedMessage) {
      targetMessage = {
        key: {
          remoteJid: jid,
          id: contextInfo.stanzaId,
          participant: contextInfo.participant
        },
        message: quotedMessage
      };
    }

    const mediaMsg =
      targetMessage.message?.imageMessage ||
      targetMessage.message?.videoMessage;

    if (!mediaMsg) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds à une image ou une vidéo avec .sticker"
        },
        { quoted: msg }
      );
    }

    const mediaBuffer = await downloadMediaMessage(
      targetMessage,
      "buffer",
      {},
      {
        logger: console,
        reuploadRequest: cifer.updateMediaMessage
      }
    );

    if (!mediaBuffer?.length) {
      throw new Error("Impossible de télécharger le média.");
    }

    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const timestamp = Date.now();

    const isVideo =
      mediaMsg.mimetype?.startsWith("video/");

    inputPath = path.join(
      tempDir,
      `input_${timestamp}.${isVideo ? "mp4" : "jpg"}`
    );

    outputPath = path.join(
      tempDir,
      `sticker_${timestamp}.webp`
    );

    fs.writeFileSync(inputPath, mediaBuffer);

    const ffmpegArgs = isVideo
      ? [
          "-y",
          "-i",
          inputPath,
          "-t",
          "8",
          "-vf",
          "scale=512:512:force_original_aspect_ratio=decrease," +
            "fps=15," +
            "pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0",
          "-c:v",
          "libwebp",
          "-q:v",
          "70",
          "-loop",
          "0",
          "-an",
          outputPath
        ]
      : [
          "-y",
          "-i",
          inputPath,
          "-vf",
          "scale=512:512:force_original_aspect_ratio=decrease," +
            "pad=512:512:(ow-iw)/2:(oh-ih)/2:color=black@0",
          "-c:v",
          "libwebp",
          "-q:v",
          "80",
          "-loop",
          "0",
          outputPath
        ];

    await execFileAsync("ffmpeg", ffmpegArgs);

    if (
      !fs.existsSync(outputPath) ||
      fs.statSync(outputPath).size === 0
    ) {
      throw new Error("Échec de conversion en WebP.");
    }

    const stickerBuffer = fs.readFileSync(outputPath);

    // Sticker dans le groupe/chat
    await cifer.sendMessage(
      jid,
      {
        sticker: stickerBuffer
      },
      { quoted: msg }
    );

    // Sticker dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        sticker: stickerBuffer
      }
    );

    // Nettoyage
    if (fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }

    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

  } catch (e) {
    console.error("❌ Erreur sticker :", e);

    try {
      if (inputPath && fs.existsSync(inputPath)) {
        fs.unlinkSync(inputPath);
      }

      if (outputPath && fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
    } catch {}

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur sticker : " +
          (e?.message || "Erreur inconnue")
      },
      { quoted: msg }
    );
  }
}