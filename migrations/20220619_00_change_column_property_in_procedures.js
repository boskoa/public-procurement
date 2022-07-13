const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'category', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    })
    await queryInterface.changeColumn('procedures', 'criterion', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    })
    await queryInterface.changeColumn('procedures', 'submission_date', {
      type: DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.changeColumn('procedures', 'budget', {
      type: DataTypes.FLOAT,
      defaultValue: 0.00
    })
    await queryInterface.changeColumn('procedures', 'delivery_location', {
      type: DataTypes.STRING,
      defaultValue: ''
    })
    await queryInterface.changeColumn('procedures', 'delivery_date', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    })
    await queryInterface.changeColumn('procedures', 'payment', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    })
    await queryInterface.changeColumn('procedures', 'offer_validity', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    })
    await queryInterface.changeColumn('procedures', 'copy', {
      type: DataTypes.INTEGER,
      defaultValue: 0
    })
    await queryInterface.changeColumn('procedures', 'amount', {
      type: DataTypes.FLOAT,
      defaultValue: 0.00
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'category', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('procedures', 'criterion', {
      type: DataTypes.STRING,
      allowNull: true,
    })
    await queryInterface.changeColumn('procedures', 'submission_date', {
      type: DataTypes.DATE,
      allowNull: true,
    })
    await queryInterface.changeColumn('procedures', 'budget', {
      type: DataTypes.FLOAT,
    })
    await queryInterface.changeColumn('procedures', 'delivery_location', {
      type: DataTypes.STRING,
    })
    await queryInterface.changeColumn('procedures', 'delivery_date', {
      type: DataTypes.INTEGER,
    })
    await queryInterface.changeColumn('procedures', 'payment', {
      type: DataTypes.INTEGER,
    })
    await queryInterface.changeColumn('procedures', 'offer_validity', {
      type: DataTypes.INTEGER,
    })
    await queryInterface.changeColumn('procedures', 'copy', {
      type: DataTypes.INTEGER,
    })
    await queryInterface.changeColumn('procedures', 'amount', {
      type: DataTypes.FLOAT,
    })
  }
}
