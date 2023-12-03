const express = require("express");
const serverCtrl = require("./controller.js");
const multer = require("multer");
const {mkdirSync} = require("fs");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		const path = `/tmp/${req.startTime}/`;
		mkdirSync(path, { recursive: true });
		return cb(null, path);
	},
	filename: function (req, file, callback) {
		callback(null, file.originalname);
	}
});

const router = express.Router();
const upload = multer({storage});

router.get("/scan", serverCtrl.scan);
router.post("/guess", serverCtrl.guess);
router.post("/load", upload.array("files[]", 30), serverCtrl.load);
router.post("/dump", serverCtrl.dump);
router.post("/connect", serverCtrl.connect);
router.post("/structure", serverCtrl.getStructure.bind(serverCtrl));

module.exports = router;
