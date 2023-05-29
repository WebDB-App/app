import express from "express";
import columnCtrl from "./controller.js";

const router = express.Router();

router.post("/drop", columnCtrl.drop);
router.post("/add", columnCtrl.add);
router.post("/modify", columnCtrl.modify);

export default router;
