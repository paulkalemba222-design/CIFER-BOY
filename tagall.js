import fs from "fs";

export const name = "tagall";

const TAGALL_IMAGE = "./1128977.png";
const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid?.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Commande de groupe uniquement."
      },
      { quoted: msg }
    );
  }

  try {
    if (!fs.existsSync(TAGALL_IMAGE)) {
      return await cifer.sendMessage(
        jid,
        {
          text:
            "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ L'image 1128977.png est introuvable."
        },
        { quoted: msg }
      );
    }

    const meta = await cifer.groupMetadata(jid);

    const mentions = meta.participants.map(
      (p) => p.id
    );

    const members = mentions
      .map((m) => `@${m.split("@")[0]}`)
      .join(" ");

    const extra = args.join(" ");

    const image = fs.readFileSync(TAGALL_IMAGE);

    const text =
      `📢 ${extra ? extra + "\n\n" : ""}${members}`;

    // 🖼️ Image + TAGALL
    await cifer.sendMessage(
      jid,
      {
        image,
        caption: text,
        mentions
      },
      { quoted: msg }
    );

    // 📢 Envoi dans la chaîne
    await cifer.sendMessage(
      CHANNEL_JID,
      {
        image,
        caption: extra
          ? `📢 ${extra}`
          : "📢 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗"
      }
    );

  } catch (e) {
    console.error("❌ Erreur tagall :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur lors du tagall : " +
          (e?.message || "Erreur inconnue")
      },
      { quoted: msg }
    );
  }
}