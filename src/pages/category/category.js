import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import './category.css'
import 'css/common.css'
import mixin from 'js/mixin.js'

let app = new Vue({
    el: '#app',
    data: {
        topList: null,
        current: 0,
        rankData: null,
        subListData: null,
        currentId: 800
    },
    created: function(){
        this.getTopList()
        this.getrank(800,0)
    },
    methods: {
        getTopList(){
            axios.get(url.topList)
            .then((res)=>{
                this.topList = res.data.lists
            })
        },
        getrank(id,index){
            this.current = index,
            this.currentId = id;
            console.log(this.current,index)
            if(id === 800){
                axios.get(url.rank)
                .then((res)=>{
                    this.rankData = res.data.data
                })
            }else{
                this.getsubList(id)
            }
            
        },
        getsubList(id){
            axios.post(url.subList,{
                id
            })
            .then((res)=>{
                this.subListData = res.data.data;
            })
        },
        getSearch(id,name){
            location.href=`/search.html?id=${id}&keyword=${name}`
        }
    },
    mixins: [mixin]
    
})