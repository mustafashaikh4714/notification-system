const User = require('../models/user')
const Post = require('../models/post')
const genToken = require('../utils/genToken')
const { authenticate } = require('../config/auth')
module.exports = app => {
  app.post('/signup', async (req, res) => {
    let { username, email, password } = req.body

    if (!username || !email || !password) {
      return res.status.send({
        success: false,
        message: 'Some fields are missing'
      })
    }

    new User({ username, email, password, recomedations: [] })
      .save()
      .then(async user => {
        if (!user) {
          return res.status.send({
            success: false,
            message: 'database error'
          })
        }
        return res.send({
          success: true,
          message: 'User Created!'
        })
      })
      .catch(err => {
        return res.status(404).send(err.message)
      })
  })
  app.post('/login', async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
      return res.status.send({
        success: false,
        message: 'Some fields are missing'
      })
    }
    const user = await User.findOne({ email, password })
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Credentials aren't Match ?"
      })
    }
    return res.send({
      success: true,
      message: 'Logged in Successfully!',
      token: genToken(user._id)
    })
  })

  // create thought
  app.post('/create/thought', authenticate, async (req, res) => {
    let { type, thought } = req.body

    if (!type || !thought) {
      return res.status.send({
        success: false,
        message: 'Some fields are missing'
      })
    }

    let creator = req.user._id
    new Post({ type, thought, creator })
      .save()
      .then(async post => {
        if (!post) {
          return res.status.send({
            success: false,
            message: 'database error'
          })
        }
        return res.send({ message: 'Done.' })
      })
      .catch(err => res.status(404).send(err.message))
  })

  // create alert!
  app.post('/filter/thoughts', authenticate, async (req, res) => {
    let { type } = req.body

    let id = req.user._id
    const posts = await Post.find({ type })
    const updateUser = await User.findOneAndUpdate(id, {
      $push: {
        recomedations: posts
      }
    })

    if (!updateUser) {
      return res.status(400).send({ message: 'database error' })
    }
    return res.send({
      numberOfResults: posts.length,
      data: posts
    })
  })
  // users thoughts
  app.post('/my/thoughts', authenticate, async (req, res) => {
    let id = req.user._id
    const posts = await Post.find({ creator: id })
    if (posts.length === 0) {
      return res
        .status(400)
        .send({ message: "You didn't create any post yet!" })
    }
    return res.send({
      numberOfResults: posts.length,
      posts
    })
  })
}
