<template>
<div>
    <div class="ivu-form" style="width:550px;margin:0 auto;">
        <div>
            <FormDynamic v-show="showDatasource" ref="dynamicOne" @changeSelect="changeSelect" :data="dynamicOne" :label-width="100">
                <template slot="append">
                </template>
            </FormDynamic>
            <FormDynamic v-show="showSchema" ref="dynamicTwo" @changeSelect="changeSelect2" :data="dynamicTwo" :label-width="100">
                <template slot="append">
                </template>
            </FormDynamic>
            <FormDynamic ref="dynamicThree" @changeSelect="changeSelect3" :data="dynamicThree" :label-width="100">
                <template slot="append">
                </template>
            </FormDynamic>
            <div class="ivu-form-item ivu-form-item-required">
                <label class="ivu-form-item-label" style="width:100px">
                    选择字段
                </label>
                <div class="ivu-form-item-content data-tree-panel" :title="properLoading?'正在加载':''" style="margin-left:100px;">
                    <Table :columns="columns.columns1" ref="table" :data="proData" :height="300"
                    @on-selection-change="selectionChange"
                     :loading="loadingTable"></Table>
                </div>
            </div>
        </div>
    </div>
    <p class="autocreate-foot" style="text-align:center;">
        <slot name="action"></slot>
        <i-button @click="nextstep(1)" type="primary" :disabled="loadingTable" :loading="loading">
            <span>替换</span>
        </i-button>
        <i-button @click="nextstep(2)" type="primary" class="add" style="margin:0 5px">
            <span>添加</span>
        </i-button>
    </p>
</div>
</template>

<script>
import {
    FormDynamic,
} from '../../../../../components/index';
import columns from './columns'

