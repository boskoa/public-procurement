const router = require('express').Router()
const { Notification, Procedure, User, ContractingAuthority } = require('../models')
const { Op } = require('sequelize')
const tokenExtractor = require('../utils/tokenExtractor')

router.get('/', tokenExtractor, async (req, res, next) => {
  let where = { userId: req.decodedToken.id }
  let order = []

  if (req.query.orderC) {
    order = [
      [req.query.orderC, req.query.orderO]
    ]
  }

  if (req.query.search) {
    where = { text: { [Op.substring]: req.query.search } }
  }

  try {
    const notifications = await Notification.findAll({
      where,
      order,
      include: [
        {
          model: Procedure,
          attributes: ['name', 'id'],
          include: [
            { model: ContractingAuthority, attributes: ['name', 'id'] }
          ]
        }
      ]
    })
    res.json(notifications)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const notification = await Notification.findByPk(req.params.id, {
      include: [
        { model: Procedure, attributes: ['name', 'id'] },
        { model: User, attributes: ['name'] }
      ]
    })
    if (notification) {
      res.json(notification)
    } else {
      res.json({ error: 'No such notification' })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const notification = await Notification.create({
      ...req.body, userId: req.decodedToken.id
    })
    res.json(notification)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const notificationToChange = await Notification.findByPk(req.params.id,{
      include: [
        {
          model: Procedure,
          attributes: ['name'],
          include: [
            { model: ContractingAuthority, attributes: ['name'] }
          ]
        }
      ]
    })

    if (!user.admin && req.decodedToken.id !== notificationToChange.userId) {
      res.status(401).json({ error: 'You are not authorized for this action.' })
    }

    notificationToChange.set({ ...req.body })
    await notificationToChange.save()
    res.json(notificationToChange)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const notificationToDelete = await Notification.findByPk(req.params.id)

    if (!user.admin && req.decodedToken.id !== notificationToDelete.userId) {
      res.status(401).json({ error: 'You are not authorized for this action.' })
    }

    await notificationToDelete.destroy()
    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router