import express from "express";
import columnCtrl from "./controller.js";

const router = express.Router();

router.post("/togetherModels", columnCtrl.togetherModels);
router.post("/sample", columnCtrl.sample);

export default router;
