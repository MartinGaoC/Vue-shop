let express = require('express');
let router = express.Router();
let User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/login',function(req,res,next) {
    let param = {
      userName: req.body.userName,
      userPwd: req.body.userPwd
    };
    // 用户名去数据库查询，
    User.findOne(param, function (err, doc) {
      if (err) {
        res.json({
          status:'1',
          msg: '用户名或密码错误'
        })
      } else {
        res.cookie('userId',doc.userId,{
          path: '/',
          maxAge:1000*60*60
        })
        res.cookie('userName',doc.userName, {
          path: '/',
          maxAge:1000*60*60
        })

        if (doc) {
          res.json({
            status:'0',
            msg: '',
            result: {
              userName:doc.userName
            }
          })
        }
      }
    })
});

//判断当前用户是否登录
router.get("/checkLogin", function (req,res,next) {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else {
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
});
router.post('/logout', function (req,res,next) {
  res.cookie("userId",'',{
    path: '/',
    maxAge: -1
  });
  res.json({
    status: '0',
    msg: '',
    result: '退出成功'
  })
});

// 查询购物车列表
router.get('/cartList',function (req,res,next) {
  let userId = req.cookies.userId;
  User.findOne({userId:userId}, function (err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result:''
      })
    } else {
      if (doc) {
        res.json({
          status: '0',
          mag: '',
          result: doc.cartList
        })
      }
    }
  })
});

// 变更数量
// 得到用户ID 商品ID 商品数量
router.post('/cartEdit', function(req,res,next) {
  // cookies ID
  let userId = req.cookies.userId;
  productId = req.body.productId;
  productNum = req.body.productNum;
  // $ update的前两个参数<查询条件>和<更新操作>中，如果你在<查询条件>中查询的内容是array里的内容，<更新操作>中就可以使用"$"来引用前查询中匹配到的元素。
  User.update({"userId": userId, "cartList.productId": productId},{"cartList.$.productNum": productNum}, function(err,doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '商品数据更新成功'
      })
    }
  })
});

// 删除物品
router.post("/cartDel", function (req,res,next) {
  var userId = req.cookies.userId,
      productId = req.body.productId
  // $pull删除指定数据$pullAll删除指定数据只支持数组
  User.update({
    userId:userId
  },{
    $pull: {
      'cartList': {
        'productId': productId
      }
    }
  }, function (err, doc) {
    if (err) {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    } else {
      res.json({
        status: '0',
        msg: '',
        result: '商品数据删除成功'
      })
    }
  })
})
// 如果没有识别到页面就会到这里 一般页面走丢的时候使用
router.get('*',function (req,res,next) {
  res.send('台湾是中国不可分割的一部分')
})
module.exports = router;
