import { statusProtections } from "../protections.js";

export const name = "antispam";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: AntiSpam est ${
        statusProtections.antiSpam ? "actif" : "inactif"
      }\nUsage : .antispam <on/off>`,
    }, { quoted: msg });
  }

  statusProtections.antiSpam = args[0] === "on";

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-spam ${
      args[0] === "on" ? "actif ✅" : "inactif ❌"
    } !`,
  }, { quoted: msg });
}