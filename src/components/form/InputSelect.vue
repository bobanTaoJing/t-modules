<template>
    <div  @click.stop="showTree=!showTree">
        <Input v-model="name" placeholder="请选择..." @on-change="changeName">
                <Icon type="ios-arrow-down" slot="suffix" />
            </Input>
           <div v-show="showTree" class="ivu-select-dropdown selectTree">
               <p v-for="(item,index) in data" :key="index" class=" tree-item-p" @click.stop="changeIndex(item)">{{item[textField]}}</p>
               <p v-show="total>data.length">
                   <Button :loading="loading" @click.stop="pageIndex++;queryData()">查询更多</Button>
               </p>
           </div>
    </div>
</template>
<script>
export default {
    name:'InputSelect',
    props:{
        value:{},
        valField: {
            default: 'id'
        },
        textField: {
            default: 'name'
        },
        dataUrl:{},
        pageIndexField:{
            default:'pageIndex'
        },
        pageSizeField:{
            default:'pageSize'
        },
        dataUrlType:{
            defualt:'get'
        },
        headers:{},
        paramStr:{
            default:'id'
        },
        paramsFun:{

        },
        resFun:{
            default:(res)=>{
                return []
            }
        }
    },
    model: {
        prop: 'value',
        event: 'change'
    },
    data(){
        return{
            name:'',
            showTree:false,
            data:[],
            pageSize:20,
            pageIndex:1,
            total:0,
            queryCount:0,
            loading:false
        }
    },
    mounted(){
        // if(this.value){
        //     this.findName(this.data)
        //     this.$refs.tree1.checkIndex=this.value
        // }
        this.queryData()
    },
    methods:{
        changeShowTree(){
            this.showTree = false
        },
        changeIndex(item){
            this.$emit('change',item[this.valField])
            this.name=item[this.textField]
            this.showTree = false
        },
        changeName(){
            this.pageIndex =1
            this.showTree = true
            this.queryData()
        },
        queryData(){
            this.queryCount++
            let count = this.queryCount
            this.loading = true
            let params = {}
            params[this.pageIndexField] = this.pageIndex
            params[this.pageSizeField] = this.pageSize
            params[this.paramStr] = this.name
            if(this.dataUrlType=='get'){
                params = {params,headers:this.headers}
            }
            this.$http[this.dataUrlType](this.dataUrl,params,{headers:this.headers})
                .then(res=>{
                    if(this.queryCount == count){
                        this.loading = false
                        if(this.pageIndex==1){
                            let data = this.resFun(res)
                            this.data = data.data
                            this.total = data.total
                        }else{
                            let data = this.resFun(res)
                            this.data = this.data.concat(data.data)
                            this.total = data.total
                        }
                    }
                })

        }
        
    },
    watch:{
    }
}
</script>
<style scoped>
.selectTree{
    height: 200px;
    position: absolute;
    min-width: 100%;
    width: max-content;
    padding-left:5px;
    /* width: 100%; */
    /* z-index: 1; */
    cursor: pointer;
}
</style>