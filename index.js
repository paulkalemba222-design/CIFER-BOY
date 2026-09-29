import {
  makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  DisconnectReason,
  isJidBroadcast,
  proto,
} from "@whiskeysockets/baileys";

import chalk from "chalk";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

import { initProtections } from "./protections.js";

dotenv.config();

// =====================================================
// CONFIGURATION
// =====================================================

const PREFIX = process.env.PREFIXE || ".";
const AUTH_DIR = process.env.DOSSIER_AUTH || "auth_baileys";
const RECONNECT_DELAY =
  parseInt(process.env.RECONNECT_DELAY) || 5000;

const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN;

if (!TELEGRAM_BOT_TOKEN) {
  console.error(
    "❌ TELEGRAM_BOT_TOKEN manquant dans .env"
  );
  process.exit(1);
}

// =====================================================
// INFOS BOT
// =====================================================

export const BOT_NAME =
  "⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD";

export const BOT_VERSION = "1.0";

export const BOT_DEV =
  "⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂";

// =====================================================
// PROPRIETAIRES
// =====================================================

export const OWNER_NUMBERS = [
  "2250141496944",
  "2250141496944",
];

export const OWNER_NAMES = {
  "2250141496944": "cifer",
};

// =====================================================
// CHAÎNES
// =====================================================

export const CHANNELS = {
  whatsapp1:
    "https://whatsapp.com/channel/0029Vb92v2mKAwEnqxURI22g",

  whatsapp2:
    "https://whatsapp.com/channel/0029VbDcajz5kg72zq6ETS38",
};

// =====================================================
// NEWSLETTERS WHATSAPP
// =====================================================

export const NEWSLETTER_IDS = [
  "120363373387302754@newsletter",
  "120363408953987969@newsletter",
  "120363425458450099@newsletter",
  "120363423640959729@newsletter",
];

// =====================================================
// IMAGE
// =====================================================

export const BOT_IMAGE =
  "https://files.catbox.moe/cifer.jpg";

// =====================================================
// LOG
// =====================================================

const log = {
  info: (...a) =>
    console.log("[INFO]", ...a),

  warn: (...a) =>
    console.log("[WARN]", ...a),

  error: (...a) =>
    console.log("[ERROR]", ...a),
};

// =====================================================
// LOGGER BAILEYS
// =====================================================

const silentLogger = {
  level: "silent",

  child: () =>
    silentLogger,

  info: () => {},
  warn: () => {},
  error: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
};

// =====================================================
// SUDO
// =====================================================

const SUDO_FILE = "./sudo.json";

export function loadSudo() {
  if (!fs.existsSync(SUDO_FILE))
    return [];

  try {
    return JSON.parse(
      fs.readFileSync(
        SUDO_FILE,
        "utf-8"
      )
    );
  } catch {
    return [];
  }
}

export function saveSudo(list) {
  fs.writeFileSync(
    SUDO_FILE,
    JSON.stringify(
      list,
      null,
      2
    )
  );
}

export function addSudo(num) {
  const s = new Set(
    loadSudo()
  );

  s.add(num);

  saveSudo([
    ...s
  ]);

  return [
    ...s
  ];
}

export function removeSudo(num) {
  const list =
    loadSudo().filter(
      n => n !== num
    );

  saveSudo(list);

  return list;
}

export function isSudo(num) {
  return loadSudo()
    .includes(num);
}

// =====================================================
// NORMALISATION NUMERO
// =====================================================

export function normalizeJid(jid) {
  if (!jid)
    return null;

  const bare =
    String(jid)
      .trim()
      .split(":")[0];

  return bare.includes("@")
    ? bare
    : bare + "@s.whatsapp.net";
}

export function getBareNumber(jid) {
  if (!jid)
    return "";

  return String(jid)
    .split("@")[0]
    .split(":")[0]
    .replace(
      /[^0-9]/g,
      ""
    );
}

export function normalizeNumber(raw) {
  if (!raw)
    return null;

  const n =
    String(raw)
      .replace(
        /[^0-9]/g,
        ""
      );

  return n.length >= 7
    ? n
    : null;
}

