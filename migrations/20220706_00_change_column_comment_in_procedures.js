const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'comment', {
      type: DataTypes.STRING,
      defaultValue: ''
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('procedures', 'comment', {
      type: DataTypes.TEXT
    })
  }
}
