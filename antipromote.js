import { statusProtections } from "../protections.js";

export const name = "antipromote";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-promote est ${
        statusProtections.antiPromote ? "actif" : "inactif"
      }\nUsage : .antipromote <on/off>`,
    }, { quoted: msg });
  }

  statusProtections.antiPromote = args[0] === "on";

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-promote ${
      args[0] === "on" ? "actif ✅" : "inactif ❌"
    } !`,
  }, { quoted: msg });
}