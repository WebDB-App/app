import express from "express";
import databaseCtrl from "./controller.js";

const router = express.Router();

router.post("/query", databaseCtrl.query);
router.post("/querySize", databaseCtrl.querySize);
router.post("/create", databaseCtrl.create);
router.post("/drop", databaseCtrl.drop);
router.post("/rename", databaseCtrl.rename);
router.post("/stats", databaseCtrl.stats);
router.post("/sample", databaseCtrl.sample);
router.post("/availableCollations", databaseCtrl.getAvailableCollations);
router.post("/setCollations", databaseCtrl.setCollation);

export default router;
