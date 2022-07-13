const router = require('express').Router()
const { Requirement, Procedure } = require('../models')

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

router.get('/:id', async (req, res, next) => {
  try {
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

router.post('/', async (req, res, next) => {
  try {
    const requirement = await Requirement.create({ ...req.body })
    res.json(requirement)
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const requirementToChange = await Requirement.findByPk(req.params.id)
    requirementToChange.set({ ...req.body })
    await requirementToChange.save()
    res.json(requirementToChange)
  } catch (error) {
    next(error)
  }
})

router.delete('/:id', async (req, res, next) => {
  try {
    await Requirement.destroy({ where: { id: req.params.id } })
    res.status(200).end()
  } catch (error) {
    next(error)
  }
})

module.exports = router