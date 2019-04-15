const mongoose = require('mongoose')
const { PostSchema } = require('./schemas/postSchema')
const { Schema } = mongoose

const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  recomedations: [PostSchema]
})

module.exports = mongoose.model('user', UserSchema)
