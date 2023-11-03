const express = require("express");
const databaseCtrl = require("./controller.js");

const router = express.Router();

router.post("/query", databaseCtrl.query);
router.post("/querySize", databaseCtrl.querySize);
router.post("/create", databaseCtrl.create);
router.post("/drop", databaseCtrl.drop);
router.post("/duplicate", databaseCtrl.duplicate);
router.post("/sample", databaseCtrl.sample);
router.post("/availableCollations", databaseCtrl.getAvailableCollations);
router.post("/setCollations", databaseCtrl.setCollation);

module.exports = router;
