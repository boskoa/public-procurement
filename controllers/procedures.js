const router = require('express').Router()
const { Procedure, User, ContractingAuthority, Requirement, Notification } = require('../models')
const tokenExtractor = require('../utils/tokenExtractor')
const { Op } = require('sequelize')
const { sequelize } = require('../models/user')

router.get('/', async (req, res, next) => {
  let where = {}
  let order = []

  if (req.query.orderC) {
    order = [
      ['name', req.query.orderC]
    ]
  }

  if (req.query.search) {
    where = { name: { [Op.substring]: req.query.search } }
  }

  if (req.query.searchAuthority) {
    where = { contractingAuthorityId: req.query.searchAuthority }
  }

  try {
    const procedures = await Procedure.findAll({
      where,
      order,
      include: [
        { model: User, attributes: ['name', 'avatar', 'id'] },
        { model: ContractingAuthority, attributes: ['name'] }
      ]
    })
    res.json(procedures)
  } catch (error) {
    next(error)
  }
})

router.get('/analysis', async (req, res, next) => {
  try {
    const result = await sequelize.query(
      `SELECT
        procedures.contracting_authority_id,
        contracting_authorities.name,
        contracting_authorities.id,
        contracting_authorities.jib,
        COUNT(procedures.id) AS procedure_count,
        COUNT(procedures.phase) FILTER (WHERE procedures.phase='10 Isporučeno i fakturisano')
          AS success_count,
        SUM(procedures.amount) AS total_amount
        FROM procedures
        JOIN contracting_authorities
          ON procedures.contracting_authority_id = contracting_authorities.id
        GROUP BY
          contracting_authority_id,
          contracting_authorities.name,
          contracting_authorities.id,
          contracting_authorities.jib`,
      {
        type: sequelize.QueryTypes.SELECT
      }
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const procedure = await Procedure.findByPk(req.params.id, {
      include: [
        { model: User , attributes: {
          exclude: ['passwordHash'] }
        },
        { model: ContractingAuthority },
        { model: Requirement, attributes: ['name', 'canDo', 'done'] },
        { model: Notification }
      ]
    })
    if (procedure) {
      res.json(procedure)
    } else {
      res.json({ error: 'No such procedure' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username }
    })

    const authority = await ContractingAuthority.findOne({
      where: { jib: req.body.jib }
    })

    if (!authority) {
      return res.status(401).json({ error: 'No such contracting authority in DB' })
    }

    const procedure = await Procedure.create({
      ...req.body,
      contractingAuthorityId: authority.id,
      userId: user.id
    })

    return res.json(procedure)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const procedureToChange = await Procedure.findByPk(req.params.id, {
      include: [
        { model: User, attributes: {
          exclude: ['passwordHash'] }
        },
        { model: ContractingAuthority },
        { model: Requirement, attributes: ['name', 'canDo', 'done'] },
        { model: Notification }
      ]
    })

    if (!user.admin && req.decodedToken.id !== procedureToChange.userId) {
      res.status(401).json({ error: 'You are not authorized for this action.' })
    }

    procedureToChange.set({ ...req.body })
    await procedureToChange.save()
    res.json(procedureToChange)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user.admin) {
    res.status(401).json({ error: 'You are not authorized for this action.' })
  }
  try {
    const procedureToDelete = await Procedure.findByPk(req.params.id, {
      include: [
        { model: Requirement, attributes: ['id'] },
        { model: Notification, attributes: ['id'] }
      ]
    })

    if (!(procedureToDelete.requirements[0] || procedureToDelete.notifications[0])) {
      procedureToDelete.destroy({ where: { id: req.params.id } }) //doesn't need argument
      res.status(200).end()
    } else {
      res.status(401).json({
        error: 'There are requirements and/or notifications connected to this procedure.'
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router