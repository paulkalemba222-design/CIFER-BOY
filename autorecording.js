export const name = "autorecording";

let autoRecording = false;

export function isAutoRecording() {
  return autoRecording;
}

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!args[0] || !["on", "off"].includes(args[0])) {
    return await cifer.sendMessage(jid, {
      text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🎙️ Autorecording est ${
        autoRecording ? "activé" : "désactivé"
      }\nUsage : .autorecording <on/off>`,
    }, { quoted: msg });
  }

  autoRecording = args[0] === "on";

  await cifer.sendMessage(jid, {
    text: `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🎙️ Autorecording ${
      autoRecording ? "activé ✅" : "désactivé ❌"
    }`,
  }, { quoted: msg });
}