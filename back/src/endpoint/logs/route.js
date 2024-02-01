import express from "express";
import logsCtrl from "./controller.js";

const router = express.Router();

router.get("/finished", logsCtrl.finished);

export default router;
