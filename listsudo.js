import { loadSudo } from "../index.js";

export const name = "listsudo";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const list = loadSudo();

  if (!list.length) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📋 Aucun sudo défini." },
      { quoted: msg }
    );
  }

  const text = `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 📋 *Liste Sudo:*
${list.map((n, i) => `${i + 1}. +${n}`).join("\n")}`;

  await cifer.sendMessage(jid, { text }, { quoted: msg });
}