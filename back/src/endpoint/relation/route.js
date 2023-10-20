const express = require("express");
const relationCtr = require("./controller.js");

const router = express.Router();

router.post("/drop", relationCtr.drop);
router.post("/add", relationCtr.add);
router.post("/exampleData", relationCtr.exampleData);

module.exports = router;
