export const name = "mute-time";

const CHANNEL_JID = "120363408953987969@newsletter";
const scheduled = {};

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  if (!jid.endsWith("@g.us")) {
    return await cifer.sendMessage(
      jid,
      { text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Commande de groupe uniquement." },
      { quoted: msg }
    );
  }

  if (!args[0]) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⏰ Usage : .mute-time HH:MM\nExemple : .mute-time 00:05"
      },
      { quoted: msg }
    );
  }

  const match = args[0].match(/^(\d{2}):(\d{2})$/);

  if (!match) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Format invalide. Exemple : .mute-time 00:10"
      },
      { quoted: msg }
    );
  }

  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);

  if (minutes >= 60) {
    return await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Les minutes doivent être comprises entre 00 et 59."
      },
      { quoted: msg }
    );
  }

  const delayMs = (hours * 60 + minutes) * 60 * 1000;

  const text =
    `> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⏰ Le groupe sera muté dans ${args[0]}.`;

  // Annonce dans le groupe
  await cifer.sendMessage(
    jid,
    { text },
    { quoted: msg }
  );

  // Annonce dans la chaîne
  await cifer.sendMessage(
    CHANNEL_JID,
    { text }
  );

  if (scheduled[jid]) {
    clearTimeout(scheduled[jid]);
  }

  scheduled[jid] = setTimeout(async () => {
    try {
      await cifer.groupSettingUpdate(jid, "announcement");

      const finalText =
        "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: 🔴 Le groupe est maintenant *fermé* !";

      // Confirmation dans le groupe
      await cifer.sendMessage(jid, {
        text: finalText
      });

      delete scheduled[jid];

    } catch (e) {
      console.error("Erreur mute-time:", e);
    }
  }, delayMs);
}