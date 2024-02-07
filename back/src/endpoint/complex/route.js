import express from "express";
import complexCtrl from "./controller.js";

const router = express.Router();

router.post("/drop", complexCtrl.drop);

export default router;
