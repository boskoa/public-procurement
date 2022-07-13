const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Notification extends Model {}
Notification.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.TEXT
  },
  alarm: {
    type: DataTypes.STRING
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  procedureId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'procedures',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'notification'
})

module.exports = Notification