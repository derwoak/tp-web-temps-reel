import express from "express";
import cors from "cors";
import { db, type Order, type Product } from "./db.js";

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});