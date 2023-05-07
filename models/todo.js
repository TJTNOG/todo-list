const mongoose = rewuire('mongoose')
const Schema = mongoose.Schema
const todoSchema = new Schema({
  name: {
    type: String, // 資料型別
    required: true // 這是必填欄位
  },
  done: {
    type: Boolean,
  }
})

module.exports = mongoose.model('Todo', 'todoSchema')