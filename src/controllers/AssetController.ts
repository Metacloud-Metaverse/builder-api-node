const dbs = require('../models/index.js')
const assetPackModel = dbs.asset_pack
const assetPackSectionModel = dbs.asset_pack_section
const assetItemModel = dbs.asset_pack_item
const apiResponseHandler = require('../helper/ApiResponse.ts')


class AssetController {

    static async saveAssetPack(req, res, next) {
        try {
            const data = req.body
            if (await AssetController.checkRequired(req, res, data) && await AssetController.checkValidation(req, res, data)) {
                if (!data.id) {
                    data.user_id = req.user.user_id
                    await assetPackModel.create(data);
                    apiResponseHandler.send(req, res, "data", data, "Asset pack saved successfully")
                } else {
                    let isAssetPackExist = await AssetController.assetPackExist(data.id)
                    if (!isAssetPackExist) {
                        apiResponseHandler.sendError(req, res, "data", null, "No asset pack exist with given Asset Pack id");
                    } else {
                        const result = isAssetPackExist.toJSON();
                        if (result.user_id == req.user.user_id) {
                            await assetPackModel.update(data, { where: { id: data.id } });
                            apiResponseHandler.send(req, res, "data", data, "Asset pack updated successfully")
                        } else {
                            apiResponseHandler.sendError(req, res, "data", null, "You do not have permissions to edit this asset pack.");
                        }
                    }
                }
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset Pack. Please try again with correct data.");
        }
    }
    static async saveAssetPackSection(req, res, next) {
        try {
            const data = req.body
            if (await AssetController.checkRequiredAssetSection(req, res, data) && await AssetController.checkValidation(req, res, data)) {
                    let isAssetPackExist = await AssetController.assetPackExist(data.pack_id)
                    if (isAssetPackExist) {
                    if (!data.id) {
                        data.user_id = req.user.user_id
                        await assetPackSectionModel.create(data);
                        apiResponseHandler.send(req, res, "data", data, "Asset-pack-section saved successfully")
                    } else {
                        const result = isAssetPackExist.toJSON();
                        if (result.user_id == req.user.user_id) {
                            await assetPackSectionModel.update(data, { where: { id: data.id } });
                            apiResponseHandler.send(req, res, "data", data, "Asset-pack-section updated successfully")
                        } else {
                            apiResponseHandler.sendError(req, res, "data", null, "You do not have permissions to edit this Asset-pack-section.");
                        }
                    }
                } else {
                    apiResponseHandler.sendError(req, res, "data", null, "No asset pack exist with given Asset Pack id");
                }
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this Asset pack section. Please try again with correct data.");
        }
    }
    static async saveAssetPackItem(req, res, next) {
        try {
            const data = req.body;
            if (await AssetController.checkRequiredAsset(req, res, data) && await AssetController.checkValidation(req, res, data) && await AssetController.checkValidationAsset(req, res, data)) {
                let isAssetPackSectionExist = await AssetController.assetPackSectionExist(data.section_id)
                if (isAssetPackSectionExist) {
                    if (!data.id) {
                        await assetItemModel.create(data);
                        apiResponseHandler.send(req, res, "data", data, "Asset-pack-item saved successfully")
                    } else {
                        await assetItemModel.update(data, { where: { id: data.id } });
                        apiResponseHandler.send(req, res, "data", data, "Asset-pack-item updated successfully")
                    }
                } else {
                    apiResponseHandler.sendError(req, res, "data", null, "No asset pack section exist with given section_id");
                }
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
                const result = isAssetPackExist
                if (Array.isArray(result) && result.length) {
                    let a = result.length;
                    for (let i = 0; i < a; i++) {
                        const section = await AssetController.assetPackSectionByPackId(result[i].id)
                        if (Array.isArray(section) && section.length) {
                            let b = section.length
                            const sections = []
                            for (let j = 0; j < b; j++) {
                                const assetArray = []
                                const asset = await AssetController.getAssetsBySectionId(section[j].id)
                                if (Array.isArray(asset) && asset.length) {
                                    let c = asset.length
                                    for (let k = 0; k < c; k++) {
                                        asset[k].section = section[j].name
                                        assetArray[k] = asset[k]
                                    }
                                    sections[j] = assetArray
                                } else {
                                    sections[j] = "Asset Item not availble for section_id: " + section[j].id
                                }
                            }
                            result[i].assets = sections
                        } else {
                            result[i].assets = "Asset Section not availble for pack_id: " + result[i].id
                        }
                    }
                    apiResponseHandler.send(req, res, "data", result, "List all Asset Pack for curren user successfully")
                } else {
                    apiResponseHandler.send(req, res, "data", null, "No Data found for current user")
                }
            }
        }
        catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error fetching  Asset packs. Please try again with correct data.");
        }
    }
    static async assetPackExistForUser(user_id) {
        return assetPackModel.findAll({ where: { user_id: user_id }, attributes: ['id', 'user_id', 'name', 'image'], raw: true })
    }
    static async getAssetsBySectionId(section_id) {
        return assetItemModel.findAll({ where: { section_id: section_id }, attributes: ['id', 'name', 'image', 'tags', 'url'], raw: true })
    }
    static async checkRequired(req, res, data) {
        if (!data.name || data.name === null || !(isNaN(data.name))) {
            const message = "Name field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkRequiredAssetSection(req, res, data) {
        if (!data.name || data.name === null || !(isNaN(data.name))) {
            const message = "Name field required is either empty or null or not string"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (!data.pack_id || data.pack_id === null || isNaN(data.pack_id)) {
            const message = "Asset Pack field required is either empty or null or not integer"
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
        } else if (!data.section_id || data.section_id === null || isNaN(data.section_id)) {
            const message = "Section field required is either empty or null or not integer"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkValidation(req, res, data) {
        if (data.image && !this.validImageURL(data.image)) {
            const message = "Image field value is not valid URL"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (data.id && isNaN(data.id)) {
            const message = "Id field is invalid, should be integer"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else {
            return true
        }
    }
    static async checkValidationAsset(req, res, data) {
        if (!this.validURL(data.url)) {
            const message = "URL field value is not valid URL"
            apiResponseHandler.sendError(req, res, "data", null, message)
        } else if (data.tags && (data.tags === null || !(Array.isArray(data.tags)))) {
            const message = "Tags is not valid,should be array"
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
    static validImageURL(url) {
        return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
    }
    static async assetPackExist(id) {
        return assetPackModel.findOne({ where: { id: id } })
    }
    static async assetPackSectionExist(id) {
        return assetPackSectionModel.findOne({ where: { id: id } })
    }
    static async assetPackSectionByPackId(id) {
        return assetPackSectionModel.findAll({
            where: { pack_id: id },
            attributes: ['id', 'name'],
            raw: true
        })
    }
}
module.exports = AssetController;