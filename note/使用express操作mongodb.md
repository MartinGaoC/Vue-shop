1.在server里创建一个models文件夹 提供api的地方
  里面有一个goods.js文件夹
  let mongoose = require('mongoose')
  let Schema = mongoose.Schema
  let productSchema = new Schema({
    "productId": String,
    "productName": String,
    "salePrice": Number,
    "productImage": String,
  })

  module.exports = mongose.model("Goods",productSchema)


安装mongoose 模块

cnpm i mongoose -D

路由

根目录的app.js

添加代码
var goods = require('./routes/goods');
app.use('/goods', goods);


跨域问题
