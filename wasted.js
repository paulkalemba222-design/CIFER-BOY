import axios from "axios";

export const name = "wasted";

export async function execute(cifer, msg, args, from) {
  const jid = from || msg.key.remoteJid;

  try {
    const isGroup = jid.endsWith("@g.us");

    const mentioned =
      msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;

    const participant =
      msg.message?.extendedTextMessage?.contextInfo?.participant;

    const userToWaste =
      mentioned?.length
        ? mentioned[0]
        : participant || null;

    if (!userToWaste) {
      return await cifer.sendMessage(
        jid,
        {
          text: "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ⚠️ Mentionne quelqu'un ou réponds à son message pour utiliser .wasted"
        },
        { quoted: msg }
      );
    }

    let profilePic;

    try {
      profilePic = await cifer.profilePictureUrl(
        userToWaste,
        "image"
      );
    } catch {
      profilePic = "https://i.imgur.com/2wzGhpF.jpeg";
    }

    const apiUrl =
      `https://some-random-api.com/canvas/overlay/wasted?avatar=` +
      encodeURIComponent(profilePic);

    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer"
    });

    await cifer.sendMessage(
      jid,
      {
        image: Buffer.from(response.data),
        caption:
          `⚰️ *Wasted* : ${userToWaste.split("@")[0]} 💀\n\n` +
          `Repose en paix…`
      },
      { quoted: msg }
    );

    if (isGroup) {
      try {
        await cifer.groupParticipantsUpdate(
          jid,
          [userToWaste],
          "remove"
        );

        await cifer.sendMessage(jid, {
          text: `🚨 ${userToWaste.split("@")[0]} a été expulsé du groupe !`
        });
      } catch {}
    }

  } catch (e) {
    console.error("❌ Erreur wasted :", e);

    await cifer.sendMessage(
      jid,
      {
        text:
          "> 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗: ❌ Impossible de créer l'image Wasted. Réessayez plus tard."
      },
      { quoted: msg }
    );
  }
}