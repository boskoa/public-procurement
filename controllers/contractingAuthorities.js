const router = require('express').Router()
const { ContractingAuthority, User, Procedure } = require('../models')
const { Op } = require('sequelize')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (user?.disabled) {
    return res.status(401).json({ error: 'Account disabled' })
  }

  let where = {}
  let order = []

  if (req.query.orderC) {
    order = [
      ['name', req.query.orderC]
    ]
  }

  if (req.query.search) {
    where = {
      name:{
        [Op.substring]: req.query.search
      }
    }
  }

  try {
    const authorities = await ContractingAuthority.findAll({
      where,
      order
    })
    res.json(authorities)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const authority = await ContractingAuthority.findByPk(req.params.id, {
      include: {
        model: Procedure
      }
    })
    if (authority) {
      res.json(authority)
    } else {
      res.json({ error: 'No such contracting authority' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const authority = await ContractingAuthority.create({ ...req.body })
    res.json(authority)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)

  if (!user.admin) {
    res.status(401).json({ error: 'You are not authorized for this action.' })
  }

  try {
    const authorityToChange = await ContractingAuthority.findByPk(req.params.id)
    authorityToChange.set({ ...req.body })
    await authorityToChange.save()
    res.json(authorityToChange)
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
    const authorityToDelete = await ContractingAuthority.findByPk(req.params.id, {
      include: {
        model: Procedure
      }
    })

    if (!authorityToDelete.procedures[0]) {
      authorityToDelete.destroy({ where: { id: req.params.id } })
      res.status(200).end()
    } else {
      res.status(401).json({
        error: 'There are procedures connected to this authority'
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router