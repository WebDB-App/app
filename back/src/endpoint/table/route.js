const express = require("express");
const tableCtrl = require("./controller.js");

const router = express.Router();

router.post("/drop", tableCtrl.drop);
router.post("/dropView", tableCtrl.dropView);
router.post("/rename", tableCtrl.rename);
router.post("/truncate", tableCtrl.truncate);
router.post("/create", tableCtrl.create);
router.post("/createView", tableCtrl.createView);
router.post("/stats", tableCtrl.stats);
router.post("/duplicate", tableCtrl.duplicate);

module.exports = router;
