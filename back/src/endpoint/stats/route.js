import express from "express";
import statsCtrl from "./controller.js";

const router = express.Router();

router.post("/dbSize", statsCtrl.dbSize);
router.post("/tableSize", statsCtrl.tableSize);
router.post("/server", statsCtrl.server);

export default router;
