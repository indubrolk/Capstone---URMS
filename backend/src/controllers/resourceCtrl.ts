import { Request, Response } from "express";
import db from "../db/db";

// GET all resources
export const getResources = async (req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM resources");
  res.json(rows);
};

// ADD resource
export const addResource = async (req: Request, res: Response) => {
  const { name, type, capacity, location, availability_status } = req.body;

  await db.query(
    "INSERT INTO resources (name, type, capacity, location, availability_status) VALUES (?, ?, ?, ?, ?)",
    [name, type, capacity, location, availability_status]
  );

  res.json({ message: "Resource added" });
};

// UPDATE resource
export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, capacity, location, availability_status } = req.body;

  await db.query(
    "UPDATE resources SET name=?, type=?, capacity=?, location=?, availability_status=? WHERE id=?",
    [name, type, capacity, location, availability_status, id]
  );

  res.json({ message: "Updated" });
};

// DELETE resource
export const deleteResource = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.query("DELETE FROM resources WHERE id=?", [id]);

  res.json({ message: "Deleted" });
};