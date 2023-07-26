import express from "express";
import typeCtr from "./controller.js";

const router = express.Router();

router.post("/drop", typeCtr.drop);
router.post("/add", typeCtr.add);
router.post("/modify", typeCtr.modify);

export default router;
