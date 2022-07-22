const router = require('express').Router()
const multer = require('multer')
const { User } = require('../models')
const tokenExtractor = require('../utils/tokenExtractor')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/data/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.toLowerCase().split(' ').join('_'))
  }
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 512000 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'image/png'
      || file.mimetype === 'image/jpg'
      || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error('Only .png, .jpg and .jpeg formats are allowed.'))
    }
  }
})

router.post('/', tokenExtractor, upload.single('file'), async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)

    if (user.disabled) {
      return res.status(401).json({ error: 'Account disabled' })
    }

    user.set({ avatar: req.file.path })
    await user.save()

    if (req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/png') {
      return res.status(401).json({ error: 'Not a proper image type. Use jpg or png.' })
    }
    return res.status(200).send({ path: req.file.path })
  } catch (error) {
    res.status(401).json({ error })
    next(error)
  }
})

router.get('/remove/:id', tokenExtractor, async (req, res, next) => {
  try {
    const userAdmin = await User.findByPk(req.decodedToken.id)
    const user = await User.findByPk(req.params.id)

    if (!userAdmin.admin) {
      res.status(401).json({ error: 'You are not authorized for this action.' })
    }

    user.set({ avatar: 'public/data/uploads/user_avatar' })
    await user.save()
    res.send({ path: user.avatar })
  } catch (error) {
    next(error)
  }
})

module.exports = router