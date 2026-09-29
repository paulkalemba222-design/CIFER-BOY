
import { addSudo, normalizeNumber } from "../index.js";

export const name = "setsudo";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    const raw = mentioned
      ? mentioned.split("@")[0]
      : args[0];

    const bare = normalizeNumber(raw);

    if (!bare) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Usage : .setsudo @mention ou .setsudo 225xxxxxxxx"
        },
        { quoted: msg }
      );
    }

    const updated = addSudo(bare);

    const sudoMessage = `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ *${bare}* ajouté aux sudo.
> 👑 Sudo actifs : ${updated.join(", ")}`;

    // Confirmation dans le chat
    await cifer.sendMessage(
      jid,
      {
        text: sudoMessage
      },
      { quoted: msg }
    );

    // Confirmation dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        text: sudoMessage
      }
    );

  } catch (e) {
    console.error("❌ Erreur setsudo :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible d'ajouter ce numéro aux sudo.\n> " +
          (e?.message || "Erreur inconnue")
      },
      { quoted: msg }
    );
  }
}