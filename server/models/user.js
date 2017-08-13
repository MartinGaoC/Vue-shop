let mongoose = require('mongoose')
let Schema = mongoose.Schema
let userSchema = new Schema({
  "userId": String,
  "userName": String,
  "userPwd": Number,
  "orderList": Array,
  "cartList": [
    {
      "productId": String,
      "productName": String,
      "salePrice": Number,
      "productNum": String,
      "productImage": String,
      "productUrl": String,
      "checked": String
    }
  ],
  "addressList":Array
})

module.exports = mongoose.model("user",userSchema)
