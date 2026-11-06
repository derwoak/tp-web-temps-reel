# TP 1 - Web Temps Réel

Lien du GitHub : https://github.com/derwoak/tp-web-temps-reel

## Routes

`POST /orders` : permet de passer une commande avec le body suivant :
```json
{
  "userId": 1,
  "productId": 1,
  "quantity": 12
}
```
---
`PATCH /orders/:id/status` : permet de passer au status de commande d'après, en suivant cet ordre :

`preparing -> shipped -> delivered`

---
`POST /orders/:id/cencel` : permet d'annuler une commande en préparation

---
`GET /orders/:id` : permet de récupérer une commande