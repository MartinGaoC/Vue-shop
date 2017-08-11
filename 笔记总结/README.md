## 项目有货网
    介绍 一个典型的电商类网站，UI用户体验方面要下功夫，数据交互方面API较多，要构思清楚布局方式，根具需求理清思路（组件）。
##项目流程
  项目研讨会 讨论项目的细节逻辑和各个方面的人手配置
  UI2人出图需要2到三天  后端3人API需要3天
  这段时间前端需要写一个demo实现大体不加样式的功能，和一些
  组件（轮播图，tab框等）
  然后通过模拟API来测试交互

  技术选型
    使用Vue框架构建用到的插件如
      swipe
      lazyload
      axios
    数据库使用
      mongodb
    服务使用
      Linux:
        centos
        Ubuntu
    上线
      git webhook
      推送到git仓库


开工第一步
  一个脚手架Vue-cli
  配置脚手架
  网站有指示命令参照即可
    https://cn.vuejs.org/v2/guide/installation.html
  vue商品列表初始化
    新建view文档
      html板块进行复制粘贴
      import引入axios模块进行AJAX动态数据的渲染
      然后再components分别拆分成NavHeader,NavFooter,NavBread三个组件
      这里切记不要与原html标签相同
      拆分的组件中要写
      export default {

      }
      进行导出

  怎么去掉eslint规范（不建议使用）
    ```
      module: {
        rules: [

          // {
          //   test: /\.(js|vue)$/,
          //   loader: 'eslint-loader',
          //   enforce: 'pre',
          //   include: [resolve('src'), resolve('test')],
          //   options: {
          //     formatter: require('eslint-friendly-formatter')
          //   }
          // },
    ```

  解决识别css扩展文件
    在build/webpack.base.conf.js文件里
    extensions: ['.js', '.vue', '.json','.css'],
第二步
  进行模拟API
    再mock文件夹中模拟API接口数据
    使用express读取本地JSON自定义商品的API

       axios.get("/goods").then((result) => {
                let res = result.data.result;
                console.log(result)
                this.GoodsList = res;

                // console.log(this.GoodsList);
              })
    在build/里面 dev-server.js
        ```
        var app = express()
        var compiler = webpack(webpackConfig)

        <!-- 添加以下代码 -->

        var router = express.Router();
        var goodsData = require('../mock/goods.json');

        给前端提供一个get方式的 api，然后前端就可以通过localhost:8080/goods 访问了

        router.get("/goods",function(req,res,next){
          当前端请求这个api的时候，给他响应，回馈点东西
          就把上面的goodsData 按照json的方式发送出去
            res.json(goodsData);
        });

        app.use(router);
        ```

    express主要作用 基于node.js平台，快速，开发极简的web开发框架


第三步
  通过在主入口文件 VueLazyLoad 插件引入
    import VueLazyLoad from 'vue-lazyload'

    Vue.use(VueLazyLoad,{
      // loading:'/static/loading/loading-spinning-bubbles.svg'
      loading:'/static/img/ok-2.png'
    });

    然后可使用标签 v-lazy 导入图片
      <a href="#"><img v-lazy="'/static/img/' + item.productImg" alt=""></a>

第四步
  通过<solt></solt>
  进行面包屑的插入
