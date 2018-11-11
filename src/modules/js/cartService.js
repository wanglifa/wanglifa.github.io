import fetch from 'js/fetch.js'
import url from 'js/api.js'

let Cart = {
    add(id){
        return fetch(url.add,{
            id,
            number: 1
        })
    },
    reduce(id){
        return fetch(url.reduce,{
            id,
            number: 1
        })
    }
}
    

export default Cart