import { BOT_VERSION } from "../index.js";

export const name = "infos";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const BOT_NAME = "⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD";

  const uptime = process.uptime();
  const h = Math.floor(uptime / 3600);
  const m = Math.floor((uptime % 3600) / 60);
  const s = Math.floor(uptime % 60);
  const uptimeStr = `${h}h ${m}m ${s}s`;

  const usedMem = (process.memoryUsage().rss / 1024 / 1024).toFixed(2);

  let platform = "N/A";

  try {
    const os = await import("os");
    platform = `${os.platform()} ${os.release()}`;
  } catch {}

  const start = Date.now();

  await cifer.sendMessage(
    jid,
    { text: "Prise d'informations..." },
    { quoted: msg }
  ).catch(() => {});

  const latency = Date.now() - start;
  const botJid = (cifer?.user?.id || "Inconnu").split(":")?.[0];

  const text = `╭════۩۞۩════╮
   ${BOT_NAME}
╰════۩۞۩════╯
📱 *Numéro:* ${botJid}
📦 *Version:* ${BOT_VERSION}
⏱️ *Uptime:* ${uptimeStr}
🫩 *Latence:* ${latency} ms
💾 *RAM:* ${usedMem} MB
🖥️ *Système:* ${platform}
🔧 *Node.js:* ${process.version}`;

  await cifer.sendMessage(
    jid,
    { text },
    { quoted: msg }
  ).catch((e) => console.error("infos sendMessage:", e));
}