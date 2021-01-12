<template>
<div>
    <ivSearch :params="searchParams" @getData="page=1,getData()"></ivSearch>
    <Table :columns="hcolumns" :data="tableData" @on-selection-change="onSelectionChange"  :loading="loading" :height="height"></Table>
    <div v-if="showPage" style="text-align:center;height:50px;line-height:50px;">
        <Page @on-change="pageChange" @on-page-size-change="pageSizeChange" :current="page" :total="total" :page-size="pageSize" show-sizer :page-size-opts="[10,20,40,60]" />
    </div>
</div>
</template>

<script>
//表格
import ivSearch from '../common/ivSearch'
export default {
    props:{
        //表格高度
        height:{
            type:[String,Number],
            default:400
        },
        //表格结构
        columns:{
            type:Array,
            default:function(){
                return []
            }
        },
        //表格数据
        tableData:{
            type:Array,
            default:function(){
                return []
            }
        },
        //总页数
        total:{
            type:Number,
            default:0
        },
        //显示分页
        showPage:{
            type:Boolean,
            default:false
        },
        //搜索项
        searchParams:{
            type:Array,
            default:()=>{
                return []
            }
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    components:{ivSearch},
    data() {
        return {
            hcolumns:[],
            selection:[],
            page:1,
            pageSize:20
        }
    },
    mounted(){
        this.handleColumns()
        this.getData()
    },
    methods:{
        onSelectionChange(selection){
            this.selection = selection
            console.log(selection)
        },
        pageChange(value){
            this.page = value
            this.getData()
        },
        pageSizeChange(value){
            this.pageSize = value
            this.getData()
        },
        getData(){
            let params = {
                page: this.page,
                pageSize: this.pageSize
            }
            for(let a of this.searchParams){
                if(a.type=='DatePicker'){
                    let format = a.format?a.format:'YYYY-MM-DD'
                    if(a.type2=='daterange'||a.type2=='datetimerange'){
                        params[a.key] = 
                        [
                            !!a.value[0]?this.$day(a.value[0]).format(format):'',
                            !!a.value[1]?this.$day(a.value[1]).format(format):''
                        ]
                    }else{
                        params[a.key] = a.value?this.$day(a.value).format(format):''
                    }
                }else{
                    params[a.key] = a.value
                }
            }
            this.$emit('getData',params)
        },
        handleColumns(){
            let hcolumns = []
            for(let a of this.columns){
                if(a.type=='index'){
                    a.type = ''
                    a.render=(h,params)=> {
                        return h('div',(this.page-1)*this.pageSize+params.index+1)
                    }
                }
                if(a.minWidth===undefined){
                    a.minWidth=100
                }
                if(!a.hidden)
                hcolumns.push(a)
            }
            this.hcolumns = hcolumns
        }
    },
    watch:{
        columns:{
            handler(){
                this.handleColumns()
            },
            deep:true
        }
    }
}
</script>
