import './cart_base.css'
import './cart_trade.css'
import './cart.css' 
import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import mixin from 'js/mixin.js'
import Volecity from 'velocity-animate'
import Cart from 'js/cartService.js'

let app = new Vue({
    el: '#app',
    data: {
        list: null,
        total: 0,
        editingShop: null,
        editingShopIndex: -1,
        removePopup: false,
        removeData: null,
        removeMsg: ''
    },
    computed: {
        allChecked: {
            get(){
                if(this.list && this.list.length){
                    //通过每一个店铺是否选中来确定全选是否选中
                    return this.list.every(shop=>{
                        return shop.checked
                    })
                }
                return false
            },
            set(newValue){
               return this.list.forEach(shop=>{
                    shop.checked = newValue;
                    shop.goodsList.forEach(good=>{
                        good.checked = newValue
                    })
               })
            }
        },
        removeChecked: {
            get(){
                //如果是编辑状态下this.editingShop就是当前的shop
                if(this.editingShop){
                    return this.editingShop.removeChecked
                }
                return false
            },
            set(newVal){
                if(this.editingShop){
                    //可编辑状态下的店铺的选中值是newVal
                    this.editingShop.removeChecked = newVal
                    //可编辑状态下的店铺下面的全部商品的选中值都是newVal
                    this.editingShop.goodsList.forEach(good=>{
                        good.removeChecked = newVal
                    })
                }
            }
        },
        checkedLists(){
            if(this.list && this.list.length){
                let arr = []
                let total = 0
                this.list.forEach(shop=>{
                    shop.goodsList.forEach(good=>{
                        if(good.checked){
                            arr.push(good)
                            total+=good.price*good.number 
                        }
                    })  
                })
                this.total = total
                return arr
            }
            return []
        },
        removeLists(){
            if(this.editingShop){
                let arr = []
                //this.editingShop就是shop
                this.editingShop.goodsList.forEach(good=>{
                    if(good.removeChecked){
                        arr.push(good)
                    }
                })
                return arr
            }
            return []
        }
    },
    created(){
        this.getLists()
    },
    methods: {
        getLists(){
            axios.get(url.cartList)
            .then((res)=>{
            //将原始数据res.data.cartList赋值给一个变量
            let list = res.data.cartList
            //然后对这个变量直接进行动态属性添加
            list.forEach(shop => {
                shop.checked = true
                shop.removeChecked = false
                shop.editing = false //一开始不显示编辑状态下的内容
                shop.editingMsg = '编辑'
                shop.goodsList.forEach(good=>{
                    good.checked = true
                    good.removeChecked = false
                })
            });
            //最后再赋值给实例里的list
            this.list = list
            })
        },
        checkedGood(shop,good){
            //如果是店铺正在编辑状态attr就是移除选中，否则就是选中 
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            good[attr] = !good[attr]
            //通过商品是否全选中来选中店铺
            //数组的every方法，只要有一个元素返回false，最终结果就会返回false，否则就是true
            //也就是只要shop.goodsList中的元素有一个没选中返回false，那么shop.checked就会是false未选中
            shop[attr] = shop.goodsList.every(good=>{
                return good[attr]
            })
        },
        checkedShop(shop){
            //通过选中店铺，选中店铺里面的全部商品
            let attr = this.editingShop ? 'removeChecked' : 'checked'
            shop[attr] = !shop[attr]
            shop.goodsList.forEach(good=>{
                good[attr] = shop[attr]
            })
        },
        checkedAll(){
            let attr = this.editingShop ? 'removeChecked' : 'allChecked'
            this[attr] = !this[attr]
        },
        edit(shop,index){
            shop.editing = !shop.editing
            shop.editingMsg = shop.editing ? '完成' : '编辑'
            this.list.forEach((item,i)=>{
                //对除了当前你点击的这个商铺之外的商铺进行操作
                if(index !== i){
                    item.editing = false
                    item.editingMsg = shop.editing ? '' : '编辑'  
                } 
            })
            this.editingShop = shop.editing ? shop : null
            this.editingShopIndex = shop.editing ? index : -1
        },
        reduce(good){
            if(good.number === 1) return
            // axios.post(url.reduce,{
            //     id:good.id,
            //     number: good.number
            // }).then(res=>{
            //     good.number -= 1
            // })
            Cart.reduce(good.id,good.number).then(res=>{
                good.number -= 1
            })
        },
        add(good){
            // axios.post(url.add,{
            //     id: good.id,
            //     number: good.number
            // }).then(res=>{
            //     good.number += 1
            // })
            Cart.add(good.id,good.number).then(res=>{
                good.number += 1
            })
        },
        remove(shop,index,good,goodIndex){
            //要进行删除
            this.removePopup = true,
            //使用removeData存储你要删除的数据
            this.removeData = {shop,index,good,goodIndex}
            //删除单个商品
            this.removeMsg = '确定要删除该商品吗？'
        },
        removeList(){
            this.removePopup = true
            //删除选中状态下的一个或多个商品时的弹窗消息
            this.removeMsg = `确定要删除所选${this.removeLists.length}个商品删除？`
        },
        removeConfirm(){
            //如果是删除单个商品，通过当前商品的删除按钮触发
            if(this.removeMsg === '确定要删除该商品吗？'){
                let {shop,index,good,goodIndex} = this.removeData
                axios.post(url.remove,{
                   id: good.id 
                }).then(res=>{
                    //删除当前good,shop.goodsList就是每一个遍历的good
                    shop.goodsList.splice(goodIndex,1)
                    //如果店铺里的商品长度为0的时候
                    if(!shop.goodsList.length){
                        //this.list就是每一个shop的数组，也就是删除当前这个shop
                        this.list.splice(index,1)
                        //删除这个店铺后直接重置为非编辑状态
                        this.removeShop()
                    }
                    this.removePopup = false
                })
            }else{
                
                //删除选中状态下的一个或多个商品时，通过下方的删除按钮触发的
                let ids = []
                this.removeLists.forEach(good=>{
                    ids.push(good.id)
                })
                axios.post(url.mrremove,{
                    ids
                }).then(res=>{
                    let arr = []
                    //遍历在编辑状态下被选中的shop里的good
                    this.editingShop.goodsList.forEach(good=>{
                        //找到在编辑状态下当前店铺下的与选中的商品列表中id一致的那个商品的个索引
                        //也就是说你遍历的正在编辑状态下的店铺下的商品是不是在你的删除列表里面
                        //findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。
                        let index = this.removeLists.findIndex(item=>{
                            return item.id === good.id
                        })
                        //如果不在你的删除列表里面，也就是当前店铺中你没选中要删除的商品，就用一个新数组接收它
                        if(index === -1){
                            arr.push(good)
                        }
                    })
                    //如果当前编辑状态下的店铺中有没选中的商品，点击删除按钮触发时，
                    //当前店铺里的商品就重新渲染成了你之前没选中的那些，也就相当于删除了你选中的那些商品了
                    if(arr.length){
                        this.editingShop.goodsList = arr
                    }else{
                        //如果都在你的删除列表中，那么arr数组就是空，店铺里的商品就全删除了，需要把当前店铺删除
                        this.list.splice(this.editingShopIndex,1)
                        this.removeShop()
                    }
                    this.removePopup = false
                })
            }
            
        },
        removeShop(){
            this.editing = false;
            this.editingShop = null,
            this.list.forEach(item=>{
                item.editingMsg = '编辑'
            })
        },
        start(e,good){
            good.startX = e.changedTouches[0].clientX
        },
        end(e,index,good,goodIndex){
            let endX = e.changedTouches[0].clientX
            let left = '0'
            //开始位置大于结束位置，向左移动
            if(good.startX - endX > 100){
                left = '-60px' 
            }
            if(endX - good.startX > 100){
                left = '0px'
            }
            Volecity(this.$refs[`goods-${index}-${goodIndex}`],{
                left
            })
        }
        
    },
    mixins: [mixin]
})