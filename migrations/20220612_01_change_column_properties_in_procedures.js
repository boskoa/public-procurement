const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'framework_agreement', {
      type: DataTypes.BOOLEAN,
      allowNull: true
    })
    await queryInterface.changeColumn('procedures', 'criterion', {
      type: DataTypes.STRING,
      allowNull: true
    })
    await queryInterface.changeColumn('procedures', 'auction', {
      type: DataTypes.BOOLEAN,
      allowNull: true
    })
    await queryInterface.changeColumn('procedures', 'submission_date', {
      type: DataTypes.DATE,
      allowNull: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'framework_agreement', {
      type: DataTypes.BOOLEAN,
      allowNull: false
    })
    await queryInterface.changeColumn('procedures', 'criterion', {
      type: DataTypes.STRING,
      allowNull: false
    })
    await queryInterface.changeColumn('procedures', 'auction', {
      type: DataTypes.BOOLEAN,
      allowNull: false
    })
    await queryInterface.changeColumn('procedures', 'submission_date', {
      type: DataTypes.DATE,
      allowNull: false
    })
  }
}
