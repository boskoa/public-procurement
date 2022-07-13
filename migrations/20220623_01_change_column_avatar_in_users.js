const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'avatar', {
      type: DataTypes.STRING,
      defaultValue: 'public/data/uploads/user_avatar'
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.changeColumn('users', 'avatar', {
      type: DataTypes.STRING,
      defaultValue: '../../static/user_avatar.png'
    })
  }
}
