const express = require("express");
const versionCtr = require("./controller.js");

const router = express.Router();

router.post("/list", versionCtr.list);
router.post("/reset", versionCtr.reset);

module.exports = router;
