import { statusProtections } from "../protections.js";

export const name = "antidemote";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-demote ${
        statusProtections.antiDemote ? "actif" : "inactif"
      }\nUsage : .antidemote <on/off>`,
    }, { quoted: msg });
  }

  statusProtections.antiDemote = args[0] === "on";

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: AntiDemote ${
      args[0] === "on" ? "actif ✅" : "inactif ❌"
    } !`,
  }, { quoted: msg });
}