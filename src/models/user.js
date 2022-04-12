'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    wallet_address: {
      type: DataTypes.STRING,
      allowNull: true
    },
    guest_private_secret: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: true, 
    },
    type: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: 1
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
    timestamps: false,
    modelName: 'User',
  });
  return User;
};