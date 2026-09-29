import { downloadMediaMessage } from "@whiskeysockets/baileys";

export const name = "save";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const selfJid = cifer.user?.id;

    if (!selfJid) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ JID du bot introuvable."
        },
        { quoted: msg }
      );
    }

    const quotedMessage =
      msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;

    const rawMsg = quotedMessage || msg.message;

    if (!rawMsg) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds à un média ou à un texte."
        },
        { quoted: msg }
      );
    }

    const type = Object.keys(rawMsg)[0];

    // =========================
    // TEXTE
    // =========================
    if (
      type === "conversation" ||
      type === "extendedTextMessage"
    ) {
      const text =
        rawMsg.conversation ||
        rawMsg.extendedTextMessage?.text ||
        "Message vide";

      const savedText = `╭━━━〔 💾 𝗦𝗔𝗨𝗩𝗘𝗚𝗔𝗥𝗗𝗘 〕━━━╮
┃
┃ ${text}
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

      // Privé du bot
      await cifer.sendMessage(selfJid, {
        text: savedText
      });

      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 💾 Texte sauvegardé ✅"
        },
        { quoted: msg }
      );
    }

    // =========================
    // MÉDIAS
    // =========================
    const supportedTypes = [
      "imageMessage",
      "videoMessage",
      "audioMessage",
      "stickerMessage",
      "documentMessage"
    ];

    if (!supportedTypes.includes(type)) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Type de média non supporté."
        },
        { quoted: msg }
      );
    }

    const buffer = await downloadMediaMessage(
      { message: rawMsg },
      "buffer",
      {},
      {
       