// =====================================================
// MESSAGE
// =====================================================

function pickText(message) {
  if (!message)
    return;

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.buttonsResponseMessage
      ?.selectedButtonId ||
    message.listResponseMessage
      ?.singleSelectReply
      ?.selectedRowId ||
    message.templateButtonReplyMessage
      ?.selectedId ||
    message.interactiveResponseMessage
      ?.text
  );
}

function unwrapMessage(msg) {
  return (
    msg?.viewOnceMessage?.message ||
    msg?.viewOnceMessageV2?.message ||
    msg?.ephemeralMessage?.message ||
    msg?.documentWithCaptionMessage?.message ||
    msg
  );
}

// =====================================================
// TELEGRAM API
// =====================================================

async function telegramRequest(
  method,
  data = {}
) {
  const url =
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;

  const response =
    await fetch(
      url,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body:
          JSON.stringify(data),
      }
    );

  return response.json();
}

// =====================================================
// UTILISATEURS TELEGRAM
// =====================================================

const telegramUsers =
  new Map();

// =====================================================
// ETAT QUESTIONNAIRE
// =====================================================

function getTelegramUser(id) {
  if (!telegramUsers.has(id)) {
    telegramUsers.set(
      id,
      {
        step: 0,
        verified: false,
        subscribed: false,
      }
    );
  }

  return telegramUsers.get(id);
}

// =====================================================
// MENU TELEGRAM
// =====================================================

async function sendTelegramMenu(
  chatId
) {
  await telegramRequest(
    "sendMessage",
    {
      chat_id: chatId,

      text:
        `╔══════════════════════════╗
   ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝗿.𖣂 MD
╚══════════════════════════╝

🤖 Bienvenue dans le panneau de contrôle.

Choisis une commande :`,

      reply_markup: {
        keyboard: [
          [
            {
              text: "📱 /pair",
            },
            {
              text: "🔴 /unpair",
            },
          ],

          [
            {
              text: "ℹ️ /help",
            },
            {
              text: "🏠 /start",
            },
          ],
        ],

        resize_keyboard:
          true,
      },
    }
  );
}

// =====================================================
// QUESTIONNAIRE
// =====================================================

async function startQuestionnaire(
  chatId
) {
  const user =
    getTelegramUser(chatId);

  user.step = 1;
  user.verified = false;
  user.subscribed = false;

  await telegramRequest(
    "sendMessage",
    {
      chat_id: chatId,

      text:
        `🔐 QUESTIONNAIRE D'ACCÈS

Avant d'utiliser ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD, réponds aux questions.

Question 1/3 :

🤖 Es-tu prêt à utiliser le système de pairing WhatsApp ?`,

      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ Oui",
              callback_data:
                "quiz_1_yes",
            },

            {
              text: "❌ Non",
              callback_data:
                "quiz_1_no",
            },
          ],
        ],
      },
    }
  );
}

// =====================================================
// ABONNEMENT
// =====================================================

async function sendSubscription(
  chatId
) {
  const user =
    getTelegramUser(chatId);

  user.step = 4;

  await telegramRequest(
    "sendMessage",
    {
      chat_id: chatId,

      text:
        `📢 DERNIÈRE ÉTAPE

Avant d'accéder au pairing, rejoins nos deux chaînes WhatsApp :

1️⃣ Première chaîne
2️⃣ Deuxième chaîne

Après les avoir rejointes, appuie sur :

👇 « J'ai rejoint les chaînes »`,

      reply_markup: {
        inline_keyboard: [
          [
            {
              text:
                "📢 Chaîne WhatsApp 1",

              url:
                CHANNELS.whatsapp1,
            },
          ],

          [
            {
              text:
                "📢 Chaîne WhatsApp 2",

              url:
                CHANNELS.whatsapp2,
            },
          ],

          [
            {
              text:
                "✅ J'ai rejoint les chaînes",

              callback_data:
                "subscription_done",
            },
          ],
        ],
      },
    }
  );
}

// =====================================================
// CALLBACK TELEGRAM
// =====================================================

