<template>
    <div>
        <section>组件111</section>
        <div>{{getPage2Count}}</div>
        <div>{{getPage1Count}}</div>
        <div @click="A_INCREASE1">按钮</div>
        <router-view></router-view>
    </div>
</template>
<script>
  import {
    A_PREFETCH,
    A_INCREASE1,
    A_DECREASE1
  } from '../../store/action-types';
  import { mapActions, mapState, mapMutations, mapGetters } from "vuex";
  export default {
    data() {
      return {
        msg: ''
      }
    },
    computed: {
      ...mapGetters([
        'getPage1Count',
        'getPage2Count',
      ])
    },
    methods: {
      ...mapActions([
        A_INCREASE1,
        A_DECREASE1
      ])
    },
    asyncData({store, route}) {
      // 触发 action 后，会返回 Promise
      console.log('888888888888888888888888888888888888888888888888888888888888')
      return store.dispatch(A_PREFETCH, route.params, {root: true});
    },
  }
</script>
