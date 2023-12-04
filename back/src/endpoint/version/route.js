import express from "express";
import versionCtr from "./controller.js";

const router = express.Router();

router.post("/list", versionCtr.list);
router.post("/reset", versionCtr.reset);

export default router;
