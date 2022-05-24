const dbs = require('../models/index.js')
const assetPackModel = dbs.asset_pack
const assetModel = dbs.Asset
const apiResponseHandler = require('../helper/ApiResponse.ts')


class AssetController {

    static async saveAssetPack(req, res, next) {
        try {
            const data = req.body;
            data.user_id = req.user.user_id;
            await assetPackModel.create(data, "Asset created successfully");
            apiResponseHandler.send(req, res, "data", data, "Asset saved successfully")

        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    } static async saveAsset(req, res, next) {
        try {
            const data = req.body;
            await assetModel.create(data, "Asset created successfully");
            apiResponseHandler.send(req, res, "data", data, "Asset saved successfully")
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    }

}
module.exports = AssetController;