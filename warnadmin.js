import { statusProtections } from "../protections.js";

export const name = "warnadmin";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(
      jid,
      {
        text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: WarnAdmin est ${
          statusProtections.warnAdmin ? "activé" : "désactivé"
        }\nUsage : .warnadmin <on/off>`
      },
      { quoted: msg }
    );
  }

  statusProtections.warnAdmin = args[0] === "on";

  await cifer.sendMessage(
    jid,
    {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: WarnAdmin ${
        args[0] === "on" ? "activé ✅" : "désactivé ❌"
      } !`
    },
    { quoted: msg }
  );
}