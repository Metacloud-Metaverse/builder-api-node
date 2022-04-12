const dbs = require('../models/index.js')
const sceneModel = dbs.Scene
const apiResponseHandler = require('../helper/ApiResponse.ts')


class SceneController {

    static async saveBuilder(req, res, next) {
        try {
            const data = {
                "user_id": req.user.user_id,
                "title": req.body.title,
                "data": req.body.data
            };
            const scene_id = req.body.scene_id;
            if(!scene_id){
                    await sceneModel.create(data, "Scene created successfully");
                    apiResponseHandler.send(req, res, "data", data, "Scene saved successfully")
            }else{
                    let isSceneExist = await SceneController.sceneExist(scene_id)
                    if (!isSceneExist) {
                        const err = "error";
                        apiResponseHandler.sendError(req, res, "data", err, "No scene exist with given scene_id");
                    } else {
                    sceneModel.update(data, { where: { id: scene_id } });
                    apiResponseHandler.send(req, res, "data", data, "Scene updated successfully")
                    }
            }
        } catch (error) {
            next(error);
        }

    }
   
    static async listMeScene(req, res, next) {
        try {
            //get scenes form list for current user
            let isSceneExist = await SceneController.sceneExistListMe(req.user.user_id)
            if (!isSceneExist) {
                const err = "error";
            }else{
                const result = isSceneExist;
                if (Array.isArray(result) && result.length) {
                    apiResponseHandler.send(req, res, "data", result, "List all scene data for curren user successfully")
                } else {
                    apiResponseHandler.send(req, res, "data", result, "No Data found for current user")
                }
            }
        }
        catch (error) {
            next(error)
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