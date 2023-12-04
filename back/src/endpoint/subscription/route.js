import express from "express";
import subscriptionCtrl from "./controller.js";

const router = express.Router();

router.post("/parse", subscriptionCtrl.parseFromApi.bind(subscriptionCtrl));

export default router;
