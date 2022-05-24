const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const sceneController = require("../controllers/SceneController.ts");
const assetController = require("../controllers/AssetController.ts");

router.post('/builder/save', auth, sceneController.saveBuilder)
router.get('/scene/list-me', auth, sceneController.listMeScene)
router.get('/asset-pack/save', auth, assetController.saveAssetPack)
router.get('/asset/save', assetController.saveAsset)

module.exports = router;
