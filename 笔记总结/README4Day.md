##知识点
   1. 登录后再后端API种下一个cookie
    res.cookie('userId',doc.userId,{
              path: '/',
              // 保存时间
              maxAge:1000*60*60
     })
    2.app.js中写入访问拦截，访问的所有的url都先经过这个处理
      app.use(function (req,res,next) {
        if (req.cookies.userId) {
          next()
          // 下一步
        } else {
          if (
            // 这里是白名单
            req.originalUrl == '/users/login'
            || req.originalUrl == '/users/logout'
            || req.path == '/goods/list'
          ){
            next()
          } else {
            res.json({
              status: '1',
              msg: '当前未登录',
              result: ''
            })
          }
        }
      })
