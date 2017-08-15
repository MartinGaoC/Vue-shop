<template>
  <div>
    <nav-header></nav-header>
    <nav-bread>商品</nav-bread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" :class="{'cur':priceChecked == 'all'}">All</a></dd>
              <dd v-for="(price,index) in priceFilter">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" :class="{'cur':priceChecked == index}">{{price.startPrice}} - {{price.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in GoodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'static/img/' + item.productImage" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="setproductId(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="20">
                  ...
                </div>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  <nav-footer></nav-footer>
   <modal :mdShow="mdShow">
         <p slot="message">请先登录否则无法加入购物车</p>
       <div slot="btnGroup">
         <a href="javascript:;" class="btn-login" @click="mdShow = false">关闭</a>
       </div>
   </modal>

    <!--登陆成功情况-->
    <modal :mdShow="mdShowShadow">
      <p slot="message">加入购物车成功</p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowShadow = false">继续购物</a>
        <router-link class="btn btn--m" to="/cart">查看购物车</router-link>
      </div>
    </modal>
  </div>
</template>
<script>
import NavHeader from '@/components/Header'
import NavFooter from '@/components/Footer'
import NavBread from '@/components/Navbread'
import Modal from '@/components/Modal'
import axios from 'axios'
export default {
  name: 'GoodsList',
  data () {
    return {
      GoodsList: Array,
      sortFlag: true,
      priceChecked: 'all',
      busy: true,
      page: 1,
      pagesize: 8,
      flag: false,
      mdShow: false,
      mdShowShadow: false,
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
        },
        {
          startPrice: '2000.00',
          endPrice: '5000.00'
        }
      ]
    }
  },
  components: {
    NavHeader,
    NavFooter,
    NavBread,
    Modal
  },
  // 组件初始化后调用方法
  mounted: function () {
    this.getGoodsList()
  },
  methods: {
    getGoodsList (flag) {
      let param = {
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked,
        page: this.page,
        pagesize: this.pagesize
      }
      axios.get('/goods/list', {params: param}).then((result) => {
        console.log(result)
        let res = result.data.result
        if (result.data.status === '0') {
//          console.log(res)
          if (flag) {
            console.log(res)
//            console.log(this.GoodsList)
            if (res) {
              this.GoodsList = this.GoodsList.concat(res)
            }
            // 判断数据加载完成后截停
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
      })
    },
    sortGoods () {
      this.page = 1
      this.sortFlag = !this.sortFlag
      this.getGoodsList()
    },
    setPriceFilter (index) {
      console.log(index)
      this.page = 1
      this.priceChecked = index
      this.getGoodsList()
      this.busy = false
    },
    loadMore () {
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 500)
    },
    setproductId (productId) {
      axios.post('/goods/addCart', {productId: productId}).then((response) => {
        let res = response.data
        console.log(res)
        if (res.status === '1') {
          this.mdShow = true
        } else {
          this.mdShowShadow = true
        }
      })
    }
  }
}
</script>
