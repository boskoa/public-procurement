const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../utils/db')

class Procedure extends Model {}
Procedure.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  number: {
    type: DataTypes.STRING,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frameworkAgreement: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  criterion: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  auction: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  submissionDate: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: ''
  },
  budget: {
    type: DataTypes.FLOAT,
    defaultValue: 0.00
  },
  deliveryLocation: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  deliveryDate: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  payment: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  offerValidity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  filledDraft: {
    type: DataTypes.BOOLEAN
  },
  copy: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: 0.00
  },
  phase: {
    type: DataTypes.STRING
  },
  comment: {
    type: DataTypes.STRING,
    defaultValue: ''
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  contractingAuthorityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'contractingAuthorities',
      key: 'id'
    }
  }
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  createdAt: true,
  updatedAt: true,
  modelName: 'procedure'
})

module.exports = Procedure