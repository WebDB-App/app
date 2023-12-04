import express from "express";
import tunnelCtrl from "./controller.js";

const router = express.Router();

router.post("/test", tunnelCtrl.test.bind(tunnelCtrl));

export default router;
