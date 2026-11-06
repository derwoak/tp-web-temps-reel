import { JsonDB, Config } from "node-json-db";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
};

export interface Product {
  id: number;
  name: string;
  stock: number;
};

export type Status = "preparing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: number;
  userId: User["id"];
  productId: Product["id"];
  quantity: number;
  status: Status;
  createdAt: string;
};

export const db = new JsonDB(new Config("data/db", true, true, "/"));
