import fetch from './fetch.js'
import url from './api.js'

class Address{
    static list(){
        return fetch(url.addressLists)
    }

    static add(data){
        //因为url本身就是定义的，所以是实参，而data没有定义，所以需要在add里传入
        return fetch(url.addressAdd,data)
    }

    static remove(id){
        return fetch(url.addressRemove,id)
    }

    static update(data){
        return fetch(url.addressUpdate,data)
    }

    static setdefault(id){
        return fetch(url.addressSetDefault,id)
    }
}
export default Address