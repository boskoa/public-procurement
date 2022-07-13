const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'avatar', {
      type: DataTypes.STRING,
      defaultValue: '../../static/user_avatar.png'
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'avatar')
  }
}
