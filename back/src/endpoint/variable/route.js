import express from "express";
import variableCtrl from "./controller.js";

const router = express.Router();

router.post("/list", variableCtrl.list);
router.post("/set", variableCtrl.set);

export default router;
