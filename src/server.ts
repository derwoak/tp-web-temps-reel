import express from "express";
import cors from "cors";
import { db, type Order, type Product, type Status } from "./db.js";

const PORT = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/orders", async (req, res) => {
  const { userId, productId, quantity } = req.body ?? {};

  if ((await db.getIndex("/users", userId)) === -1) {
    res.status(404).json({ error: "Client introuvable" });
    return;
  }

  const products = await db.getObject<Product[]>("/products");
  const product = products.find((p) => p.id === productId);

  if (!product) {
    res.status(404).json({ error: "Produit introuvable" });
    return;
  }

  if (product.stock < quantity) {
    res.status(400).json({ error: `Stock insuffisant (disponible : ${product.stock})` });
    return;
  }

  const orders = await db.getObjectDefault<Order[]>("/orders", []);
  const order: Order = {
    id: orders.length + 1,
    userId,
    productId,
    quantity,
    status: "preparing",
    createdAt: new Date().toISOString(),
  };

  product.stock -= quantity;
  await db.push("/products", products);
  await db.push("/orders[]", order);

  res.status(201).json(order);
});

app.patch("/orders/:id/status", async (req, res) => {
  const orders = await db.getObject<Order[]>("/orders");
  const order = orders.find((o) => o.id === Number(req.params.id));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  let next: Status | undefined;
  if (order.status === "preparing") {
    next = "shipped";
  } else if (order.status === "shipped") {
    next = "delivered";
  }

  if (!next) {
    res.status(400).json({ error: `Une commande « ${order.status} » ne peut plus changer de statut` });
    return;
  }

  order.status = next;
  await db.push("/orders", orders);

  res.json(order);
});

app.post("/orders/:id/cancel", async (req, res) => {
  const orders = await db.getObject<Order[]>("/orders");
  const order = orders.find((o) => o.id === Number(req.params.id));

  if (!order) {
    res.status(404).json({ error: "Commande introuvable" });
    return;
  }

  if (order.status !== "preparing") {
    res.status(400).json({ error: "La commande ne peut plus être annulée" });
    return;
  }

  const products = await db.getObject<Product[]>("/products");
  const product = products.find((p) => p.id === order.productId)!;

  product.stock += order.quantity;
  order.status = "cancelled";

  await db.push("/products", products);
  await db.push("/orders", orders);

  res.json(order);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});