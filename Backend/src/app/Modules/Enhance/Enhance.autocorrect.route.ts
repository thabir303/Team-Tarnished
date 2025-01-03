import express from "express";
import { EnhanceService } from "./Enhance.autocorrect.service";

const router = express.Router();

router.post("/auto-correct", async (req, res) => {
  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: "Both 'previous_text' and 'last_word' are required." });
  }

  try {
    const result = await EnhanceService.getCorrectedWord(context);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Auto-correction failed." });
  }
});

router.post("/next-word", async (req, res) => {
  const { context } = req.body;

  if (!context) {
    return res.status(400).json({ error: "Context is required." });
  }

  try {
    const result = await EnhanceService.getNextWord(context);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Next-word prediction failed." });
  }
});

export const Enhance = router;