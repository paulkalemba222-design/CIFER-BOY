import { statusProtections } from "../protections.js";

export const name = "antilink";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-link est ${
        statusProtections.antiLink ? "actif" : "inactif"
      }\nUsage : .antilink <on/off>`,
    }, { quoted: msg });
  }

  statusProtections.antiLink = args[0] === "on";

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-link ${
      args[0] === "on" ? "actif ✅" : "inactif ❌"
    } !`,
  }, { quoted: msg });
}