async function handleTelegramCallback(
  query
) {
  const chatId =
    query.message.chat.id;

  const data =
    query.data;

  const user =
    getTelegramUser(chatId);

  await telegramRequest(
    "answerCallbackQuery",
    {
      callback_query_id:
        query.id,
    }
  );

  // QUESTION 1
  if (data === "quiz_1_yes") {
    user.step = 2;

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `Question 2/3 :

📱 As-tu WhatsApp installé sur ton téléphone ?`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Oui",
                callback_data:
                  "quiz_2_yes",
              },

              {
                text: "❌ Non",
                callback_data:
                  "quiz_2_no",
              },
            ],
          ],
        },
      }
    );

    return;
  }

  if (data === "quiz_1_no") {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "❌ Accès refusé. Utilise /start lorsque tu es prêt.",
      }
    );

    return;
  }

  // QUESTION 2
  if (data === "quiz_2_yes") {
    user.step = 3;

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `Question 3/3 :

🔐 Comprends-tu que le code reçu servira à lier ton compte WhatsApp au bot ?`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "✅ Oui",
                callback_data:
                  "quiz_3_yes",
              },

              {
                text: "❌ Non",
                callback_data:
                  "quiz_3_no",
              },
            ],
          ],
        },
      }
    );

    return;
  }

  if (data === "quiz_2_no") {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "❌ Tu dois avoir WhatsApp installé pour utiliser /pair.",
      }
    );

    return;
  }

  // QUESTION 3
  if (data === "quiz_3_yes") {
    user.step = 4;

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "✅ Questionnaire terminé !\n\n📢 Il reste une dernière étape.",
      }
    );

    await sendSubscription(
      chatId
    );

    return;
  }

  if (data === "quiz_3_no") {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "❌ Tu dois comprendre le fonctionnement avant de continuer.",
      }
    );

    return;
  }

  // ABONNEMENT
  if (
    data ===
    "subscription_done"
  ) {
    user.subscribed =
      true;

    user.verified =
      true;

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `✅ Accès validé !

🎉 Tu peux maintenant utiliser le panneau ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD.`,

      }
    );

    await sendTelegramMenu(
      chatId
    );
  }
}

// =====================================================
// PAIRING
// =====================================================

let whatsappSocket =
  null;

async function pairWhatsApp(
  chatId,
  number
) {
  if (!whatsappSocket) {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "⏳ Le système WhatsApp démarre. Réessaie dans quelques secondes.",
      }
    );

    return;
  }

  number =
    normalizeNumber(
      number
    );

  if (!number) {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `❌ Numéro invalide.

Exemple :
/pair 2250141496944`,
      }
    );

    return;
  }

  try {
    if (
      whatsappSocket.user
    ) {
      await telegramRequest(
        "sendMessage",
        {
          chat_id: chatId,

          text:
            "⚠️ Un compte WhatsApp est déjà connecté à cette session.",
        }
      );

      return;
    }

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `⏳ Génération du code...

📱 Numéro :
+${number}`,
      }
    );

    const code =
      await whatsappSocket
        .requestPairingCode(
          number
        );

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `╔══════════════════════════╗
     🔑 CODE DE LIAISON
╚══════════════════════════╝

📱 Numéro : +${number}

🔐 CODE :

${code}

━━━━━━━━━━━━━━━━━━━━

WhatsApp →
Appareils liés →
Lier un appareil →
Entrer le code

⚠️ Ne partage pas ce code avec quelqu'un d'autre.`,

        reply_markup: {
          inline_keyboard: [
            [
              {
                text:
                  "🔄 Générer un autre code",

                callback_data:
                  "pair_again",
              },
            ],
          ],
        },
      }
    );
  } catch (error) {
    log.error(
      "Erreur pairing :",
      error?.message
    );

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `❌ Impossible de générer le code.

Erreur :
${error?.message || error}`,
      }
    );
  }
}

// =====================================================
// UNPAIR
// =====================================================

