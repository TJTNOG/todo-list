// 載入 express 並建構應用程式伺服器
const express = require("express");
const mongoose = require("mongoose"); // 載入mongoose
const exphbs = require('express-handlebars')
const bodyParser = require("body-parser");

const Todo = require('./models/todo')

const app = express();

// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// 設定連線到 mongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}); 

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs'}))
app.set('view engine', 'hbs')

app.use(bodyParser.urlencoded({ extended: true}))

// 設定首頁路由
app.get("/", (req, res) => {
  Todo.find() // 取出 Todo所有資料
    .lean() // 把Mongoose 的 Model物件轉換成乾淨的JS資料陣列
    .then((todos) => res.render("index", { todos })) // 將資料傳給 index 樣板
    .catch((error) => console.error(error));
});

app.get("/todos/new", (req, res) => {
  return res.render("new");
});

app.post("/todos", (req, res) => {
  const name = req.body.name; // 從 req.body 拿出表單裡的 name 資料
  return Todo.create({ name }) // 存入資料庫
    .then(() => res.redirect("/")) // 新增完成後導回首頁
    .catch((error) => console.log(error));
});

app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  return Todo.findById(id)
    .lean()
    .then((todo) => res.render("detail", { todo }))
    .catch((error) => console.log(error));
});
// 設定port 3000
app.listen(3000, () => {
  console.log(`App is running in http://localhost:3000`);
});
