const router = require('express').Router()
const { /*ContractingAuthority, */User, Procedure } = require('../models')
const { Op } = require('sequelize')
const tokenExtractor = require('../utils/tokenExtractor')
const { sequelize } = require('../utils/db')

router.get('/procs-by-month', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const start = new Date(Date.parse(decodeURIComponent(req.query.start)))
    const end = new Date(Date.parse(decodeURIComponent(req.query.end)))

    const procedures = await Procedure.findAll({
      where: { [Op.or]: [
        { created_at: { [Op.gt]: start, [Op.lt]: end } },
        { submission_date: { [Op.gt]: start, [Op.lt]: end } }
      ] },
      attributes: ['id', 'created_at', 'submission_date']
    })
    res.json(procedures)
  } catch (error) {
    next(error)
  }
})

router.get('/procs-by-users', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const start = new Date(req.query.start)
      .toISOString().slice(0, 19).replace('T', ' ').replace('Z', '')
    const end = new Date(req.query.end)
      .toISOString().slice(0, 19).replace('T', ' ').replace('Z', '')

    const result = await sequelize.query(
      `SELECT
        users.name,
        COUNT(procedures.phase) AS total_count,
        COUNT(procedures.phase) FILTER (WHERE procedures.phase='10 Isporučeno i fakturisano')
          AS success_count,
        COUNT(procedures.phase) FILTER (WHERE procedures.phase NOT IN
          ('10 Isporučeno i fakturisano', '11 Ne izlazimo', '12 Nismo prošli'))
          AS active_count,
        COUNT(procedures.phase) FILTER (WHERE procedures.phase IN
          ('11 Ne izlazimo', '12 Nismo prošli'))
          AS unsuccessful_count
        FROM procedures
        JOIN users
          ON procedures.user_id = users.id
        WHERE procedures.created_at >= TIMESTAMP '${start}' AND
          procedures.created_at <= TIMESTAMP '${end}'
        GROUP BY
          users.name`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
})

module.exports = router