export const name = "add";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Commande de groupe uniquement." },
      { quoted: msg }
    );
  }

  if (!args[0]) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Usage : .add 225xxxxxxxxx" },
      { quoted: msg }
    );
  }

  const number = args[0].replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  try {
    const res = await cifer.groupParticipantsUpdate(
      jid,
      [number],
      "add"
    );

    const status = res?.[0]?.status;

    if (status === 200 || status === "200") {
      await cifer.sendMessage(
        jid,
        {
          text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ @${number.split("@")[0]} a été ajouté.`,
          mentions: [number]
        },
        { quoted: msg }
      );
    } else {
      await cifer.sendMessage(
        jid,
        {
          text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Impossible d'ajouter (code: ${status}). Le numéro doit avoir WhatsApp et la politique de confidentialité doit le permettre.`
        },
        { quoted: msg }
      );
    }
  } catch (e) {
    await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Erreur lors de l'ajout." },
      { quoted: msg }
    );
  }
}