export default {
    props: {
        showDatasource:{
            default:true
        },
        showSchema:{
            default:true
        },
        loading:{

        },
        projectId:{
            default:''
        },
        ip:{},
        headers:{}
    },
    data() {
        return {
            data:{},
            fsourceId: null,
            fschemaId: null,
            fschemaName: null,
            dynamicOne: [],
            dynamicTwo: [],
            dynamicThree: [],
            first: true,
            sources:[],
            schemas:[],
            tables: [],
            proData:[],
            checkedNodes: [],
            properLoading:false,
            columns,
            loadingTable:false,
            selection:[]
        }
    },

    computed: {
        schemaId() {
            let data2 = this.$refs.dynamicTwo.getData()
            return data2.schemaId
        }
    },

    created() {
        this.dynamicOne = [
            [{
                name: 'datasourceId',
                type: 'select',
                span: 24,
                label: '数据源',
                textField: 'title',
                valField: 'id',
                clearable: false,
                data: [],
                rules: {
                    required: true
                }
            }]
        ]
        this.dynamicTwo = [
            [{
                name: 'schemaId',
                type: 'select',
                span: 24,
                label: 'schema',
                clearable: false,
                data: [],
                rules: {
                    required: true
                }
            }]
        ]
        this.dynamicThree = [
            [{
                name: 'tableId',
                type: 'select',
                span: 24,
                label: '表',
                clearable: false,
                data: [],
                rules: {
                    required: true
                }
            }]
        ]
    },

    methods: {
        inCome(data){
            console.log(data)
            this.first = true
            this.fsourceId = null
            this.fschemaId = null
            this.fschemaName = null
            this.data = data
            if (this.data) {
                if (this.data.level == 0) {
                    this.fsourceId = this.data.id
                } else if (this.data.level == 1) {
                    this.fschemaName = this.data.title
                    this.fschemaId = this.data.id
                    this.fsourceId = this.data.parent.id
                } else if (this.data.level == 2) {
                    this.fschemaName = this.data.parent.title
                    this.fschemaId = this.data.parent.id
                    this.fsourceId = this.data.parent.parent.id
                }
            }
            this.getSource()
            .then(res => {
                this.getSchema(res.url,res.id)
                    .then(res2 => {
                        this.getTablesBySource(res2.url,res2.id)
                            .then(id=>{
                                this.getPro(id)
                            })
                    })
            })
        },
        nextstep(type) {
            if(this.selection.length>0)
            this.$emit('output',this.selection,type)
            else
            this.$Message.warning('请选择字段!')
        },
        selectionChange(selection){
            this.selection = selection
            console.log(this.selection)
        },
        //获取数据源
        getSource() {
            this.sources = []
            return new Promise((resolve, reject) => {
                this.$http.apiGet(this.ip + '/resource/metadata/tree?parentId='+this.projectId,{
                    headers:this.headers
                })
                    .then(res => {
                        if (res.success) {
                            this.sources = res.data.rows
                            let data = []
                            for(let a of res.data.rows){
                                data.push(a)
                            }
                            this.dynamicOne[0][0].data = data
                            console.log(data)
                            if (this.fsourceId) {
                                this.$refs.dynamicOne.setFormData({
                                    datasourceId: this.fsourceId
                                })
                                for (let a of res.data.rows) {
                                    if (a.id == this.fsourceId) {
                                        resolve({
                                            id:a.id,
                                            url: a.treeUrl
                                        })
                                    }
                                }
                            } else
                            if (res.data.rows.length > 0) {
                                this.$refs.dynamicOne.setFormData({
                                    datasourceId: res.data.rows[0].id
                                })
                                resolve({
                                    id:res.data.rows[0].id,
                                    url: res.data.rows[0].treeUrl
                                })
                            } else {
                                reject()
                            }
                        } else {
                            this.$Message.error('获取数据源失败！')
                            reject()
                        }
                    })
            })
        },
        //获取schema
        getSchema(url, id) {
            if(!url) return
            return new Promise((resolve, reject) => {
                this.dynamicTwo[0][0].data = []
                this.$http.apiGet(this.ip + url,{
                    params:{
                        datasourceId: id
                    },
                    headers:this.headers
                })
                    .then(res => {
                        if (res.success) {
                            if(res.data.rows){
                                let arr=[],schemas = res.data.rows
                                this.schemas =res.data.rows
                                for(let a of schemas){
                                    arr.push({label:a.title,value:a.id})
                                }
                                this.dynamicTwo[0][0].data = arr
                                if (schemas.length > 0) {
                                    this.$nextTick(()=>{
                                        this.$refs.dynamicTwo.setFormData({
                                            schemaId: schemas[0].id
                                        })
                                        resolve({
                                            id:schemas[0].id,
                                            url: schemas[0].treeUrl
                                        })
                                    })
                                } else {
                                    this.$Message.warning('选中的数据源下无schema!')
                                    reject()
                                }
                            }else{
                                this.dynamicTwo[0][0].data = []
                                resolve()
                            }
                        } else {
                            this.$Message.error('获取schema失败！')
                            reject()
                        }
                        this.first = false
                    })
            })
        },
        //获取对应数据源和schema的表
        getTablesBySource(url, id) {
            this.tables = []
            this.dynamicThree[0][0].data = []
            if(!url) return
            return new Promise((resolve, reject) => {
                this.$http.apiGet(this.ip+url,{
                    headers:this.headers
                })
                    .then(res => {
                        if (res.success){
                            this.tables = res.data.rows
                            let arr = []
                            for(let a of res.data.rows){
                                arr.push({
                                    label:a.title,
                                    value:a.id
                                })
                            }
                            this.dynamicThree[0][0].data = arr
                            if (this.tables.length > 0) {
                                this.$nextTick(()=>{
                                    this.$refs.dynamicThree.setFormData({
                                        tableId: this.tables[0].id
                                    })
                                })
                                resolve(this.tables[0].id)
                            } else {
                                this.$Message.warning('选中的数据源下无表!')
                                resolve()
                            }
                        }
                        else {
                            this.$Message.error(res.message?res.message:'获取表数据失败！')
                            reject()
                        }
    
                    })
                    .finally(()=>{
                    })
            })
        },
        //获取字段
        getPro(objectId){
            if(!objectId) return
            this.loadingTable = true
            this.proData = []
            this.$http.apiPost(this.ip+'/resource/metadata/basic/property/list',{objectId},{
                headers:this.headers
            })
                .then(res=>{
                    this.loadingTable = false
                    if(res.success){
                        let arr = res.data.rows
                        let merp ={
                            VARCHAR:'string',
                            STRING:'string',
                            BOOLEAN:'boolean',
                            TINYINT:'byte',
                            BYTE:'byte',
                            SMALLINT:'short',
                            SHORT:'short',
                            BIGINT:'big_int',
                            LONG:'ong',
                            FLOAT:'float',
                            DOUBLE:'double',
                            DECIMAL:'big_dec',
                            DATE:'date',
                            TIMESTAMP:'sql_timestamp',
                            BIG_DEC:'big_dec',
                            INT:'int',
                            BYTES:'byte_array',
                            CHAR:'char',
                        }
                        for(let a of arr){
                            a.type = merp[a.dataTypeName]?merp[a.dataTypeName]:''
                        }
                        this.proData = arr
                    }
                })
                .finally(()=>{
                    this.loadingTable = false
                })
        },
        changeSelect() {
            let data = this.$refs.dynamicOne.getData()
            this.$refs.dynamicTwo.reset()
            this.$refs.dynamicThree.reset()
            this.dynamicTwo[0][0].data = []
            this.dynamicThree[0][0].data = []
            this.proData = []
            for(let a of this.sources){
                if(a.id == data.datasourceId){
                    this.getSchema(a.treeUrl,a.id)
                        .then(res=>{
                            this.getTablesBySource(res.url,res.id)
                             .then(id=>{
                                 this.getPro(id)
                             })
                        })
                    return
                }
            }
        },
        changeSelect2() {
            let data = this.$refs.dynamicTwo.getData()
            this.$refs.dynamicThree.reset()
            this.dynamicThree[0][0].data = []
            this.proData = []
            for(let a of this.schemas){
                if(a.id == data.schemaId){
                    this.getTablesBySource(res.url,res.id)
                        .then(id=>{
                            this.getPro(id)
                        })
                    return
                }
            }
        },
        changeSelect3(){
            this.proData = []
            let data = this.$refs.dynamicThree.getData()
            this.getPro(data.tableId)
        }
    },
    watch:{
        proData(){
            this.selection = []
        }
    },

    components: {
        FormDynamic
    }
}
</script>

<style>
    .autocreate-tree-none-margin ul li{
        margin:0 !important;
    }
</style>
