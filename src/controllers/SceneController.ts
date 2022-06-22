const dbs = require('../models/index.js');
const sceneModel = dbs.Scene
const apiResponseHandler = require('../helper/ApiResponse.ts')
const sceneRepository = require('../service/sceneRepository.ts');

class SceneController {

  static async createScene(req, res) {
    try {
      let { title, data, user_id } = req.body;
      user_id = req.user.user_id;

      if (!title || !data) {
        return res.status(409).json({
          statusCode: "FAIL",
          message: "Error saving this scene. Please try again with correct data."
        })
      };

      const sceneCreated = await sceneRepository.createScene({ title, data, user_id });
      const { dataValues: { id } } = sceneCreated;

      return res.status(200).json({
        id,
        title,
        data,
        user_id
      })
    } catch (error) {
      return res.status(500).json({
        statusCode: 'FAIL',
        message: 'Internal Server Error'
      })
    }
  }

  static async editScene(req, res) {
    try {
      const { id } = req.params;
      const { title, data } = req.body;

      const scene = await sceneRepository.findScene(id);

      if (!scene) {
        return res.status(404).json({
          statusCode: 'FAIL',
          message: 'Scene not found'
        })
      }

      await sceneRepository.updateScene({ title, data, id });
      const newSceneUpdated = await sceneRepository.findScene(id);
      const { dataValues: { user_id } } = newSceneUpdated;

      return res.status(200).json({
        id,
        title,
        data,
        user_id
      });
    } catch (error) {
      return res.status(500).json({
        statusCode: 'FAIL',
        message: 'Internal Server Error'
      })
    }
  }

  static async getScenesByUserId(req, res) {
    try {
      const { user_id } = req.user;
      const scenes = await sceneRepository.findScenes(user_id);

      if (!scenes) {
        return res.status(404).json({
          statusCode: 'FAIL',
          message: 'Scenes list not found'
        })
      }

      return res.status(200).json(scenes);
    }
    catch (error) {
      return res.status(500).json({
        statusCode: 'FAIL',
        message: 'Internal Server Error'
      })
    }
  }

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
          const ESCENACREADA = await sceneModel.create(data, "Scene created successfully");
          console.log(ESCENACREADA.dataValues.id)
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