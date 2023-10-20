const express = require("express");
const subscriptionCtrl = require("./controller.js");

const router = express.Router();

router.post("/save", subscriptionCtrl.save.bind(subscriptionCtrl));
router.post("/list", subscriptionCtrl.list.bind(subscriptionCtrl));

module.exports = router;
