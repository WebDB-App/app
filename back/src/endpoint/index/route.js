const express = require("express");
const indexCtrl = require("./controller.js");

const router = express.Router();

router.post("/drop", indexCtrl.drop);
router.post("/add", indexCtrl.add);

module.exports = router;
