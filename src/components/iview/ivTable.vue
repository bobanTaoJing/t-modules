<template>
<div>
    <Table :columns="columns" :data="tableData" @on-selection-change="onSelectionChange"  :loading="loading" :height="height"></Table>
    <!-- <div v-if="showPage" style="text-align:center;height:50px;line-height:50px;">
        <Page @on-change="pageChange" @on-page-size-change="pageSizeChange" :current="current" :total="total" :page-size="pageSize" show-sizer :page-size-opts="[10,20,40,60]" />
    </div> -->
</div>
</template>

<script>
export default {
    props:{
        height:{
            type:[String,Number],
            default:400
        },
        loading:{
            type:Boolean,
            default:false
        },
        columns:{
            type:Array,
            default:function(){
                return []
            }
        },
        tableData:{
            type:Array,
            default:function(){
                return []
            }
        },
        showPage:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            selection:[],
        }
    },
    mounted(){
    },
    methods:{
        onSelectionChange(selection){
            this.selection = selection
            console.log(selection)
        },
    }
}
</script>
