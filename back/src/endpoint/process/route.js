const express = require("express");
const processCtrl = require("./controller.js");

const router = express.Router();

router.post("/list", processCtrl.list);
router.post("/kill", processCtrl.kill);

module.exports = router;
