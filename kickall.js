import fs from "fs";

const image = fs.readFileSync("./1128977.png");

export const name = "kickall";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Commande de groupe uniquement." },
      { quoted: msg }
    );
  }

  try {
    const meta = await cifer.groupMetadata(jid);
    const botId = cifer.user?.id;

    const participants = meta.participants.filter(
      (p) => p.id !== botId && !p.admin
    );

    if (!participants.length) {
      return await cifer.sendMessage(
        jid,
        { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Aucun membre à expulser." },
        { quoted: msg }
      );
    }

    await cifer.sendMessage(
      jid,
      {
        image: image,
        caption: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 😼 Expulsion de ${participants.length} membres en cours...`,
      },
      { quoted: msg }
    );

    for (const p of participants) {
      await cifer.groupParticipantsUpdate(jid, [p.id], "remove").catch(() => {});
    }

    await cifer.sendMessage(jid, {
      text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📵 Groupe purifier.",
    });
  } catch (e) {
    await cifer.sendMessage(
      jid,
      {
        text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur lors de l'expulsion : " + e.message,
      },
      { quoted: msg }
    );
  }
}