async function unpairWhatsApp(
  chatId
) {
  try {
    if (!fs.existsSync(
      AUTH_DIR
    )) {
      await telegramRequest(
        "sendMessage",
        {
          chat_id: chatId,

          text:
            "ℹ️ Aucune session WhatsApp trouvée.",
        }
      );

      return;
    }

    if (whatsappSocket) {
      try {
        await whatsappSocket.logout();
      } catch {}
    }

    whatsappSocket =
      null;

    fs.rmSync(
      AUTH_DIR,
      {
        recursive: true,
        force: true,
      }
    );

    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          `✅ Session WhatsApp supprimée.

Le compte est maintenant déconnecté.

Tu peux refaire :

/pair 225XXXXXXXXXX`,
      }
    );

    setTimeout(
      startWhatsApp,
      2000
    );
  } catch (error) {
    await telegramRequest(
      "sendMessage",
      {
        chat_id: chatId,

        text:
          "❌ Erreur pendant le unpair : " +
          error?.message,
      }
    );
  }
}

// =====================================================
// HELP
// =====================================================

async function sendHelp(
  chatId
) {
  await telegramRequest(
    "sendMessage",
    {
      chat_id: chatId,

      text:
        `╔══════════════════════════╗
       📚 AIDE CIFER MD
╚══════════════════════════╝

📱 /pair 225XXXXXXXXXX
→ Lier ton WhatsApp

🔴 /unpair
→ Déconnecter la session WhatsApp

🏠 /start
→ Afficher le panneau

ℹ️ /help
→ Afficher cette aide

━━━━━━━━━━━━━━━━━━━━

⚡ ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD
`,
    }
  );
}

// =====================================================
// COMMANDES TELEGRAM
// =====================================================

async function handleTelegramMessage(
  message
) {
  const chatId =
    message.chat?.id;

  if (!chatId)
    return;

  const text =
    message.text || "";

  const user =
    getTelegramUser(chatId);

  // /start
  if (
    text === "/start" ||
    text === "🏠 /start"
  ) {
    if (!user.verified) {
      await startQuestionnaire(
        chatId
      );
    } else {
      await sendTelegramMenu(
        chatId
      );
    }

    return;
  }

  // HELP
  if (
    text === "/help" ||
    text === "ℹ️ /help"
  ) {
    if (!user.verified) {
      await startQuestionnaire(
        chatId
      );

      return;
    }

    await sendHelp(
      chatId
    );

    return;
  }

  // PAIR
  if (
    text.startsWith("/pair") ||
    text === "📱 /pair"
  ) {
    if (!user.verified) {
      await startQuestionnaire(
        chatId
      );

      return;
    }

    const args =
      text
        .trim()
        .split(/\s+/);

    const number =
      args[1];

    if (!number) {
      await telegramRequest(
        "sendMessage",
        {
          chat_id: chatId,

          text:
            `📱 Utilisation :

/pair 225XXXXXXXXXX

Exemple :

/pair 2250141496944`,
        }
      );

      return;
    }

    await pairWhatsApp(
      chatId,
      number
    );

    return;
  }

  // UNPAIR
  if (
    text === "/unpair" ||
    text === "🔴 /unpair"
  ) {
    if (!user.verified) {
      await startQuestionnaire(
        chatId
      );

      return;
    }

    await unpairWhatsApp(
      chatId
    );

    return;
  }

  await telegramRequest(
    "sendMessage",
    {
      chat_id: chatId,

      text:
        "❓ Commande inconnue.\n\nUtilise /help.",
    }
  );
}

// =====================================================
// POLLING TELEGRAM
// =====================================================

let telegramOffset = 0;

async function telegramLoop() {
  try {
    const result =
      await telegramRequest(
        "getUpdates",
        {
          offset:
            telegramOffset,

          timeout: 30,
        }
      );

    if (
      !result?.ok ||
      !Array.isArray(
        result.result
      )
    ) {
      setTimeout(
        telegramLoop,
        1000
      );

      return;
    }

    for (
      const update of result.result
    ) {
      telegramOffset =
        update.update_id + 1;

      if (
        update.callback_query
      ) {
        await handleTelegramCallback(
          update.callback_query
        );

        continue;
      }

      if (
        update.message
      ) {
        await handleTelegramMessage(
          update.message
        );
      }
    }
  } catch (error) {
    log.warn(
      "Telegram : " +
      error?.message
    );
  }

  telegramLoop();
}

