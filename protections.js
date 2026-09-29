import chalk from "chalk";
import dotenv from "dotenv";
dotenv.config();

export const statusProtections = {
  antiLink: false,
  antiPromote: false,
  antiDemote: false,
  antiBot: false,
  antiSpam: false,
  autoLikeStatus: true,
  warnAdmin: false,
};

const SPAM_LIMIT = 4;
const TIME_LIMIT_MS = 5000;
const messageHistory = {};

const blockedLinks = [
  "chat.whatsapp.com",
  "bit.ly",
  "t.me",
];

async function isBotAdmin(cifer, groupId) {
  try {
    const meta = await cifer.groupMetadata(groupId);
    const botId = cifer.user?.id;

    const bot = meta.participants.find((p) => p.id === botId);

    return bot?.admin != null;
  } catch {
    return false;
  }
}

export function antiLink(cifer) {
  cifer.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiLink) return;

    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text ||
      msg.message.imageMessage?.caption ||
      msg.message.videoMessage?.caption;

    if (!text) return;

    try {
      if (!from?.endsWith("@g.us")) return;

      const meta = await cifer.groupMetadata(from);
      const senderInfo = meta.participants.find(
        (p) => p.id === sender
      );

      if (senderInfo?.admin) return;

      for (const link of blockedLinks) {
        if (text.includes(link)) {
          await cifer.sendMessage(from, {
            text:
              `╭═════۞ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 ۞═════╮\n` +
              `🌘 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 🖤\n` +
              `╰═════۞════════════╯\n\n` +
              `╭═══🛡️ ANTI-LINK 🛡️═══╮\n` +
              `│ ⚠️ @${sender.split("@")[0]}, les liens sont interdits !\n` +
              `╰════════════════════╯\n\n` +
              `> Dev CIFER`,
            mentions: [sender],
          });

          await cifer.sendMessage(from, {
            delete: msg.key,
          });

          const isAdmin = await isBotAdmin(cifer, from);

          if (isAdmin) {
            await cifer.groupParticipantsUpdate(
              from,
              [sender],
              "remove"
            );
          }

          console.log(
            chalk.yellow(
              `[ANTI-LINK] Message supprimé de ${sender} dans ${from}`
            )
          );

          return;
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log("[WARN]", e?.message ?? e);
      }
    }
  });
}

export function antiPromote(cifer) {
  cifer.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiPromote) return;
    if (update.action !== "promote") return;

    const groupId = update.id;

    try {
      const isAdmin = await isBotAdmin(cifer, groupId);

      for (const p of update.participants) {
        await cifer.groupParticipantsUpdate(
          groupId,
          [p],
          "demote"
        );

        if (isAdmin) {
          await cifer.groupParticipantsUpdate(
            groupId,
            [p],
            "remove"
          );
        }

        console.log(
          chalk.yellow(
            `[ANTI-PROMOTE] ${p} rétrogradé${
              isAdmin ? " et expulsé" : " non expulsé"
            } dans ${groupId}`
          )
        );
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log("[WARN]", e?.message ?? e);
      }
    }
  });
}

export function antiDemote(cifer) {
  cifer.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiDemote) return;
    if (update.action !== "demote") return;

    const groupId = update.id;

    try {
      const isAdmin = await isBotAdmin(cifer, groupId);

      for (const p of update.participants) {
        await cifer.groupParticipantsUpdate(
          groupId,
          [p],
          "promote"
        );

        if (isAdmin) {
          await cifer.groupParticipantsUpdate(
            groupId,
            [p],
            "remove"
          );
        }

        console.log(
          chalk.yellow(
            `[ANTI-DEMOTE] ${p} re-promu${
              isAdmin ? " et expulsé" : " non expulsé"
            } dans ${groupId}`
          )
        );
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log("[WARN]", e?.message ?? e);
      }
    }
  });
}

