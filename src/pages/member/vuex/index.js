import Vue from 'vue'
import Vuex from 'vuex'
import fetch from 'js/fetch.js'
import url from 'js/api.js'
import Address from 'js/addressService.js'
Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        lists: null
    },
    mutations: {
        //对state进行操作
        init(state,lists){
            state.lists = lists
        },
        add(state,instance){
            state.lists.push(instance)
        },
        remove(state,id){
            let lists = state.lists
            let index = lists.findIndex(item=>{
                return item.id === id
            })
            lists.splice(index,1)
        },
        setdeafult(state,id){
            let lists = state.lists
            lists.forEach(item=>{
                item.isDefault = item.id === id ? true : false
            })
        },
        update(state,instance){
            let lists = JSON.parse(JSON.stringify(state.lists))
            let index = lists.findIndex(item=>{
                return item.id === instance.id
            })
            lists[index]=instance
            state.lists = lists
        }
    },
    actions: {
        //异步操作
        getLists({commit}){
            Address.list().then(res=>{
                //触发init函数，传入一个res.data.lists作为参数
                commit('init',res.data.lists)
            })
        },
        addAction({commit},instance){
            Address.add(instance).then(res=>{
                instance.id = parseInt(Math.random()*10000)
                commit('add',instance)
            })
        },
        removeAction({commit},id){
            Address.remove(id).then(res=>{
                commit('remove',id)
            })
        },
        setAction({commit},id){
            Address.setdefault(id).then(res=>{
                commit('setdeafult',id)
            })
        },
        updateAction({commit},instance){
            Address.update(instance).then(res=>{
                commit('update',instance)
            })
        }
         
    }

})
export default store