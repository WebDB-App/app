const express = require("express");
const tunnelCtrl = require("./controller.js");

const router = express.Router();

router.post("/test", tunnelCtrl.test.bind(tunnelCtrl));
//gerer en front

module.exports = router;
