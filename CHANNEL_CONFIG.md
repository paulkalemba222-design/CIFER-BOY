# Chaîne utilisée pour les réponses des commandes

URL :
https://whatsapp.com/channel/0029VbDcajz5kg72zq6ETS38

JID configuré :
120363408953987969@newsletter

Fonctionnement :
`.menu` (et les autres commandes) → message temporaire dans la chaîne → transfert dans le groupe → suppression du message temporaire de la chaîne.

La chaîne ne doit donc pas conserver les réponses après leur transfert. Si WhatsApp refuse la suppression du message de chaîne, le transfert peut réussir mais le message source peut rester visible ; le code journalise alors cette situation.
