let url = {
    hostlists: '/index/hotLists',
    banner: '/index/banner',
    topList: '/category/topList',
    rank: '/category/rank',
    subList: '/category/subList',
    search: '/search/list',
    defails: '/goods/details',
    deal: '/goods/deal',
    evaluation: '/goods/evaluation',
    add: '/cart/add',
    cartList: '/cart/list',
    update: '/cart/update',
    reduce: '/cart/reduce',
    remove: '/cart/remove',
    mrremove: '/cart/mrremove',
    addressLists: '/address/list',
    addressAdd: '/address/add',
    addressRemove: '/address/remove',
    addressUpdate: '/address/update',
    addressSetDefault: '/address/setDefault'
}
let host = 'http://rap2api.taobao.org/app/mock/105486'
for(var key in url){
    if(url.hasOwnProperty(key)){
        url[key] = host + url[key]
    }
}
export default url