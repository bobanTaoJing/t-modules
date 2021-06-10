<template>
    <div  @click.stop="showTree=!showTree">
        <Input v-model="name" placeholder="请选择..." readonly>
                <Icon type="ios-arrow-down" slot="suffix" />
            </Input>
            <ttree v-show="showTree" ref="tree1" class="selectTree ivu-select-dropdown" :data.sync="data" @click.native.stop=";" @changeIndex="changeIndex"></ttree>
    </div>
</template>
<script>
import ttree from '../ttree/main.vue'
export default {
    name:'TreeSelect2',
    components:{ttree},
    props:{
        value:{},
        data:{},
        valField: {
            default: 'id'
        },
        textField: {
            default: 'name'
        },
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data(){
        return{
            name:'',
            showTree:false
        }
    },
    mounted(){
        if(this.value){
            this.findName(this.data)
            this.$refs.tree1.checkIndex=this.value
        }
    },
    methods:{
        changeShowTree(){
            this.showTree = false
        },
        changeIndex(index,item){
            console.log(index)
            console.log(item)
            this.$emit('change',item[this.valField])
            this.name=item[this.textField]
            this.showTree = false
        },
        findName(arr){
            let find = false
            for(let a of arr){
                if(a.id==this.value){
                    this.name = a[this.textField]
                    find = true
                    return
                }
                if(a.children&&!find){
                    this.findName(a.children)
                }
            }
        }
    },
    watch:{
        value(){
            if(this.value){
            this.findName(this.data)
            this.$refs.tree1.checkIndex=this.value
            }
        },
        data(){
            if(this.value){
            this.findName(this.data)
            this.$refs.tree1.checkIndex=this.value
            }
        }
    }
}
</script>
<style scoped>
.selectTree{
    height: 200px;
    position: absolute;
    min-width: 100%;
    width: max-content;
    /* width: 100%; */
    /* z-index: 1; */
}
</style>