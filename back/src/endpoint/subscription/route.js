const express = require("express");
const subscriptionCtrl = require("./controller.js");

const router = express.Router();

router.post("/parse", subscriptionCtrl.parseFromApi.bind(subscriptionCtrl));

module.exports = router;
