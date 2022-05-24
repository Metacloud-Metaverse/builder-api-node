const dbs = require('../models/index.js')
const assetPackModel = dbs.asset_pack
const assetModel = dbs.Asset
const apiResponseHandler = require('../helper/ApiResponse.ts')


class AssetController {

    static async saveAssetPack(req, res, next) {
        try {
            const data = req.body
            data.user_id = req.user.user_id

            await assetPackModel.create(data);
            apiResponseHandler.send(req, res, "data", data, "Asset Pack saved successfully")

        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    } static async saveAsset(req, res, next) {
        try {
            const data = req.body;
            await assetModel.create(data);
            apiResponseHandler.send(req, res, "data", data, "Asset saved successfully")
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    }


    static async getAssetPackbyUser(req, res, next) {
        try {
            //get Asset Pack form list for current user
            let isAssetPackExist = await AssetController.assetPackExistForUser(req.user.user_id)
            if (!isAssetPackExist) {
                const err = "error";
            } else {
                const result = isAssetPackExist;
                if (Array.isArray(result) && result.length) {
                    apiResponseHandler.send(req, res, "data", result, "List all Asset Pack for curren user successfully")
                } else {
                    apiResponseHandler.send(req, res, "data", null, "No Data found for current user")
                }
            }
        }
        catch (error) {
            next(error)
        }
    }

    static async assetPackExistForUser(user_id) {
        return assetPackModel.findAll({ where: { user_id: user_id } })
    }
}
module.exports = AssetController;