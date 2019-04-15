const jwt = require('jsonwebtoken')
const User = require('../models/user')
const authenticate = async (req, res, done) => {
  const token = req.headers.authorization

  let id = null
  try {
    id = jwt.verify(token, process.env.SECRET_KEY).id
  } catch (e) {
    return res.status(401).send(e.message)
  }
  let user = await User.findById(id)
  req.user = user
  done()
}

module.exports = { authenticate }
