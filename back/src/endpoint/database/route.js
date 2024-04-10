import express from "express";
import databaseCtrl from "./controller.js";

const router = express.Router();

router.post("/create", databaseCtrl.create);
router.post("/drop", databaseCtrl.drop);
router.post("/duplicate", databaseCtrl.duplicate);
router.post("/availableCollations", databaseCtrl.getAvailableCollations);
router.post("/setCollations", databaseCtrl.setCollation);

export default router;
