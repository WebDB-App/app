const express = require("express");
const serverCtrl = require("./controller.js");

const router = express.Router();

router.post("/list", serverCtrl.list);
router.post("/kill", serverCtrl.kill);

module.exports = router;
