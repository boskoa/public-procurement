const router = require('express').Router()
const { User, Procedure, Notification, ContractingAuthority } = require('../models')
const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/overview', async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['passwordHash']
      },
      include: [
        { model: Procedure, attributes: ['userId', 'id', 'phase', 'createdAt'] }
      ]
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  let where = {}
  let order = []

  if (req.query.orderC) {
    order = [
      ['name', req.query.orderC]
    ]
  }

  if (req.query.search) {
    where = {
      [Op.or]: [
        { name: {
          [Op.substring]: req.query.search
        } },
        { username: {
          [Op.substring]: req.query.search
        } }
      ]
    }
  }

  if (req.query.admin) {
    where = {
      admin: req.query.admin
    }
  }

  try {
    const users = await User.findAll({
      where,
      order,
      attributes: {
        exclude: ['passwordHash']
      }
    })
    res.json(users)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['passwordHash']
      },
      include: [
        {
          model: Procedure,
          include: [{ model: ContractingAuthority, attributes: ['name'] }]
        },
        { model: Notification }
      ]
    })
    if (user) {
      res.json(user)
    } else {
      res.json({ error: 'No such user' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const user = await User.create({ ...req.body, passwordHash })
    res.json(user)
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' })
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id, {
    attributes: {
      exclude: ['passwordHash']
    }
  })

  if (!user.admin && req.decodedToken.id !== user.id) {
    res.status(401).json({ error: 'You are not authorized for this action.' })
  }

  let newValues = { ...req.body }

  if (newValues.password) {
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    delete newValues.password
    newValues.passwordHash = passwordHash
  }

  try {
    const userToChange = await User.findByPk(req.params.id, {
      attributes: {
        exclude: ['passwordHash']
      }
    })
    userToChange.set({ ...newValues })
    await userToChange.save()
    res.json(userToChange)
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
    const userToDelete = await User.findByPk(req.params.id, {
      include: {
        model: Procedure
      }
    })

    if (!userToDelete.procedures[0]) {
      userToDelete.destroy({ where: { id: req.params.id } })
      res.status(200).end()
    } else {
      res.status(401).json({
        error: 'There are procedures connected to this user.'
      })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router