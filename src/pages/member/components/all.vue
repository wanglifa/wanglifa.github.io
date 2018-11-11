<template>
    <div class="container " style="min-height: 597px;">
    <div class="block-list address-list section section-first 
    js-no-webview-block" v-if="lists&&lists.length">
      <a class="block-item js-address-item address-item " 
        v-for="list in lists"
        :key="list.id"
        @click="Edit(list)"
        :class="{'address-item-default':list.isDefault}"
        >
        <div class="address-title">{{list.name}} {{list.tel}}</div>
        <p>{{list.provinceName}}{{list.cityName}}{{list.districtName}}{{list.address}}</p>
        <a class="address-edit">修改</a>
      </a>
    </div>
    <div v-if="lists&&!lists.length">
      没有地址，请添加
    </div>
    <div class="block stick-bottom-row center">
      <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" 
       :to="{name: 'form',query:{type:'add'}}">
            新增地址
      </router-link>
    </div>
  </div>
</template>
<script>
import Address from 'js/addressService.js'
export default {
  // data(){
  //   return {
  //     lists: null
  //   }
  // },
  created(){
    // Address.list().then(res=>{
    //   this.lists = res.data.lists
    // })
    if(!this.lists){
      this.$store.dispatch('getLists')
    }
  },
  computed: {
    lists(){
      return this.$store.state.lists
    }
  },
  methods: {
    Edit(list){
      this.$router.push({name: 'form',query:{instance:list,type:'edit'}})
    }
  }
}
</script>

<style scoped>
  @import './address_base.css';
  @import './address.css';
</style>