// =====================================================
// AUTO FOLLOW NEWSLETTERS
// =====================================================

async function autoFollowNewsletters(
  sock
) {
  for (
    const newsletterId
    of NEWSLETTER_IDS
  ) {
    try {
      if (
        typeof sock.newsletterFollow ===
        "function"
      ) {
        await sock.newsletterFollow(
          newsletterId
        );
      }
    } catch {}
  }
}

// =====================================================
// RÉPONSES DES COMMANDES : TRANSFERT DEPUIS LA CHAÎNE
// =====================================================

const COMMAND_CHANNEL_JID =
  process.env.COMMAND_CHANNEL_JID ||
  "120363408953987969@newsletter";

/*
 * Pour une commande exécutée dans un groupe :
 *
 * .menu
 *   ↓
 * réponse publiée temporairement dans la chaîne
 *   ↓
 * vrai transfert du message de la chaîne vers le groupe
 *   ↓
 * suppression du message source dans la chaîne
 *
 * Le message affiché dans le groupe garde donc l'aspect
 * "Transféré" et l'origine de la chaîne, tandis que la chaîne
 * ne conserve pas la réponse.
 */
function formatCommandResponse(content, commandName = "") {
  if (!content || typeof content !== "object") return content;

  const formatText = (value) => {
    if (typeof value !== "string" || !value.trim()) return value;

    // Les réponses déjà mises en forme par une commande sont conservées.
    if (value.includes("𝗖𝗜𝗙𝗘𝗥 𝗠𝗗") || value.includes("𝐂𝐈𝐅𝐄𝐑 𝐌𝐃")) {
      return value;
    }

    const body = value
      .trim()
      .split("\n")
      .map(line => `┃ ${line}`)
      .join("\n");

    const command = commandName ? ` • .${commandName}` : "";

    return `╭━━━〔 🇨🇮 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 〕━━━╮\n┃\n${body}\n┃\n╰━━━━━━━━━━━━━━━━━━━━╯\n> ✦ 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗${command}`;
  };

  const next = { ...content };
  if (Object.prototype.hasOwnProperty.call(next, "text")) {
    next.text = formatText(next.text);
  }
  if (Object.prototype.hasOwnProperty.call(next, "caption")) {
    next.caption = formatText(next.caption);
  }
  return next;
}

function createCommandSocket(sock, commandName = "") {
  return new Proxy(sock, {
    get(target, prop, receiver) {
      if (prop !== "sendMessage") {
        return Reflect.get(target, prop, receiver);
      }

      return async (jid, content, options = {}) => {
        const isGroup =
          typeof jid === "string" &&
          jid.endsWith("@g.us");

        // Les commandes dans un groupe passent par la chaîne.
        if (isGroup && COMMAND_CHANNEL_JID) {
          let source = null;
          const styledContent = formatCommandResponse(content, commandName);

          try {
            source = await target.sendMessage(
              COMMAND_CHANNEL_JID,
              styledContent
            );

            if (!source?.key) {
              throw new Error(
                "Impossible de récupérer le message source de la chaîne."
              );
            }

            const forwarded = await target.sendMessage(
              jid,
              {
                forward: source,
              },
              options?.quoted
                ? { quoted: options.quoted }
                : {}
            );

            // Nettoyage immédiat : rien ne reste dans la chaîne.
            try {
              await target.sendMessage(
                COMMAND_CHANNEL_JID,
                {
                  delete: source.key,
                }
              );
            } catch (deleteError) {
              log.warn(
                "Message transféré, mais suppression de la source impossible : " +
                (deleteError?.message || deleteError)
              );
            }

            return forwarded;
          } catch (error) {
            log.error(
              "Transfert chaîne → groupe échoué : " +
              (error?.message || error)
            );

            // On ne masque pas l'échec en envoyant une réponse
            // normale : le comportement demandé est le transfert.
            throw error;
          }
        }

        return target.sendMessage(
          jid,
          formatCommandResponse(content, commandName),
          options
        );
      };
    },
  });
}

