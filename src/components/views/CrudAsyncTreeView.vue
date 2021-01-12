<template>
<Row class="curd-view main-view" :class="{'main-view-full': full}">
    <!--左边树-->
    <i-col v-if="treeOptions&&reflash1" :xs="8" :sm="4" :md="5" :lg="5" class="curd-view-left-col" :class="{'curd-view-full': full}">
        <AsyncTree ref="asyncTree" @onSelectChange="onSelectChange" 
        :treeOptions="treeOptions">
        </AsyncTree>
    </i-col>
    <!--左边树结束-->
    <!--右边信息栏-->
    <i-col :xs="rightSpan(16)" :sm="rightSpan(20)" :md="rightSpan(19)" :lg="rightSpan(19)" :xs-offset="8" :sm-offset="8" :md-offset="8" :lg-offset="8" class="curd-view-right-col" :class="{'curd-view-full': full}">
        <template v-if="tableOptions&&reflash2">
            <!--数据表格开始-->
            <CrudView ref="crudView" :tableOptions="tableOptions">
                <template slot="toolbar">
                </template>
            </CrudView>
            <!--数据表格结束-->

            <slot name='append'>
            </slot>
        </template>

    </i-col>
    <!--右边信息栏结束-->
</Row>
</template>

<script>
import {
    AsyncTree,
    CrudView,PopupEdit
} from '../../components/index';
import * as tools from '../../utils/tools'
import utils from '../../utils/common';
export default {
    props: {
        full: {
            type: Boolean,
            default: true
        },
        tableOptionsJson:{
            type:String
        }
    },
    data() {
        return {
            tableOptions:{},
            treeOptions: {},
            reflash1: true,
            reflash2: true,
            selectedTreeData:{},
            treeData:[],
            close:false,
            editLoading:false
        }
    },
    created(){
        this.getTableJson()
        this.getTreeJson()
    },
    methods: {
        rightSpan(span) {
            if (this.treeOptions == null) {
                return 24;
            } else {
                return span;
            }
        },
        onSelectChange(data,treeData) {
            this.selectedTreeData=data
            this.treeData=treeData
            this.getTableJson(data.level)
        },
        getTableJson(index=0) {
            this.tableOptions={}
            //深度拷贝
            this.tableOptions = tools.deepCopy(this.$jsonOption['crudAsyncTreeView'][this.tableOptionsJson]['table'][index])
            if(this.selectedTreeData){
                for(let a of this.tableOptions.editOptions.dynamic){
                    for(let c of a){
                        if(c.valueByTree){
                            if(c.valFieldTree) c.value=this.selectedTreeData[c.valFieldTree]
                            if(c.textField) c.value=this.selectedTreeData[c.textField]
                        }
                    }
                }
            }
            
            // popupEdit dataFrom
            console.log(this.tableOptions)
            this.reflash2 = false
            setTimeout(() => {
                this.reflash2 = true
            }, 100)
        },
        getTreeJson(index=0){
            this.treeOptions=this.$jsonOption['crudAsyncTreeView'][this.tableOptionsJson]['tree'][index]
            this.reflash1 = false
            setTimeout(() => {
                this.reflash1 = true
            }, 100)
        }
    },
    components: {
        AsyncTree,
        CrudView,
        PopupEdit
    },
}
</script>

<style scoped>
.curd-view-left-col {
    padding: 10px 8px 0px 0px;
    /*border-right: #F5F7F9 2px solid;*/
}

.curd-view-right-col {
    padding: 10px 20px;
    margin-left: -2px;
    /*border-left: #F5F7F9 2px solid;*/
}

.tree-toolbar {
    padding: 6px 2px 10px 2px;
}

.curd-view {}
</style>
