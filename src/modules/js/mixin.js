import Foot from 'components/Foot.vue'
let mixin = {
    filters: {
        priceNum(value){
            let newValue = value + '';
            if(newValue.indexOf('.') !== -1){
                let arr = newValue.split('.')
                return arr[0] + '.' + (arr[1]+ '0').substring(0,2)
            }else{
                return value + '.00'
            }
        }
    },
    components: {
        Foot
    }
}
export default mixin