import express from "express";
import processCtrl from "./controller.js";

const router = express.Router();

router.post("/list", processCtrl.list);
router.post("/kill", processCtrl.kill);

export default router;
