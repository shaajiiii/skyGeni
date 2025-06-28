import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import normalizeData from "../utils/normalizeData.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Maps
const fileMap = {
  industry: "Account Industry.json",
  team: "Team.json",
  customer_type: "Customer Type.json",
  acv_range: "ACV Range.json",
};

const labelKeyMap = {
  industry: "Acct_Industry",
  team: "Team",
  customer_type: "Cust_Type",
  acv_range: "ACV_Range",
};

router.get("/", async (req, res) => {
  const { query_key } = req.query;
  const fileName = fileMap[query_key];
  const labelKey = labelKeyMap[query_key];
  console.log(query_key);

  if (!fileName || !labelKey) {
    return res.status(400).json({ error: "Invalid query_key" });
  }

  try {
    const filePath = path.join(__dirname, "..", "data", fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContent);
    // res.json(data);
    const normalized = normalizeData(query_key, data, labelKey);
    res.json(normalized);
  } catch (error) {
    console.error("Error loading data:", error);
    res.status(500).json({ error: "Failed to load data" });
  }
});

export default router;
