export const name = "settimeg";

const CHANNEL_JID = "120363408953987969@newsletter";

// Planning en mémoire
const groupSchedules = {};

let schedulerStarted = false;
let lastExecuted = {};

function isValidTime(time) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid?.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Commande de groupe uniquement."
      },
      { quoted: msg }
    );
  }

  if (args.length < 2) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Usage : .settimeg HH:MM <open/close>\n" +
          "> Exemple : .settimeg 08:00 open"
      },
      { quoted: msg }
    );
  }

  const time = args[0];
  const action = args[1].toLowerCase();

  if (!isValidTime(time)) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Heure invalide.\n" +
          "> Utilise le format HH:MM, exemple : 08:00"
      },
      { quoted: msg }
    );
  }

  if (!["open", "close"].includes(action)) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Action doit être 'open' ou 'close'."
      },
      { quoted: msg }
    );
  }

  if (!groupSchedules[jid]) {
    groupSchedules[jid] = [];
  }

  // Évite les doublons
  const exists = groupSchedules[jid].some(
    (task) =>
      task.time === time &&
      task.action === action
  );

  if (exists) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ ${action} est déjà planifié à ${time}.`
      },
      { quoted: msg }
    );
  }

  groupSchedules[jid].push({
    time,
    action
  });

  // =========================
  // SCHEDULER
  // =========================
  if (!schedulerStarted) {
    schedulerStarted = true;

    setInterval(async () => {
      try {
        const now = new Date();

        const currentTime =
          `${String(now.getHours()).padStart(2, "0")}:` +
          `${String(now.getMinutes()).padStart(2, "0")}`;

        const dateKey =
          `${now.getFullYear()}-` +
          `${String(now.getMonth() + 1).padStart(2, "0")}-` +
          `${String(now.getDate()).padStart(2, "0")}`;

        for (const gid of Object.keys(groupSchedules)) {
          const tasks = groupSchedules[gid];

          if (!Array.isArray(tasks)) continue;

          for (const task of tasks) {
            if (task.time !== currentTime) continue;

            const executionKey =
              `${gid}_${dateKey}_${task.time}_${task.action}`;

            // Empêche plusieurs exécutions dans la même minute
            if (lastExecuted[executionKey]) continue;

            lastExecuted[executionKey] = true;

            try {
              if (task.action === "open") {
                await cifer.groupSettingUpdate(
                  gid,
                  "not_announcement"
                );

                const message =
                  "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🟢 Le groupe est maintenant *ouvert* !";

                await cifer.sendMessage(gid, {
                  text: message
                });

                await cifer.sendMessage(CHANNEL_JID, {
                  text:
                    `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🟢 Groupe ouvert automatiquement.\n` +
                    `> 🕐 Heure : ${task.time}`
                });

              } else if (task.action === "close") {
                await cifer.groupSettingUpdate(
                  gid,
                  "announcement"
                );

                const message =
                  "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔴 Le groupe est maintenant *fermé* !";

                await cifer.sendMessage(gid, {
                  text: message
                });

                await cifer.sendMessage(CHANNEL_JID, {
                  text:
                    `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔴 Groupe fermé automatiquement.\n` +
                    `> 🕐 Heure : ${task.time}`
                });
              }

            } catch (e) {
              console.error(
                `❌ Erreur automatique ${gid}:`,
                e
              );
            }
          }
        }
      } catch (e) {
        console.error("❌ Erreur scheduler :", e);
      }
    }, 60 * 1000);
  }

  await cifer.sendMessage(
    jid,
    {
      text:
        `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ✅ Planifié : ${action} à ${time} !\n` +
        `> 🕐 Le bot exécutera automatiquement cette action.`
    },
    { quoted: msg }
  );
}