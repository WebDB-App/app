import express from "express";
import serverCtrl from "./controller.js";
import multer from "multer";

const router = express.Router();
const upload = multer({dest: "/tmp/"});

router.get("/scan", serverCtrl.scan);
router.post("/guess", serverCtrl.guess);
router.post("/load", upload.single("file"), serverCtrl.load);
router.post("/dump", serverCtrl.dump);
router.post("/connect", serverCtrl.connect);
router.post("/structure", serverCtrl.getStructure.bind(serverCtrl));

export default router;
