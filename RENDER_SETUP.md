# Déploiement Render – Cifer MD

Le dépôt est préparé pour un Render Web Service.

## Configuration Render
- Build Command: `npm install`
- Start Command: `npm start`
- Runtime: Node
- Node: 20+

Le script `npm start` lance `worker/index.js` depuis le dossier `worker`, afin que ses chemins relatifs (`commands/`, `sudo.json`, etc.) restent corrects.

## Variables d’environnement
Ajoute dans Render les variables nécessaires, notamment `TELEGRAM_BOT_TOKEN`.
Ne mets jamais les secrets dans le ZIP ou dans GitHub.

Les fichiers de l’API Vercel (`api/`) et `vercel.json` sont conservés.
