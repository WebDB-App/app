const express = require("express");
const statsCtrl = require("./controller.js");

const router = express.Router();

router.post("/dbSize", statsCtrl.dbSize);
router.post("/tableSize", statsCtrl.tableSize);
router.post("/server", statsCtrl.server);

module.exports = router;
