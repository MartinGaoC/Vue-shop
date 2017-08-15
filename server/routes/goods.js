let express = require("express")
let router = express.Router()
let mongoose = require('mongoose')
let Goods = require('../models/goods')
let User = require('../models/user');


// 连接数据库
mongoose.connect('mongodb://60.205.190.155:27017/shop-youhuo')
// 连接成功时触发
mongoose.connection.on('connected', function () {
  console.log('Mongodb connected success')
})
// 连接失败触发
mongoose.connection.on('error', function () {
  console.log('Mongodb connected fail')
})

// 当数据库关闭连接的时候触发
mongoose.connection.on('disconnected',function () {
  console.log('Mongodb connected disconnected')
})

router.get('/list',function (req,res,next) {
  // 不给条件是查找所有find{}
  let page =req.param("page");
  let pagesize = req.param("pagesize");
  let sort = req.param("sort");
  let priceLevel = req.param('priceLevel');
  let priceGt = '', priceLte = '';
  let param = {};
  let skip = (page - 1) * pagesize;

  if(priceLevel != 'all') {
    switch (priceLevel) {
      case '0': {priceGt = 0; priceLte = 100;break;}
      case '1': {priceGt = 100; priceLte = 500;break;}
      case '2': {priceGt = 500; priceLte = 1000;break;}
      case '3': {priceGt = 1000; priceLte = 5000;break;}
      case '4': {priceGt = 2000; priceLte = 5000;break;}
    }
     param = {
      // 在数据库里查询
      salePrice: {
        $gt:priceGt,
        $lte:priceLte
      }
    }
  }
  let goodModel = Goods.find(param).limit(pagesize).skip(skip);
  goodModel.sort({'salePrice':sort})
  goodModel.exec({}, function (err, docs) {
    console.log(docs)
    res.json({
      status: '0',
      result:docs
    })
  })
})





// 加入购物车API

router.post("/addCart", function(req,res,next) {
  if (req.cookies.userId) {
    var userId = req.cookies.userId
  } else {
    res.json({
      status: '1',
      msg: '用户信息不存在'
    })
  }
  var productId = req.body.productId;

  console.log(productId)

  User.findOne({userId:userId}, function (err,userDoc) {
    console.log(userDoc)
    // 当添加商品的时候， 先去数据库里面查询一下，这个商品是否存在，如果存在，就让他的productNum加1，如果不存在，就添加这个商品
    // 先去数据库里查询一下
    let goodItem = '';
    userDoc.cartList.forEach(function (item) {
      // 如果购物车里面的ID和现在要添加的商品id一样就让他productNum 加1
      if (item.productId === productId) {
        // 此时把相同的产品赋值变量
        goodItem = item
        item.productNum++;
      }
    });

    if (goodItem) {
      // 如果有这goodItem说明你购物车里面存在这个商品
      userDoc.save(function (err3,doc3) {
        if (err3) {
          res.json({
            status: '1',
            msg: err.message
          })
        } else {
          res.json({
            status: "0",
            result: "商品添加成功"
          })
        }
      })
    } else {
      // 这里是当商品第一次添加到购物车里面
      // 通过productId查询出一条商品，然后把这一条商品。存入user的cartList
      Goods.findOne({productId:productId}, function (err1,goodsDoc) {
        console.log(goodsDoc)
        goodsDoc.productNum = 1;
        userDoc.cartList.push(goodsDoc)
        userDoc.save(function (err2,doc2) {
          if(err2) {
            res.json({
              status: '1',
              msg:err.message
            })
          } else {
            res.json({
              status: 0,
              msg: '',
              result:"此商品第一次加入购物车"
            })
          }
        })
      })
    }
  })
})
module.exports = router;
