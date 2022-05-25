const dbs = require('../models/index.js')
const assetPackModel = dbs.asset_pack
const assetModel = dbs.Asset
const apiResponseHandler = require('../helper/ApiResponse.ts')


class AssetController {

    static async saveAssetPack(req, res, next) {
        try {
            const data = req.body
            data.user_id = req.user.user_id
            if (await AssetController.checkRequiredAssetPack(req, res, data) && await AssetController.checkValidation(req, res, data)) {
                await assetPackModel.create(data);
                apiResponseHandler.send(req, res, "data", data, "Asset Pack saved successfully")
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    } static async saveAsset(req, res, next) {
        try {
            const data = req.body;
            if (await AssetController.checkRequiredAsset(req, res, data) && await AssetController.checkValidationAsset(req, res, data)) {
                await assetModel.create(data);
                apiResponseHandler.send(req, res, "data", data, "Asset saved successfully")
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset. Please try again with correct data.");
        }
    }


    static async getAssetPackbyUser(req, res, next) {
        try {
            //get Asset Pack form list for current user
            let isAssetPackExist = await AssetController.assetPackExistForUser(req.user.user_id)
            if (!isAssetPackExist) {
                apiResponseHandler.send(req, res, "data", null, "No Data found for current user")
            } else {
                const result = isAssetPackExist;
                if (Array.isArray(result) && result.length) {
                    let a = result.length;
                    const assets = []
                    for (let i = 0; i < a; i++) {
                        const asset = await AssetController.getAssetsByArray(result[i].assets)
                        result[i].assets = asset
                    }
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
    static async getAssetsByArray(assetArray) {
        return assetModel.findAll({ where: { id: assetArray } })
    }
    static async checkRequiredAssetPack(req, res, data) {
        if (!data.name || data.name === null || !(isNaN(data.name))) {
            const message = "Name field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (!data.image || data.image === null || !(isNaN(data.image))) {
            const message = "Image field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (!data.assets || data.assets === null || !(Array.isArray(data.assets))) {
            const message = "Assets field required is either empty or null or not array"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkRequiredAsset(req, res, data) {
        if (!data.name || data.name === null || !(isNaN(data.name))) {
            const message = "Name field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (!data.url || data.url === null || !(isNaN(data.url))) {
            const message = "Url field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (!data.tags || data.tags === null || !(Array.isArray(data.tags))) {
            const message = "Tags field required is either empty or null or not array"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkValidation(req, res, data) {
        if (!this.validURL(data.image)) {
            const message = "Image field value is not valid URL"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkValidationAsset(req, res, data) {
        if (!this.validURL(data.url)) {
            const message = "URL field value is not valid URL"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static validURL(url) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return !!pattern.test(url);
    }
}
module.exports = AssetController;