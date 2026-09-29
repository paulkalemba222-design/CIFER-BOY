export const name = "writetoall";

export async function execute(natsu, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args || !args.length) {
    return await natsu.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Usage : .writetoall <message>" },
      { quoted: msg }
    );
  }

  if (!jid.endsWith("@g.us")) {
    return await natsu.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Cette commande doit être utilisée dans un groupe !" },
      { quoted: msg }
    );
  }

  const textToSend = args.join(" ");

  try {
    const meta = await natsu.groupMetadata(jid);
    const participants = meta.participants.map((p) => p.id);

    for (const p of participants) {
      if (p.includes("bot")) continue;
      await natsu.sendMessage(p, { text: textToSend }).catch(() => {});
    }

    await natsu.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Message envoyé à tous les membres du groupe (${participants.length} membres.)`
      },
      { quoted: msg }
    );
  } catch (e) {
    await natsu.sendMessage(
      jid,
      { text: "❌ Une erreur est survenue lors de l'envoi du message." },
      { quoted: msg }
    );
  }
}