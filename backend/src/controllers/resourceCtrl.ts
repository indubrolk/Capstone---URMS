import { Request, Response } from "express";
import db from "../db/db";

// GET all resources
export const getResources = async (req: Request, res: Response) => {
  const [rows] = await db.query("SELECT * FROM resources");
  const formattedRows = (rows as any[]).map(row => ({
    ...row,
    equipment: row.equipment ? JSON.parse(row.equipment) : []
  }));
  res.json({ data: formattedRows });
};

// ADD resource
export const addResource = async (req: Request, res: Response) => {
  const { name, type, capacity, location, availability_status, equipment } = req.body;
  const eqJson = JSON.stringify(equipment || []);

  await db.query(
    "INSERT INTO resources (name, type, capacity, location, availability_status, equipment) VALUES (?, ?, ?, ?, ?, ?)",
    [name, type, capacity, location, availability_status, eqJson]
  );

  res.json({ message: "Resource added" });
};

// UPDATE resource
export const updateResource = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, type, capacity, location, availability_status, equipment } = req.body;
  const eqJson = JSON.stringify(equipment || []);

  await db.query(
    "UPDATE resources SET name=?, type=?, capacity=?, location=?, availability_status=?, equipment=? WHERE id=?",
    [name, type, capacity, location, availability_status, eqJson, id]
  );

  res.json({ message: "Updated" });
};

// DELETE resource
export const deleteResource = async (req: Request, res: Response) => {
  const { id } = req.params;

  await db.query("DELETE FROM resources WHERE id=?", [id]);

  res.json({ message: "Deleted" });
};

// IMPORT multiple resources (Bulk Import)
export const importResources = async (req: Request, res: Response): Promise<void> => {
  try {
    const { resources } = req.body;
    
    if (!resources || !Array.isArray(resources) || resources.length === 0) {
      res.status(400).json({ status: "error", message: "No valid resources array provided" });
      return;
    }

    const values = resources.map((r: any) => [
      r.name,
      r.type || "Lecture Halls",
      r.capacity || "0",
      r.location,
      r.availability_status || "Available",
      JSON.stringify(r.equipment || [])
    ]);

    // Perform a bulk insert
    await db.query(
      "INSERT INTO resources (name, type, capacity, location, availability_status, equipment) VALUES ?",
      [values]
    );

    res.json({ 
      status: "success", 
      message: `${resources.length} resources imported successfully!`,
      count: resources.length 
    });
  } catch (error: any) {
    console.error("Bulk Import Error:", error);
    res.status(500).json({ status: "error", message: "Database insert failed" });
  }
};