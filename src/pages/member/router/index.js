import member from '../components/member.vue'
import address from '../components/address.vue'
import form from '../components/form.vue'
import all from '../components/all.vue'
import Vue from 'vue'
import router from 'vue-router'

Vue.use(router)
let rt = new router({
    routes: [
        {
            path: '/',
            component: member,
        },
        {
            path: '/address',
            component: address,
            children: [
                {
                    path: '',
                    redirect: 'all'
                },
                {
                    //就相当于/address/all
                    path: 'all',
                    name: 'all',
                    component: all
                },
                {
                    path: 'form',
                    name: 'form',
                    component: form
                }
            ]
        },
    ]
})
export default rt
