# Déploiement indépendant — Cifer Pairing

## Architecture

- `api/` : API/serverless pour Vercel.
- `public/` : interface web.
- `worker/` : processus Node.js/Baileys à héberger sur un serveur qui reste actif 24/7.

Vercel ne doit pas être utilisé pour maintenir le processus Baileys en permanence.

## Avant GitHub

1. Ne committez jamais `.env`, `auth_baileys/` ou une session WhatsApp.
2. Si un ancien token Telegram a été publié, révoquez-le et créez-en un nouveau.
3. Installez les dépendances du worker sur le serveur permanent avec `npm install`.

## Vercel

Connectez le dépôt GitHub à Vercel et déployez la partie web/API. Vérifiez que les routes API prévues par `vercel.json` répondent correctement.

## Worker

Sur le serveur Node.js permanent :

```bash
cd worker
npm install
npm start
```

Configurez les variables d'environnement depuis `.env.example`.

Le dossier de session doit être persistant sur le serveur afin que WhatsApp puisse conserver son authentification.

## Important

Le code de pairing doit être généré côté worker. Le frontend ne doit jamais contenir de secret WhatsApp ou de token privé.


## Réponses des commandes via la chaîne

Le worker utilise `COMMAND_CHANNEL_JID` comme source temporaire pour les réponses des commandes exécutées dans un groupe :

1. la commande crée sa réponse dans la chaîne ;
2. le vrai message de la chaîne est transféré au groupe ;
3. le message temporaire est supprimé de la chaîne.

Ainsi, la chaîne peut être vide avant la commande et reste vide après le transfert.