// =====================================================
// CHARGEMENT COMMANDES
// =====================================================

async function loadCommands() {
  global.commands = {};

  const cmdDir =
    "./commands";

  if (
    !fs.existsSync(
      cmdDir
    )
  ) {
    log.warn(
      "Dossier commands introuvable."
    );

    return;
  }

  const files =
    fs.readdirSync(
      cmdDir
    ).filter(
      f =>
        f.endsWith(".js")
    );

  for (
    const file of files
  ) {
    try {
      const mod =
        await import(
          path.resolve(
            cmdDir,
            file
          )
        );

      const cmd =
        mod.default ??
        mod;

      if (
        cmd?.name &&
        typeof cmd.execute ===
          "function"
      ) {
        global.commands[
          cmd.name
        ] = cmd;

        log.info(
          "Commande chargée : " +
          cmd.name
        );
      }
    } catch (error) {
      log.warn(
        "Erreur commande " +
        file +
        " : " +
        error?.message
      );
    }
  }

  log.info(
    Object.keys(
      global.commands
    ).length +
    " commandes chargées."
  );
}

// =====================================================
// DEMARRAGE WHATSAPP
// =====================================================

async function startWhatsApp() {
  try {
    let version;

    try {
      const res =
        await fetchLatestBaileysVersion();

      version =
        res.version;

      log.info(
        "Baileys : " +
        version.join(".")
      );
    } catch {
      version = [
        2,
        3000,
        1015901307,
      ];
    }

    const {
      state,
      saveCreds,
    } =
      await useMultiFileAuthState(
        AUTH_DIR
      );

    whatsappSocket =
      makeWASocket({
        version,

        logger:
          silentLogger,

        auth: {
          creds:
            state.creds,

          keys:
            makeCacheableSignalKeyStore(
              state.keys,
              silentLogger
            ),
        },

        msgRetryCounterCache:
          new Map(),

        browser: [
          "Ubuntu",
          "Chrome",
          "20.0.04",
        ],

        generateHighQualityLinkPreview:
          true,

        getMessage:
          async key => {
            return proto.Message.fromObject(
              {
                conversation:
                  "",
              }
            );
          },
      });

    whatsappSocket.ev.on(
      "creds.update",
      saveCreds
    );

    // =================================================
    // CONNECTION
    // =================================================

    whatsappSocket.ev.on(
      "connection.update",
      async update => {
        const {
          connection,
          lastDisconnect,
        } = update;

        if (
          connection === "open"
        ) {
          log.info(
            "✅ WhatsApp connecté !"
          );

          try {
            global.owners =
              [
                ...new Set(
                  [
                    ...OWNER_NUMBERS,

                    getBareNumber(
                      whatsappSocket
                        ?.user?.id
                    ),
                  ].filter(Boolean)
                ),
              ];
          } catch {
            global.owners =
              [
                ...OWNER_NUMBERS
              ];
          }

          try {
            initProtections(
              whatsappSocket
            );
          } catch (
            error
          ) {
            log.error(
              "Protections : " +
              error?.message
            );
          }

          await loadCommands();

          await autoFollowNewsletters(
            whatsappSocket
          );

          log.info(
            "🚀 CIFER MD ONLINE"
          );
        }

        if (
          connection === "close"
        ) {
          const reason =
            lastDisconnect
              ?.error
              ?.output
              ?.statusCode;

          log.warn(
            "WhatsApp déconnecté : " +
            reason
          );

          if (
            reason !==
            DisconnectReason.loggedOut
          ) {
            whatsappSocket =
              null;

            setTimeout(
              startWhatsApp,
              RECONNECT_DELAY
            );
          } else {
            whatsappSocket =
              null;

            log.error(
              "Session WhatsApp terminée."
            );
          }
        }
      }
    );

    // =================================================
    // MESSAGES WHATSAPP
    // =================================================

    whatsappSocket.ev.on(
      "messages.upsert",
      async ({
        messages,
      }) => {
        try {
          const msg =
            messages?.[0];

          if (
            !msg?.message
          )
            return;

          const from =
            msg.key
              .remoteJid;

          if (
            !from ||
            isJidBroadcast(
              from
            )
          )
            return;

          const isGroup =
            from.endsWith(
              "@g.us"
            );

          let sender =
            msg.key.fromMe
              ? whatsappSocket
                  .user?.id
              : isGroup
              ? msg.key.participant
              : msg.key.remoteJid;

          if (!sender)
            return;

          const senderNum =
            getBareNumber(
              sender
            );

          const ownersNums =
            (
              global.owners ||
              []
            ).map(
              getBareNumber
            );

          const sudoNums =
            loadSudo().map(
              getBareNumber
            );

          // =================================================
          // COMMANDES RESERVEES OWNER / SUDO
          // =================================================

          if (
            !ownersNums.includes(
              senderNum
            ) &&
            !sudoNums.includes(
              senderNum
            )
          ) {
            return;
          }

          const rawMsg =
            unwrapMessage(
              msg.message
            );

          const body =
            pickText(
              rawMsg
            );

          if (
            !body ||
            !body.startsWith(
              PREFIX
            )
          )
            return;

          const args =
            body
              .slice(
                PREFIX.length
              )
              .trim()
              .split(/\s+/);

          const commandName =
            (
              args.shift() ||
              ""
            ).toLowerCase();

          const command =
            global.commands?.[
              commandName
            ];

          if (!command)
            return;

          try {
            await whatsappSocket.sendMessage(
              from,
              {
                react: {
                  text: "📡",
                  key: msg.key,
                },
              }
            );
          } catch {}

          try {
            const commandSocket = createCommandSocket(whatsappSocket, commandName);

            await command.execute(
              commandSocket,
              msg,
              args,
              from
            );
          } catch (
            error
          ) {
            log.error(
              "Commande " +
              commandName +
              " : " +
              error?.message
            );

            try {
              const errorSocket = createCommandSocket(whatsappSocket, commandName);

              await errorSocket.sendMessage(
                from,
                {
                  text:
                    "⚠️ Erreur lors de l'exécution de la commande.",
                },
                {
                  quoted:
                    msg,
                }
              );
            } catch {}
          }
        } catch (
          error
        ) {
          if (
            error?.message?.includes(
              "Bad MAC"
            ) ||
            error?.message?.includes(
              "decrypt"
            )
          ) {
            return;
          }

          log.warn(
            "messages.upsert : " +
            error?.message
          );
        }
      }
    );
  } catch (
    error
  ) {
    whatsappSocket =
      null;

    log.error(
      "WhatsApp : " +
      error?.message
    );

    setTimeout(
      startWhatsApp,
      RECONNECT_DELAY
    );
  }
}

// =====================================================
// START
// =====================================================

async function main() {
  console.log(`
=============================================
   ⎯͟͟͞͞『»͜͡𝗖𝖎𝖋𝖊𝖗.𖣂 MD
   TELEGRAM + WHATSAPP
=============================================
`);

  await startWhatsApp();

  log.info(
    "🤖 Telegram démarré."
  );

  telegramLoop();
}

main();

// =====================================================
// ERREURS
// =====================================================

process.on(
  "unhandledRejection",
  error => {
    const msg =
      String(error);

    if (
      msg.includes(
        "Bad MAC"
      ) ||
      msg.includes(
        "decrypt"
      ) ||
      msg.includes(
        "No sessions"
      )
    )
      return;

    log.error(
      "Rejection : " +
      msg
    );
  }
);

process.on(
  "uncaughtException",
  error => {
    const msg =
      error?.message ||
      String(error);

    if (
      msg.includes(
        "Bad MAC"
      ) ||
      msg.includes(
        "decrypt"
      ) ||
      msg.includes(
        "No sessions"
      )
    )
      return;

    log.error(
      "Exception : " +
      msg
    );
  }
);