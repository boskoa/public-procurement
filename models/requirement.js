const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Requirement extends Model {}
Requirement.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  canDo: {
    type: DataTypes.BOOLEAN
  },
  done: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  procedureId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'procedures',
      key: 'id'
    }
  }
}, {
  sequelize,
  timestamps: false,
  underscored: true,
  modelName: 'requirement'
})

module.exports = Requirement