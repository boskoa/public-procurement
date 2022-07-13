const User = require('./user')
const Procedure = require('./procedure')
const Requirement = require('./requirement')
const ContractingAuthority = require('./contractingAuthority')
const Notification = require('./notification')

User.hasMany(Procedure)
Procedure.belongsTo(User)
Procedure.hasMany(Requirement)
Requirement.belongsTo(Procedure)
ContractingAuthority.hasMany(Procedure)
Procedure.belongsTo(ContractingAuthority)
User.hasMany(Notification)
Notification.belongsTo(User)
Notification.belongsTo(Procedure)
Procedure.hasMany(Notification)

module.exports = { User, Procedure, ContractingAuthority, Requirement, Notification }