import express from "express";
import relationCtr from "./controller.js";

const router = express.Router();

router.post("/drop", relationCtr.drop);
router.post("/add", relationCtr.add);
router.post("/exampleData", relationCtr.exampleData);

export default router;
