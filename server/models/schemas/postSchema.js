const mongoose = require('mongoose')

const { Schema } = mongoose

const PostSchema = new Schema({
  type: String,
  thought: String,
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

module.exports = { PostSchema }
