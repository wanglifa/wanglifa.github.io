import AddressData from 'js/address.json'
import Address from 'js/addressService.js'
export default {
    data(){
        return {
            name: '',
            tel: '',
            id: '',
            provinceValue: -1,
            cityValue: -1,
            districtValue: -1,
            address: '',
            type: '',
            instance: null,
            addressData: null,
            cityName: null,
            districtName: null
        }
    },
    created(){
        let query = this.$route.query
        this.type = query.type
        this.instance = query.instance
        this.addressData = AddressData.list
        if(this.type === 'edit'){
            let ad = this.instance
            this.provinceValue = parseInt(ad.provinceValue)
            this.name = ad.name
            this.tel = ad.tel
            this.address = ad.address
            this.id = ad.id
        }
    },
    computed: {
        lists(){
            return this.$store.state.lists
        }
    },
    watch: {
        provinceValue(val){
            if(val === -1) return
            let list = this.addressData
            // 找到provinceValue为你选中list中的当前val值的索引
            let index = list.findIndex(item=>{
                return item.value === val
            })
            //城市的数据就在当前索引值下的children
            this.cityName = list[index].children
            //每次选中后初始化
            this.cityValue = -1
            this.districtValue = -1
            if(this.type === 'edit'){
                this.cityValue = parseInt(this.instance.cityValue)
                if(val !== parseInt(this.instance.provinceValue)){
                    this.cityValue = -1
                    this.districtValue = -1
                }
            }
            
        },
        cityValue(val){
            if(val === -1) return
            let list = this.cityName
            // 找到provinceValue为你选中list中的当前val值的索引
            let index = list.findIndex(item=>{
                return item.value === val
            })
            //城市的数据就在当前索引值下的children
            this.districtName = list[index].children
            //每次选中后初始化
            this.districtValue = -1
            if(this.type === 'edit'){
                this.districtValue = parseInt(this.instance.districtValue)
                if(val !== parseInt(this.instance.cityValue)){
                    this.districtValue = -1
                }
            }
        },
        lists :{
            handler(){
                this.$router.go(-1)
            },
            deep: true
        }
    },
    methods: {
        add(){
            let {name, tel, provinceValue, cityValue, districtValue, address} = this
            let data = {name, tel, provinceValue, cityValue, districtValue, address}
            data.id = this.id
            if(this.type === 'add'){
                // Address.add(data).then(res=>{
                //     //跳到上一页
                //     this.$router.go(-1)
                // })
                this.$store.dispatch('addAction',data)
            }
            if(this.type === 'edit'){
                // Address.update(data).then(res=>{
                //     this.$router.go(-1)
                // })
                this.$store.dispatch('updateAction', data)
            }
        },
        remove(){
            if(window.confirm('确定删除？')){
                // Address.remove(this.id).then(res=>{
                //     this.$router.go(-1)
                // })
                this.$store.dispatch('removeAction',this.id)
            }
        },
        setDefault(){
            // Address.setdefault(this.id).then(res=>{
            //     this.$router.go(-1)
            // })
            this.$store.dispatch('setAction',this.id)
        }
    }
}