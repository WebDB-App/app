import express from "express";
import databaseCtrl from "./controller.js";

const router = express.Router();

router.post("/run", databaseCtrl.run);
router.post("/size", databaseCtrl.size);

export default router;