export function antiBot(cifer) {
  const selfNumber = process.env.NUMBER;

  cifer.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.antiBot) return;

    if (update.action === "add") {
      try {
        const isAdmin = await isBotAdmin(cifer, update.id);

        for (const p of update.participants) {
          if (p.includes("bot")) {
            await cifer.groupParticipantsUpdate(
              update.id,
              [p],
              "remove"
            );

            console.log(
              chalk.red(
                `[ANTI-BOT] Bot ${p} expulsé${
                  isAdmin ? "" : " non expulsé"
                } dans ${update.id}`
              )
            );
          }
        }
      } catch (e) {
        if (!String(e).includes("Bad MAC")) {
          console.log("[WARN]", e?.message ?? e);
        }
      }
    }
  });

  cifer.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiBot) return;

    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;

    if (!from?.endsWith("@g.us")) return;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (!text) return;

    const botChars = [
      "'",
      '"',
      ":",
      ";",
      "!",
      "?",
      "/",
      ")",
      "(",
      "+",
      "-",
      "&",
      "_",
      "€",
      "#",
      ",",
      ".",
    ];

    if (!botChars.some((c) => text.startsWith(c))) return;

    try {
      const meta = await cifer.groupMetadata(from);

      const sender =
        msg.key.participant || from;

      const senderInfo = meta.participants.find(
        (p) => p.id === sender
      );

      const isSelf = sender === selfNumber;

      if (
        senderInfo?.admin ||
        isSelf ||
        msg.key.fromMe
      ) {
        return;
      }

      const isAdmin = await isBotAdmin(cifer, from);

      await cifer.sendMessage(from, {
        delete: msg.key,
      });

      if (isAdmin) {
        await cifer.groupParticipantsUpdate(
          from,
          [sender],
          "remove"
        );

        await cifer.sendMessage(from, {
          text:
            `> CIFER MD : ⚠️ @${sender.split("@")[0]} ` +
            `a été expulsé.`,
          mentions: [sender],
        });
      } else {
        await cifer.sendMessage(from, {
          text:
            `> CIFER MD : ⚠️ Message non autorisé ` +
            `détecté ! @${sender.split("@")[0]}.`,
          mentions: [sender],
        });
      }

      console.log(
        chalk.red(
          `[ANTI-BOT] Message de ${sender} dans ${from} - ` +
          `${isAdmin ? "utilisateur expulsé" : "bot non-admin"}`
        )
      );
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log("[WARN]", e?.message ?? e);
      }
    }
  });
}

