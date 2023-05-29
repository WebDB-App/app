import express from "express";
import tunnelCtrl from "./controller.js";

const router = express.Router();

router.post("/test", tunnelCtrl.test);

export default router;
