import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import normalizeData from "../utils/normalizeData.js";
import { fileMap, labelKeyMap } from "../config/dashboardMappings.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.get("/", async (req, res) => {
  const { query_key } = req.query;
  const fileName = fileMap[query_key]; // deciding which data file
  const labelKey = labelKeyMap[query_key]; //getting actual key inside data set

  if (!fileName || !labelKey) {
    return res.status(400).json({ error: "Invalid query_key" });
  }

  try {
    const filePath = path.join(__dirname, "..", "data", fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    // The data file is already structured to match the frontend component expectations.
    const normalized = normalizeData(query_key, data, labelKey);
    res.json(normalized);
  } catch (error) {
    console.error("Error loading data:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
});

export default router;
