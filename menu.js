import { BOT_NAME, BOT_VERSION, BOT_DEV } from "../index.js";

export const name = "menu";

const CHANNEL_JID = "120363408953987969@newsletter";
const MENU_IMAGE = "./nsys.png";

export async function execute(cifer, msg, args, from) {
  try {
    const jid = from || msg.key.remoteJid;

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const uptimeStr = `${h}h ${m}m ${s}s`;

    const caption = `
༆𝐂𝐈𝐅𝐄𝐑 𝐌𝐃༆

𝐬𝐚𝐥𝐮𝐭, 𝐣𝐞 𝐬𝐮𝐢𝐬 ${BOT_NAME}

★𝐯𝐨𝐢𝐜𝐢 𝐦𝐞𝐬 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐞𝐬 𝐝𝐢𝐬𝐩𝐨𝐧𝐢𝐛𝐥𝐞𝐬

╭───「𝐔𝐓𝐈𝐋𝐈𝐓𝐘」───╮
> 𝐝𝐞𝐥𝐞𝐭𝐞
> 𝐯𝐯
> 𝐝𝐞𝐯𝐢𝐜𝐞
> 𝐜𝐨𝐮𝐧𝐭𝐫𝐲𝐢𝐧𝐟𝐨𝐬
> 𝐟𝐚𝐧𝐜𝐲
> 𝐢𝐧𝐟𝐨𝐬
> 𝐦𝐞𝐭𝐞𝐨
> 𝐩𝐢𝐧𝐠
> 𝐰𝐡𝐨𝐢𝐬
> 𝐚𝐮𝐭𝐨𝐫𝐞𝐜𝐨𝐫𝐝𝐢𝐧𝐠
> 𝐬𝐞𝐭𝐩𝐩
╰────────────────╯

╭───「𝐒𝐔𝐃𝐎」───╮
> 𝐝𝐞𝐥𝐬𝐮𝐝𝐨
> 𝐥𝐢𝐬𝐭𝐬𝐮𝐝𝐨
> 𝐬𝐞𝐭𝐬𝐮𝐝𝐨
╰────────────────╯

╭───「𝐆𝐑𝐎𝐔𝐏𝐒」───╮
> 𝐚𝐝𝐝
> 𝐝𝐞𝐦𝐨𝐭𝐞
> 𝐝𝐞𝐦𝐨𝐭𝐞𝐚𝐥𝐥
> 𝐠𝐜𝐥𝐢𝐧𝐤
> 𝐢𝐧𝐟𝐨𝐬𝐠𝐫𝐨𝐮𝐩𝐬
> 𝐤𝐢𝐜𝐤 @
> 𝐤𝐢𝐜𝐤𝐚𝐥𝐥
> 𝐥𝐞𝐟𝐭
> 𝐥𝐢𝐬𝐭𝐨𝐧𝐥𝐢𝐧𝐞
> 𝐦𝐮𝐭𝐞
> 𝐮𝐧𝐦𝐮𝐭𝐞
> 𝐦𝐮𝐭𝐞-𝐭𝐢𝐦𝐞
> 𝐩𝐫𝐨𝐦𝐨𝐭𝐞 @
> 𝐩𝐫𝐨𝐦𝐨𝐭𝐞𝐚𝐥𝐥
> 𝐩𝐫𝐢𝐧𝐜𝐢𝐩𝐚𝐥
> 𝐭𝐚𝐠
> 𝐭𝐚𝐠𝐚𝐝𝐦𝐢𝐧
> 𝐭𝐚𝐠𝐚𝐥𝐥
╰────────────────╯

╭───「𝐃𝐎𝐖𝐍𝐋𝐎𝐀𝐃」───╮
> 𝐩𝐥𝐚𝐲
> 𝐭𝐢𝐤𝐭𝐨𝐤
> 𝐭𝐢𝐤𝟐
> 𝐮𝐫𝐥
> 𝐲𝐨𝐮𝐭𝐮𝐛𝐞
╰────────────────╯

╭───「𝐒𝐄𝐂𝐔𝐑𝐈𝐓𝐘」───╮
> 𝐚𝐧𝐭𝐢𝐛𝐨𝐭
> 𝐚𝐧𝐭𝐢𝐝𝐞𝐦𝐨𝐭𝐞
> 𝐚𝐧𝐭𝐢𝐥𝐢𝐧𝐤
> 𝐚𝐧𝐭𝐢𝐩𝐫𝐨𝐦𝐨𝐭𝐞
> 𝐚𝐧𝐭𝐢𝐬𝐩𝐚𝐦
> 𝐰𝐚𝐫𝐧𝐚𝐝𝐦𝐢𝐧
╰────────────────╯

╭───「𝐌𝐄𝐃𝐈𝐀𝐒」───╮
> 𝐩𝐡𝐨𝐭𝐨
> 𝐬𝐚𝐯𝐞
> 𝐬𝐭𝐢𝐜𝐤𝐞𝐫
╰────────────────╯

╭───「𝐅𝐔𝐍」───╮
> 𝐰𝐚𝐬𝐭𝐞𝐝
> 𝐛𝐥𝐮𝐫
╰────────────────╯

╭━━━━━━━━━━━━━━━━╮
┃ ⏱️ 𝐔𝐩𝐭𝐢𝐦𝐞 : ${uptimeStr}
┃ 📦 𝐕𝐞𝐫𝐬𝐢𝐨𝐧 : ${BOT_VERSION}
┃ 👑 𝐃𝐞𝐯 : ${BOT_DEV}
╰━━━━━━━━━━━━━━━━╯

☞𝐁𝐲 𝐂𝐢𝐟𝐞𝐫 𝐨𝐟𝐟𝐢𝐜𝐢𝐞𝐥
`;

    // Menu dans le groupe / chat
    await cifer.sendMessage(
      jid,
      {
        image: { url: MENU_IMAGE },
        caption
      },
      { quoted: msg }
    );

  } catch (e) {
    console.error("❌ Erreur commande menu :", e);

    await cifer.sendMessage(
      from || msg.key.remoteJid,
      {
        text: "> ⚠️ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: Impossible d'afficher le menu."
      }
    );
  }
}