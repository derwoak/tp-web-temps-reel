# TP 1 - Web Temps Réel

Lien du GitHub : https://github.com/derwoak/tp-web-temps-reel

## Lancer le projet

```bash
docker compose up --build -d
```

Pour repartir de la base `db.json` du dépôt, il faut effacer le volume :

```bash
docker compose down -v
```

Le serveur démarre sur `http://localhost:3000`.

La page de suivi est accessible sur `http://localhost:3000/index.html?id=1`
où `id` correspond au numéro de la commande.

## Liste des routes de l'API

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