import { statusProtections } from "../protections.js";

export const name = "antibot";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Anti-bot ${
          statusProtections.antiBot ? "activé" : "désactivé"
        }\nUsage : .antibot <on/off>`,
      },
      { quoted: msg }
    );
  }

  statusProtections.antiBot = args[0] === "on";

  await cifer.sendMessage(
    jid,
    {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: AntiBot ${
        args[0] === "on" ? "activé ✅" : "désactivé ❌"
      } !`,
    },
    { quoted: msg }
  );
}