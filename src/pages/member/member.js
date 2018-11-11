import './member.css'
import Vue from 'vue'
import rt from './router/index.js'
import store from './vuex/index.js'

let app = new Vue({
    el: '#app',
    router: rt,
    store
})
