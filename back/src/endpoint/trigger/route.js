import express from "express";
import triggerCtr from "./controller.js";

const router = express.Router();

router.post("/drop", triggerCtr.drop);
router.post("/replace", triggerCtr.replace);
router.post("/list", triggerCtr.list);

export default router;
