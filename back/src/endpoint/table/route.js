import express from "express";
import tableCtrl from "./controller.js";

const router = express.Router();

router.post("/ddl", tableCtrl.ddl);
router.post("/drop", tableCtrl.drop);
router.post("/rename", tableCtrl.rename);
router.post("/truncate", tableCtrl.truncate);
router.post("/create", tableCtrl.create);
router.post("/duplicate", tableCtrl.duplicate);

export default router;
