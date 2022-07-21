const router = require('express').Router()
const { Requirement, Procedure, User } = require('../models')
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
      procedureId: req.query.search
    }
  }

  try {
    const requirements = await Requirement.findAll({
      where,
      order
    })
    res.json(requirements)
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

    const requirement = await Requirement.findByPk(req.params.id, {
      include: {
        model: Procedure, attributes: ['name']
      }
    })
    if (requirement) {
      res.json(requirement)
    } else {
      res.json({ error: 'No such requirement' })
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

    const requirement = await Requirement.create({ ...req.body })
    res.json(requirement)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const requirementToChange = await Requirement.findByPk(req.params.id)
    requirementToChange.set({ ...req.body })
    await requirementToChange.save()
    res.json(requirementToChange)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    await Requirement.destroy({ where: { id: req.params.id } })
    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router