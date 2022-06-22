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

  static async getSceneById(req, res) {
    try {
      const { id } = req.params;
      const scene = await sceneRepository.findScene(id);

      if (!scene) {
        return res.status(404).json({
          statusCode: 'FAIL',
          message: 'Scene not found'
        })
      }

      return res.status(200).json(scene);
    }
    catch (error) {
      return res.status(500).json({
        statusCode: 'FAIL',
        message: 'Internal Server Error'
      })
    }
  }
}
module.exports = SceneController;