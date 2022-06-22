const model = require('../models/index.js');
const scene = model.Scene;

class SceneDBRespository {
  static async createScene({title, data, user_id}) {
    const sceneCreated = await scene.create({title, data, user_id});
    return sceneCreated;
  }

  static async updateScene({title, data, id}) {
    const sceneUpdated = await scene.update({title, data}, { where: { id } });
    return sceneUpdated;
  }

  static async findScene(id) {
    const sceneExist = await scene.findOne({ where: { id } });
    return sceneExist;
  }

  static async findScenes(user_id) {
    const sceneExistListMe = await scene.findAll({ where: { user_id } })
    return sceneExistListMe;
  }
}

module.exports = SceneDBRespository;