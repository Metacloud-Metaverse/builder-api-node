const dbs = require('../models/index.js')
const sceneModel = dbs.Scene
const apiResponseHandler = require('../helper/ApiResponse.ts')


class SceneController {

    static async saveBuilder(req, res, next) {
        try {
            const data = req.body;
            data.user_id = req.user.user_id;
            if (!data.title || data.title === null || !(isNaN(data.title))) {
                const message = "Title field required is either empty or null or not string"
                apiResponseHandler.sendError(req, res, "data", null, message)
            } else if (!data.data) {
                const message = "Data field required is either empty or null"
                apiResponseHandler.sendError(req, res, "data", null, message)
            } else {
                if (!data.scene_id) {
                    await sceneModel.create(data, "Scene created successfully");
                    apiResponseHandler.send(req, res, "data", data, "Scene saved successfully")
                } else {
                    let isSceneExist = await SceneController.sceneExist(data.scene_id)
                    if (!isSceneExist) {
                        apiResponseHandler.sendError(req, res, "data", null, "No scene exist with given scene_id");
                    } else {
                        const result = isSceneExist.toJSON();
                        if (result.user_id == req.user.user_id) {
                            await sceneModel.update(data, { where: { id: data.scene_id } });
                            apiResponseHandler.send(req, res, "data", data, "Scene updated successfully")
                        } else {
                            apiResponseHandler.sendError(req, res, "data", null, "You do not have permissions to edit this scene.");
                        }
                    }
                }
            }
        } catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error saving this scene. Please try again with correct data.");
        }
    }

    static async listMeScene(req, res, next) {
        try {
            //get scenes form list for current user
            let isSceneExist = await SceneController.sceneExistListMe(req.user.user_id)
            if (!isSceneExist) {
                const err = "error";
            } else {
                const result = isSceneExist;
                if (Array.isArray(result) && result.length) {
                    apiResponseHandler.send(req, res, "data", result, "List all scene data for curren user successfully")
                } else {
                    apiResponseHandler.send(req, res, "data", null, "No Data found for current user")
                }
            }
        }
        catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error fetching scene. Please try again with correct data.")
        }
    }
    static async getSceneById(req, res, next) {
        try {
            const scene_id = req.params.id;
            let isSceneExist = await SceneController.sceneExist(scene_id)
            if (!isSceneExist) {
                apiResponseHandler.sendError(req, res, "data", null, "No scene exist with given scene_id");
            } else {
                const result = isSceneExist;
                if (result.user_id == req.user.user_id) {
                    apiResponseHandler.send(req, res, "data", result, "Scene fetched by scene Id successfully")
                } else {
                    apiResponseHandler.sendError(req, res, "data", null, "You do not have permissions to fetch this scene.");
                }
            }
        }
        catch (error) {
            apiResponseHandler.sendError(req, res, "data", null, "Error fetching scene. Please try again with correct data.")
        }
    }
    static async sceneExist(id) {
        return sceneModel.findOne({ where: { id: id } })
    }
    static async sceneExistListMe(id) {
        return sceneModel.findAll({ where: { user_id: id } })
    }
}
module.exports = SceneController;