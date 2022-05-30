'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class asset_pack_item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  asset_pack_item.init({
    section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
      }
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true,
      }
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn('now')
    },
  }, {
    sequelize,
    modelName: 'asset_pack_item',
    timestamps: false
  });
  return asset_pack_item;
};