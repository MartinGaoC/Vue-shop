## Two Day
 1.使用easy mock模拟API
    网址 easy mock.com
    然后使用postman测试模拟


 2.express-generator安装使用

   记忆点
      express:Express 是一个简洁而灵活的 node.js Web应用框架, 提供一系列强大特性帮助你创建各种Web应用
              把MongoDB后台数据做成API供Vue前段框架调用
      express-generator包
        express4以后将express命令独立到express-generator包中
        如果要使用express初始化项目目录
        cnpm i express-generator -g

   步骤
      在根文件夹下命令行cnpm i express-generator -g
      会生产出一个express server文件夹
      server中的bin文件夹下有www文件 是启动文件
        看见port 想到监听的端口号
        server中执行命令行操作会弹出localhost：3000端口网页
        在server中执行 cnpm  i 安装所需依赖
        然后启动 node bin /www
    模板引擎
      jade：不闭合标签



 3.在服务器端运行mongdb
    记忆点
      mongdb:是一个基于分布式文件存储的数据库。由C++语言编写
             是一个数据库运行，数据更像一个一个的集合
      mongooes:是mongdb的包管理
                cnpm i mongoose
    步骤
      详细教程地址https://segmentfault.com/a/1190000003102807
      搭建服务器端的mongodb
      linux下载
        wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel62-3.0.5.tgz
      解压
        tar zxvf mongodb-linux-x86_64-rhel62-3.0.5.tgz

        mv mongodb-linux-x86_64-rhel62-3.0.5  /usr/local/mongodb #更改文件夹名字

        cd   /usr/local/mongodb/bin
      创建两个文件夹存放数据和日志
          mkbir  mongo  mlog


      服务器端启动mongdb
        找到mongod文件夹CD进去有一个bin文件夹和data文件夹在data文件夹下创建配置文件 mongod.conf代码如下
        port=27018 #指定端口
        fork=true #后台运行
        dbpath=/home/map/mongodb/mongo #规定数据库的位置
        logpath=/home/map/mongodb/mlog/mongodb.log #规定数据库的日志文件
        master=true #设置主机
        # bind_ip=127.0.0.1,192.168.0.4 #允许的地址 为了安全
        nohttpinterface=true #禁止http访问
        根据路径运行文件
          ./mongod -f ./mongodb.conf
        ## 纠错点
          端口被占用  需要去阿里云服务器配置开启27017端口
        成功启动数据库后
      通过window端的MongoBooster软件进行导入数据操作
        连接到数据库 60.205.190.155然后新建一个shop的库 然后import导入json文件

      如果mongdb在window上则直接在mongdb/bin 下运行 mongod启动 后台运行加 --install

 4.通过express操作mongodb
    server这里就是express写Api的地方
    server下创建一个models模型文件夹再包含一个goods.js文件
    goods文件中引入模块mongoose这里的主要功能是创建数据库表的字段
    这个文件是一个模板
      let mongoose = require('mongoose')
      let Schema = mongoose.Schema
      #这是一个模型模型是返回的数据规则
      let productSchema = new Schema({
        "productId": String,
        "productName": String,
        "salePrice": Number,
        "productImage": String,
      })
      这里记得导出
      module.exports = mongoose.model("Goods",productSchema)


    server的routes下创建goodsAPI 注意这个文件就是API了
        require引入自动去node_modules里找
        引入 express
            mongoose
            Goods

        连接数据库
          mongoose.connect('mongodb://60.205.190.155:27017/shop-youhuo')
        在写几个状态打印出你是否连接成功
          mongoose.connection.on('connected', function () {
            console.log('Mongodb connected success')
          })
        这里要写路由操作mongodb了下面是一个查询的操作
          router.get("/list", function(req,res,next){

            router.get('/list',function (req,res,next) {
              # 不给条件是查找所有find{}
              sort排序方法
              let sort = req.param("sort");
              #
              let priceLevel = req.param('priceLevel');
              let priceGt = '', priceLte = '';
              let param = {};

              if(priceLevel != 'all') {
                switch (priceLevel) {
                  case '0': priceGt = 0; priceLte = 100;break;
                  case '1': priceGt = 100; priceLte = 500;break;
                  case '2': priceGt = 500; priceLte = 1000;break;
                  case '3': priceGt = 1000; priceLte = 5000;break;
                }
                 param = {
                  salePrice: {
                    $gt:priceGt,
                    $lte:priceLte
                  }
                }
              }
                  #.find是查询数据库的api 下面语句就是查询了数据库Goods
              let goodModel = Goods.find(param);
              sort 语法规定传一个对象过去
              goodModel.sort({'salePrice':sort})

              goodModel.exec({}, function (err, docs) {
                console.log(docs)
                #下面是express的语法 往页面输出一个json数据
                res.json({
                  status: '0',  #状态
                  result:docs   #结果
                })
              })
            })


          })



           module.exports = router;导出

    最后要在server下的app.js中进行引入toutes中的模块
    应用一下
      var index = require('./routes/index');
      var users = require('./routes/users');
      var goods = require('./routes/goods');
      app.use('/', index);
      app.use('/users', users);
      app.use('/goods', goods);

 5.价格排序
      cnpm run dev 就是运行json文件中的
      解决后端跨域问题
        在config\index.js下进行修改
          ```
              proxyTable: {
                '/goods' : {
                  target: 'http://localhost:3000'
                },
                '/goods/*' : {
                  target: 'http://localhost:3000'
                },
              },
          ```
        *等于代理的意思 一个是一级代理 两个是两级代理
         这可作为工作中遇到的问题
      通过routes中的goods操作数据接收参数返回数据
      下面语句接收参数前段传过来的参数param接收如果要使用排序
         let sort = req.param("sort");

        解决你的问题的网址
        https://github.com/sindresorhus/awesome-nodejs
        supervisor解决每次修改都要重新启动的问题
           cnpm i supervisor -g
           然后server启动时用supervisor bin/www

        前段逻辑
         在data里设置
         sortFlag
         priceChecked判断点击为谁
         priceFilter是区间再加上一个索引值 然后遍历到视图上同时循环一个price 和index
             data () {
                 return {
                   GoodsList: Array,
                   sortFlag: true,
                   priceChecked: 'all',
                   priceFilter: [
                     {
                       startPrice: '0.00',
                       endPrice: '100.00'
                     },
                     {
                       startPrice: '100.00',
                       endPrice: '500.00'
                     },
                     {
                       startPrice: '500.00',
                       endPrice: '1000.00'
                     },
                     {
                       startPrice: '1000.00',
                       endPrice: '5000.00'
                     }
                   ]
                 }
               },
            <dd v-for="(price,index) in priceFilter">

              </dd>
         遍历设置一个区间
             <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
         点击触发一个函数传索引值
             setPriceFilter (index) {
                  console.log(index)
                  this.priceChecked = index
                  this.getGoodsList()
                }
          然后判断
             sortGoods () {
                  this.sortFlag = !this.sortFlag
                  this.getGoodsList()
                },
           然后运行ajax传参这里传了两个值 sort传值为1或-1告诉后端是否需要排序 priceLevel传的为index索引值要求返回哪一个区间的数据
               getGoodsList () {
                    let param = {
                      sort: this.sortFlag ? 1 : -1,
                      priceLevel: this.priceChecked
                    }
                    # ajax 路径 然后传一个对象过去
                    axios.get('/goods/list', {params: param}).then((result) => {
                      let res = result.data.result
                      console.log(res)
                      this.GoodsList = res
                      // 全局赋值
                    })
                  },
         后端逻辑
            路由。get方法从数据库获取
            使用router.get
            req请求
            res响应
            next?

            router.get('/list',function (req,res,next) {

            })
            导入前段传过来的两个参数
            let sort = req.param("sort");
            let priceLevel = req.param('priceLevel');

            声明两个空
            声明一个param 对象
            let priceGt = '', priceLte = '';
            let param = {};

            通过判断priceLevel来确定priceGT和priceLte的区间
                switch (priceLevel) {
                      case '0': priceGt = 0; priceLte = 100;break;
                      case '1': priceGt = 100; priceLte = 500;break;
                      case '2': priceGt = 500; priceLte = 1000;break;
                      case '3': priceGt = 1000; priceLte = 5000;break;
                    }


             param对象在数据库里进行查询
                 param = {
                      // 在数据库里查询
                      salePrice: {
                        $gt:priceGt,
                        $lte:priceLte
                      }
                    }
              let goodModel = Goods.find(param);
              goodModel.sort({'salePrice':sort})


              查询的数据返回一个状态和结果
                  goodModel.exec({}, function (err, docs) {
                     console.log(docs)
                     res.json({
                       status: '0',
                       result:docs
                     })
                   })
             最后导出到路由
            module.exports = router;
