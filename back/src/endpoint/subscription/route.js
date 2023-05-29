import express from "express";
import subscriptionCtrl from "./controller.js";

const router = express.Router();

router.post("/save", subscriptionCtrl.save.bind(subscriptionCtrl));
router.post("/list", subscriptionCtrl.list.bind(subscriptionCtrl));

export default router;
