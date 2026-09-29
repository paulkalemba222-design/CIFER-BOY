🤖 𝗖𝗜𝗙𝗘𝗥 𝗠𝗗 - Bot WhatsApp

Bot WhatsApp basé sur "@whiskeysockets/baileys" (https://github.com/WhiskeySockets/Baileys).
Dev by CIFER — Version 1.0

---

⚙️ Installation sur Pterodactyl

1. Créer un serveur

- Type d'œuf (egg) : Node.js
- Version Node : 18, 20, 22 ou 24
- Commande de démarrage : "node index.js"

2. Uploader les fichiers

Upload le contenu de ce zip dans le répertoire racine du serveur.

3. Configurer

- Renomme ".env.example" en ".env"
- Mets ton numéro dans "NUMBER=2250141496944"

4. Installer les dépendances

npm install

5. Démarrer

npm start

---

📱 Connexion WhatsApp

Option 1 — Code Pairing (recommandé, USE_QR=false)

- Au démarrage, un code à 8 chiffres s'affiche dans la console
- Va sur WhatsApp > Appareils liés > Lier un appareil > Entrer le code

Option 2 — QR Code (USE_QR=true)

- Un QR code s'affiche dans la console
- Scanne-le avec WhatsApp

La session est sauvegardée dans "/auth_baileys" — pas besoin de rescanner au redémarrage.

---

📋 Commandes disponibles (préfixe ".")

Commande| Description
".menu"| Menu principal
".ping"| Latence du bot
".infos"| Infos système du bot
".owner"| Contact du propriétaire
".whois @"| Infos d'un utilisateur
".device @"| Appareils liés d'un user
".sticker"| Convertir image/vidéo en sticker
".save"| Sauvegarder un média
".photo"| Sticker → image
".url"| Média → URL (catbox.moe)
".vv"| Révéler un message éphémère
".delete"| Supprimer un message
".add 225xxx"| Ajouter un membre
".kick @"| Expulser un membre
".kickall"| Expulser tous les membres
".promote @"| Promouvoir admin
".demote @"| Rétrograder admin
".promoteall"| Promouvoir tout le monde
".demoteall"| Rétrograder tout le monde
".tagall"| Mentionner tout le monde
".tag <msg>"| Envoyer msg à tous
".tagadmin"| Mentionner les admins
".gclink"| Lien d'invitation du groupe
".infosgroups"| Infos du groupe
".listonline"| Membres en ligne
".mute"| Fermer le groupe
".unmute"| Ouvrir le groupe
".mute-time HH:MM"| Muter le groupe dans X temps
".settimeg HH:MM open/close"| Planifier ouverture/fermeture
".writetoall <msg>"| Envoyer un msg à tous les membres
".purge [n]"| Supprimer n messages
".left"| Faire quitter le bot du groupe
".principal"| Tag le créateur du groupe
".setpp"| Changer la pp du bot
".setppg"| Changer la pp du groupe
".autorecording on/off"| Simuler enregistrement audio
".wasted @"| Effet wasted + expulsion
".setsudo 225xxx"| Ajouter un sudo
".delsudo 225xxx"| Retirer un sudo
".listsudo"| Liste des sudos
".antilink on/off"| Anti-lien dans les groupes
".antispam on/off"| Anti-spam
".antibot on/off"| Anti-bot
".antidemote on/off"| Anti-rétrogradation admin
".antipromote on/off"| Anti-promotion admin
".warnadmin on/off"| Alertes changements admin
".autojoin on/off/status"| Auto-follow newsletters

---

📁 Structure des fichiers

𝗖𝗜𝗙𝗘𝗥 𝗠𝗗/
├── index.js          — Point d'entrée principal
├── protections.js    — Système de protection
├── commands/         — Toutes les commandes
├── auth_baileys/     — Session WhatsApp (auto-créé)
├── temp/             — Fichiers temporaires (auto-créé)
├── sudo.json         — Liste des sudos
├── config.json       — Config utilisateurs (auto-créé)
├── .env              — Variables d'environnement
└── package.json

---

👑 Propriétaires

- CIFER : +2250141496944
- CIFER MD : +2250506420978

📢 Déploiement Telegram

- Telegram : https://t.me/Deploiement_cifer_bot

🌐 Canaux Officiels

- WhatsApp : https://whatsapp.com/channel/0029VbDcajz5kg72zq6ETS38
- WhatsApp 2 : https://whatsapp.com/channel/0029Vb92v2mKAwEnqxURI22g