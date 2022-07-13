const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('notifications', 'alarm', {
      type: DataTypes.STRING
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('notifications', 'alarm', {
      type: DataTypes.DATE
    })
  }
}
