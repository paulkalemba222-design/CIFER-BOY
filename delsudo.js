import { removeSudo, normalizeNumber } from "../index.js";

export const name = "delsudo";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;
  const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const raw = mentioned ? mentioned.split("@")[0] : args[0];
  const bare = normalizeNumber(raw);

  if (!bare) {
    return await cifer.sendMessage(
      jid,
      {
        text: "> ????? ??: Usage : .delsudo @mention ou .delsudo 225xxxxxxxx",
      },
      { quoted: msg }
    );
  }

  const updated = removeSudo(bare);

  if (updated !== false) {
    await cifer.sendMessage(
      jid,
      {
        text: `> ????? ??: ?? Le num¨¦ro *${bare}* a ¨¦t¨¦ retir¨¦ des sudo.`,
      },
      { quoted: msg }
    );
  } else {
    await cifer.sendMessage(
      jid,
      {
        text: `> ????? ??: ?? Le num¨¦ro *${bare}* n'¨¦tait pas dans la liste sudo.`,
      },
      { quoted: msg }
    );
  }
}