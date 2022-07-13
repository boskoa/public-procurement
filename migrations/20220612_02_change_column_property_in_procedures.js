const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'category', {
      type: DataTypes.STRING,
      allowNull: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'category', {
      type: DataTypes.STRING,
      allowNull: false
    })
  }
}
