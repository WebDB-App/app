import express from "express";
import viewCtrl from "./controller.js";

const router = express.Router();

router.post("/drop", viewCtrl.drop);
router.post("/create", viewCtrl.create);
router.post("/getCode", viewCtrl.getCode);

export default router;
