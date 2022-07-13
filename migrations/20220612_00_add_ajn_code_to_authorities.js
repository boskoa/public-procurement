const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('contracting_authorities', 'ajn_code', {
      type: DataTypes.INTEGER,
      unique: true
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('contracting_authorities', 'ajn_code')
  }
}
