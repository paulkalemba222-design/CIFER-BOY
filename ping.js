export const name = "ping";

const CHANNEL_JID = "120363408953987969@newsletter";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const start = Date.now();

    const sentMsg = await cifer.sendMessage(
      jid,
      { text: "⏳ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 • Test de connexion..." },
      { quoted: msg }
    );

    const latency = Date.now() - start;

    let status = "🟢 EXCELLENT";
    if (latency > 500) status = "🟠 MOYEN";
    if (latency > 1000) status = "🔴 LENT";

    const pingMessage = `╭━━━〔 ⚡ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮
┃
┃   🏎️ *PONG !*
┃
┃   ⚡ Latence : *${latency} ms*
┃   📡 Statut  : *${status}*
┃   🤖 Bot     : *𝗖𝗜𝗙𝗘𝗥 𝗠𝗗*
┃   🔋 Système : *Opérationnel*
┃
╰━━━━━━━━━━━━━━━━━━━━╯`;

    // Réponse dans le chat
    await cifer.sendMessage(
      jid,
      { text: pingMessage },
      { quoted: sentMsg }
    );

  } catch (e) {
    console.error("❌ Erreur ping :", e);

    await cifer.sendMessage(
      jid,
      {
        text: "> ⚠️ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 : Impossible de calculer la vitesse."
      },
      { quoted: msg }
    );
  }
}