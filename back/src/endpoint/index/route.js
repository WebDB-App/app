import express from "express";
import indexCtrl from "./controller.js";

const router = express.Router();

router.post("/drop", indexCtrl.drop);
router.post("/add", indexCtrl.add);

export default router;
