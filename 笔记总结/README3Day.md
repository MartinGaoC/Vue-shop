spa
单页Web应用（single page web application，SPA），就是只有一张Web页面的应用，是加载单个HTML 页面并在用户与应用程序交互时动态更新该页面的Web应用程序。

ssr
服务器直接渲染，也就 SSR(Server Side Render)。
https://surmon.me/article/48
基于vue 有个 ssr
nuxtjs 基于vue
nextjs 基于react
通俗来讲就是解决单页面应用不能被百度等搜索引擎获得关键字
解决spa对百度不友好
sem搜索引擎营销
之前在各大SPA框架还未正式官方支持SSR时，有一些第三方的解决方案，如：prerender.io， 它们做的事情就是建立HTTP一个中间层，在判断到访问来源是蜘蛛时，输出已缓存好的html数据，此数据若不存在，则调用第三方服务对html进行缓存，往复进行。

另一方法是自行构建蜘蛛渲染逻辑，当识别UA为搜索引擎时，拿服务端已准备好的模板和数据进行渲染输出html数据，反之，则输出SPA应用代码；

我当时也考虑过此方法，但有很多弊端，如：

需要针对蜘蛛编写一套独立的渲染模板，因为大部分情况下SPA的代码是没法直接在服务端使用的
搜索引擎若检测到蜘蛛抓取数据和真实访问数据不一致，会做降权惩罚，也就意味着渲染模板还必须和SPA预期输出一模一样
所以，最好的方法是SPA能和服务端使用同一套模板，且使用同一个服务端逻辑分支，再简单说：最好Vue、Ng2...能直接在服务端跑起来。

于是，陆续诞生了基于React的Next.js、基于Vue的Nuxt.js、Ng2诞生之日便支持。

没错，Nuxt.js就是今天的主角。

Nuxt.js


MongoDB 条件操作符
http://www.runoob.com/mongodb/mongodb-sort.html
描述
条件操作符用于比较两个表达式并从mongoDB集合中获取数据。
在本章节中，我们将讨论如何在MongoDB中使用条件操作符。
MongoDB中条件操作符有：
(>) 大于 - $gt
(<) 小于 - $lt
(>=) 大于等于 - $gte
(<= ) 小于等于 - $lte

MongoDB sort()方法
在MongoDB中使用使用sort()方法对数据进行排序，sort()方法可以通过参数指定排序的字段，并使用 1 和 -1 来指定排序的方式，其中 1 为升序排列，而-1是用于降序排列。



思路：
  打开页面的时候，先加载可视区的东西。
  优点：
    1.减少流量
    2.减少页面卡顿的时间。防止请求数据过于多导致卡顿
  前端：
    当鼠标滚动到可视区下，自动请求后端API加载下一页
    /goods/list/page=1&pagesize=8
  后台API：
    当前台按照页数请求给前端提供总页数,总条数

后端逻辑
  通过前端请求地址发送过来page与pagesize
    导入进来
    let page =req.param("page");
    let pagesize = req.param("pagesize");
  MongoDB的limit与skip方法
    http://www.runoob.com/mongodb/mongodb-limit-skip.html
    MongoDB Limit() 方法
    如果你需要在MongoDB中读取指定数量的数据记录，可以使用MongoDB的Limit方法，limit()方法接受一个数字参数，该参数指定从MongoDB中读取的记录条数。

    MongoDB Skip() 方法
    我们除了可以使用limit()方法来读取指定数量的数据外，还可以使用skip()方法来跳过指定数量的数据，skip方法同样接受一个数字参数作为跳过的记录条数。
      let goodModel = Goods.find(param).limit(pagesize).skip(skip);
  skip需要计算
        let skip = (page - 1) * pagesize;

前端逻辑
   这里需要在main.js安装一个前端插件，
   vue-infinite-scroll
     https://github.com/ElemeFE/vue-infinite-scroll

     npm install vue-infinite-scroll --save
   全局注册
   import infiniteScroll from 'vue-infinite-scroll'
     Vue.use(infiniteScroll)
   用法
    html中
    滚动到底部执行loadMore方法
     <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                       ...
                     </div>
    JS中
    loadMore () {
          this.busy = true
          setTimeout(() => {
            this.page++
            this.getGoodsList(true)
          }, 500)
        }




     let res = result.data.result
     如果数据状态为0则继续如果不为0抛出一个系统正忙
     if (result.data.status === '0') {
    //          console.log(res)
    设置一个参数flag初始值为false，滚动到底部触动loadMose方法后给getGooDist传一个（true)也就是说此时的flag为true
              if (flag) {
                console.log(res)
    //            console.log(this.GoodsList)
                if (res) {
               // 判断数据是res的话则拼接原本的数据和新请求出来的数据
                  this.GoodsList = this.GoodsList.concat(res)
                }
                // 判断数据加载完成后截停
                // 设置一个锁为busy busy的初始值是true 判断条件 如果当请求下来的数据小于pagesize8的时候说明是最后一页则return 也就是说busy为true停止请求 为false继续请求
                if (res.length < this.pagesize) {
                  this.busy = true
                  return
                } else {
                  // 请求
                  this.busy = false
                }
              } else {
                this.GoodsList = res
                this.busy = false
              }
              // 全局赋值
            } else {
              alert('系统正忙')
            }


##加入购物车逻辑
   思路:
      点击加入购物车，把点击的这个商品ID存入到数据库当中，
      那个用户点击则加入用户的后台表数据中

      api:
        有一个userID,有一个子模块叫cartlist
        这里有一张新表了，在models文件夹下写入一个user模型
        然后引入到api中 let User = require('../models/user');



post请求的API
  router.post("/addCart", function (rep,res,next) {
     // 我们模拟的用户ID
     let userId = '100000077'
    //  url传过来的商品ID
    let productId = req.param('productId')


    User.findOne({userId:userId}, function (err, userDoc) {
        findOne只返回一条被查询的文档
        通过mongDB语法从数据库查询获得数据,usrerDoc是返回的数据
       空的商品
       let goodItem = ''

       // 这里的item就是查询到一个用户里的商品列表遍历这个列表
      userDoc.cartList.forEach(function (item) {
            // 如果购物车里面的ID和现在要添加的商品id一样就让他productNum 加1
            // 如果这个列表里某一个的productId等于传过来的Id
            // 则不需要在把整个商品拉过来，只需要让item.productNum属性++ 代表买个几个商品
            if (item.productId == productId) {
              // 此时把相同的产品赋值变量
              goodItem = item
              item.productNum++;
            }
          });
         if (goodItem) {
            // 如果有这goodItem说明你购物车里面存在这个商品
            userDoc.save(function (err3,doc3) {
              //
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
              goodsDoc.productNem = 1;
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
    }
  }






