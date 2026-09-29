import { downloadContentFromMessage } from "@whiskeysockets/baileys";

export const name = "setpp";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  const ctxInfo =
    msg.message?.extendedTextMessage?.contextInfo;

  if (!ctxInfo?.quotedMessage?.imageMessage) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Réponds à une image pour changer la photo de profil du bot."
      },
      { quoted: msg }
    );
  }

  try {
    const quoted = ctxInfo.quotedMessage.imageMessage;

    const