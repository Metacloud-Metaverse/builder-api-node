const { Router } = require("express");
const router = Router();
const auth = require("../middleware/auth.ts");
const sceneController = require("../controllers/SceneController.ts");
const assetController = require("../controllers/AssetController.ts");

router.post('/builder/save', auth, sceneController.saveBuilder)
router.get('/scene/list-me', auth, sceneController.listMeScene)
router.post('/asset-pack/save', auth, assetController.saveAssetPack)
router.post('/asset/save', assetController.saveAsset)
router.get('/asset-pack/list-me', auth, assetController.getAssetPackbyUser)

module.exports = router;
