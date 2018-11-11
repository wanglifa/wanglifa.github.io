import 'css/common.css'
import './index.css'
import url from 'js/api.js'
import Vue from 'vue'
import axios from 'axios'
import { InfiniteScroll } from 'mint-ui';
import Foot from 'components/Foot.vue'
import Swipe from 'components/Swipe.vue'
import mixin from 'js/mixin.js'
Vue.use(InfiniteScroll);
let app = new Vue({
    el: '#app',
    data: {
        lists: null,
        pageNum: 1,
        pageSize: 6,
        //是否可以加载 
        loading: false,
        //是否完全加载完成
        allLoaded: false,
        bannerLists: null
    },
    created(){
        this.getLists(),
        this.getBanner()
    },
    methods: {
        getLists(){
            if(this.allLoaded) return;
            //是否正在加载，当数据还未完成加载就禁用无限滚动 
            this.loading = true
            axios.get(url.hostlists,{
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }).then((res)=>{
                let curLists = res.data.lists;
                //所有数据是否加载完毕
                if(curLists.length<this.pageSize){
                    this.allLoaded = true
                }
                if(this.lists){
                    //如果已经获取了lists，就让lists在已经存在的数据基础上添加新的数据
                    this.lists = this.lists.concat(curLists)
                }else{
                    //初始化
                    this.lists= curLists
                }
                this.loading = false
                this.pageNum++
            })
        },
        getBanner(){
            axios.get(url.banner).then((res)=>{
                this.bannerLists = res.data.lists
            })
        }
    },
    components: {
        Swipe
    },
    mixins: [mixin]
})