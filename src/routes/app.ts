const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const sceneController = require("../controllers/SceneController.ts");

router.post('/builder/save', auth, sceneController.saveBuilder)
router.get('/scene/list-me', auth, sceneController.listMeScene)

module.exports = router;
