const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { SECRET } = require('../utils/config')
const User = require('../models/user')

router.post('/', async (req, res, next) => {
  try {
    if (req.body.username === '' || req.body.password === '') {
      return res.status(401).json({ error: 'No credentials entered' })
    }
    const user = await User.findOne({
      where: {
        username: req.body.username
      }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    const passwordCorrect = user === null
      ? false
      : await bcrypt.compare(req.body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
      return res.status(401).json({
        error: 'Invalid username or password'
      })
    }

    const userForToken = {
      username: user.username,
      id: user.id
    }

    const token = jwt.sign(userForToken, SECRET)
    return res.status(200).send({
      token,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      id: user.id,
      admin: user.admin
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router