export function antiSpam(cifer) {
  const selfNumber = process.env.NUMBER;

  cifer.ev.on("messages.upsert", async ({ messages }) => {
    if (!statusProtections.antiSpam) return;

    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const sender = msg.key.participant || from;

    const timestamp =
      Number(msg.messageTimestamp || 0) * 1000;

    if (!from?.endsWith("@g.us")) return;

    try {
      const meta = await cifer.groupMetadata(from);

      const senderInfo = meta.participants.find(
        (p) => p.id === sender
      );

      const isSelf = sender === selfNumber;

      if (
        senderInfo?.admin ||
        isSelf ||
        msg.key.fromMe
      ) {
        return;
      }

      if (!messageHistory[sender]) {
        messageHistory[sender] = [];
      }

      messageHistory[sender].unshift({
        key: msg.key,
        timestamp,
      });

      if (
        messageHistory[sender].length >
        SPAM_LIMIT
      ) {
        messageHistory[sender].pop();
      }

      if (
        messageHistory[sender].length ===
        SPAM_LIMIT
      ) {
        const newest =
          messageHistory[sender][0].timestamp;

        const oldest =
          messageHistory[sender][
            SPAM_LIMIT - 1
          ].timestamp;

        const diff = newest - oldest;

        if (diff <= TIME_LIMIT_MS) {
          const keys = messageHistory[sender].map(
            (m) => m.key
          );

          await Promise.allSettled(
            keys.map((k) =>
              cifer.sendMessage(from, {
                delete: k,
              })
            )
          );

          messageHistory[sender] = [];

          await cifer.sendMessage(from, {
            text:
              `> CIFER MD : 🚫 Anti-Spam activé. ` +
              `@${sender.split("@")[0]} a envoyé ` +
              `${SPAM_LIMIT} messages en moins de 5 secondes. ` +
              `Ils ont été supprimés.`,
            mentions: [sender],
          });

          console.log(
            chalk.red(
              `[ANTI-SPAM] ${SPAM_LIMIT} messages de ${sender} ` +
              `supprimés dans ${from} (temps: ${diff}ms).`
            )
          );
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log("[WARN]", e?.message ?? e);
      }
    }
  });
}

export function warnAdmin(cifer) {
  cifer.ev.on("group-participants.update", async (update) => {
    if (!statusProtections.warnAdmin) return;

    try {
      const groupId = update.id;

      const meta = await cifer.groupMetadata(groupId);

      if (
        update.action === "promote" ||
        update.action === "demote"
      ) {
        for (const p of update.participants) {
          const tag =
            "@" + p.split("@")[0];

          const msg =
            update.action === "promote"
              ? `👑 ${tag} a été *promu admin* !`
              : `⚠️ ${tag} a été *rétrogradé* !`;

          const text =
            `> ╭═══🖤🐺 ${
              global.BOT_NAME ||
              "⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD"
            } 🐺🖤════╮\n` +
            `⚔️ *ALERTE ADMIN* ⚔️\n` +
            `╰══════════════════════╯\n` +
            `📌 Groupe : *${meta.subject}*\n` +
            `${msg}\n\n` +
            `> ⚛️ Dev by CIFER 🩸`;

          await cifer.sendMessage(groupId, {
            text,
            mentions: [p],
          });
        }
      }
    } catch (e) {
      if (!String(e).includes("Bad MAC")) {
        console.log(
          "[WARN][WARNADMIN]",
          e?.message ?? e
        );
      }
    }
  });
}

export function protectCommand(cifer) {
  cifer.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];

    if (!msg.message) return;

    const from = msg.key.remoteJid;

    const text =
      msg.message.conversation ||
      msg.message.extendedTextMessage?.text;

    if (
      !text ||
      !text.startsWith("!protect")
    ) {
      return;
    }

    const args = text
      .trim()
      .split(/ +/)
      .slice(1);

    if (args.length === 0) {
      const status = Object.entries(
        statusProtections
      )
        .map(
          ([k, v]) =>
            `• ${k}: ${v ? "✅" : "❌"}`
        )
        .join("\n");

      await cifer.sendMessage(from, {
        text:
          `╭═══════〔 🛡️ CIFER MD 🛡️ 〕═══════╮\n` +
          `┃ État de sécurité\n` +
          `╰══════════════════════════════╯\n\n` +
          status,
      });

      return;
    }

    const [toggle, key] = args;

    if (
      !["on", "off"].includes(toggle) ||
      !Object.keys(statusProtections).includes(key)
    ) {
      await cifer.sendMessage(from, {
        text:
          `> CIFER MD : Utilisation :\n` +
          `!protect <on/off> ` +
          `<antiLink|antiPromote|antiDemote|antiBot|antiSpam|autoLikeStatus|warnAdmin>`,
      });

      return;
    }

    statusProtections[key] =
      toggle === "on";

    await cifer.sendMessage(from, {
      text:
        `> CIFER MD : Protection ${key} ` +
        `${
          toggle === "on"
            ? "activée ✅"
            : "désactivée ❌"
        } !`,
    });
  });
}

export function initProtections(cifer) {
  antiLink(cifer);
  antiPromote(cifer);
  antiDemote(cifer);
  antiBot(cifer);
  antiSpam(cifer);
  warnAdmin(cifer);
  protectCommand(cifer);
}