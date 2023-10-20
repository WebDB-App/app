const express = require("express");
const columnCtrl = require("./controller.js");

const router = express.Router();

router.post("/drop", columnCtrl.drop);
router.post("/add", columnCtrl.add);
router.post("/modify", columnCtrl.modify);

module.exports = router;
