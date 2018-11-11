import 'css/common.css'
import './search.css'
import axios from 'axios'
import Vue from 'vue'
import url from 'js/api.js'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'
import { InfiniteScroll } from 'mint-ui';
Vue.use(InfiniteScroll);
let {id,keyword}= qs.parse(location.search.substring(1))
let app = new Vue({
    el: '#app',
    data: {
        searchLists: null,
        id: Number(id),
        keyword,
        loading: false,
        pageNum: 1,
        pageSize: 6,
        //是否完全加载完成
        allLoaded: false,
        returnTop: false,
        ending: false
    },
    created(){
        this.getSearch()
    },
    methods: {
        getSearch(){
            if(this.allLoaded){
                this.ending = true;
                return
            }
            this.loading = true
            axios.post(url.search,{
                id,
                keyword,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then((res)=>{
                let curLists = res.data.lists;
                //所有数据是否加载完毕
                if(curLists.length<this.pageSize){
                    this.allLoaded = true
                }
                if(this.searchLists){
                    //如果已经获取了lists，就让lists在已经存在的数据基础上添加新的数据
                    this.searchLists = this.searchLists.concat(curLists)
                }else{
                    //初始化
                    this.searchLists= curLists
                }
                this.loading = false
                this.pageNum++
            }).catch((err)=>{
                console.log(err)
            })
        },
        toggle(){
            if(document.documentElement.scrollTop>100){
                this.returnTop = true
            }else{
                this.returnTop = false
            }
        },
        toTop(){
            Velocity(document.body, 'scroll',{duration: 1000})
        }
    },
    mixins: [mixin]
})