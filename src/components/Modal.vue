<template>
  <!-- 模态框 -->
  <div>
  <div class="md-modal modal-msg md-modal-transition" :class="{'md-show':mdShow}">
    <div class="md-modal-inner">
      <div class="md-top">
        <div class="md-title">信息提示</div>
        <button class="md-close">Close</button>
      </div>
      <div class="md-content">
        <div class="confirm-tips">
          <slot name="message"></slot>
        </div>
        <div class="btn-wrap">
          <slot name="btnGroup"></slot>
        </div>
      </div>
    </div>
  </div>
  <div class="md-overlay" v-if="mdShow"></div>
  </div>
</template>
<script>
export default {
  // 接收父组件的变量
  props: ['mdShow']
//  name: 'modal',
//  data () {
//    return {
//
//    }
//  },
//  methods: {
//
//  }
}
</script>
