import './goods_common.css'
import './goods_custom.css'
import './goods.css'
import './goods_theme.css'
import './goods_mars.css'
import './goods_sku.css'
import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import Swipe from 'components/Swipe'
let {id,name}=qs.parse(location.search.substring(1))
let tab = ['商品详情','本店交易']
let app = new Vue({
    el: '#app',
    data: {
        detailsData: null,
        name,
        id,
        tab,
        tabIndex: 0,
        dealData: null,
        bannerLists: null,
        skuType:1,
        isshow: false,
        disabled: true,
        count: 1,
        successed: false,
        isaddCart: false
    },
    created(){
        this.getDetails()
    },  
    methods: {
        getDetails(){
            axios.post(url.defails,{id})
            .then((res)=>{
                this.detailsData = res.data.data
                this.bannerLists = []
                this.detailsData.imgs.forEach(element => {
                    this.bannerLists.push({
                        clickUrl: 'javascript:;',
                        img: element
                    })
                });
            })
        },
        changetab(index){
            this.tabIndex = index
            if(index===1){
                this.getDeal()
            }
        },
        getDeal(){
            axios.post(url.deal,{id})
            .then((res)=>{
                this.dealData = res.data.data
            })
        },
        getskuType(index){
            this.skuType = index
            this.isshow = true
        },
        toggleShow(){
            this.isshow = false
        },
        changeNum(index){
            if(index === -1 && this.count===1){
                return
            }
            //如果index是-1就加-1，是1就加1
            this.count += index
        },
        addCart(){
            axios.post(url.add,{
                id,
                number: this.count
            }).then((res)=>{
                this.successed = true
                this.isshow = false
                this.isaddCart = true
                setTimeout(()=>{
                    this.successed = false
                },1000)
            })
        },
    },
    watch: {
        isshow(val,oldVal){
            document.body.style.overflow = val ? 'hidden' : 'scroll'
            document.querySelector('html').style.overflow = val ? 'hidden' : 'scroll'
            document.body.style.height = val ? '100%' : 'auto'
            document.querySelector('html').style.height = val ? '100%' : 'auto'
        }
    },
    components: {Swipe},
    mixins: [mixin]
})