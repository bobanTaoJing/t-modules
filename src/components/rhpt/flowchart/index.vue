<template>
    <div>
        <CrudView v-show="!showEditor" ref='crudView' :tableOptions='tableOptions'>
            <template slot='toolbar'>
                <Button class="add" icon="ios-add" ghost type='primary' shape="circle" @click="isAdd=true,checked={},showEditor=true">新增</Button>
            </template>
        </CrudView>
        <div v-if="showEditor">
            <div style="height:45px;line-height:45px;padding-left:5px;">
                <i-button type="primary" shape="circle" @click="showEditor=false,$refs.crudView.refreshTable()">返回</i-button>
                <span style="font-size: 18px;margin-left: 10px;vertical-align: sub;">{{isAdd?'新增':'编辑 -- '}}{{checked.name}}</span>
            </div>
            <editor ref="editor" :checked="checked" :isAdd="isAdd" :showEditor="showEditor" v-if="showEditor"></editor>
        </div>
    </div>
</template>
<script>
import {
    CrudView,
    DataTree,
    FormDynamic,ChartDoubleLine
} from '../../components/';
import editor from './editor'
export default {
    components:{CrudView,editor},
    props:{
        ip:{

        },
        headers:{
            type:Object,
            default:()=>{
                return{
                    Authorization:''
                }
            }
        }
    },
    data(){
        return {
            tableOptions:{},
            showEditor:false,
            isAdd:true,
            checked:{},
        }
    },
    created(){
        this.tableOptions = {
            selection: [],
            pageSize: 20,
            labelWidth: 70,
            title: '数据流程',
            permsPrefix: 'role',
            // editOptions: tableEditOptions,
            dataUrl: this.ip + '/job/stream/node/config/list',
            // dataUrlType: 'get',
            // createUrl: '/dg/serviceConfig/create',
            deleteUrl: this.ip + '/job/stream/node/config/delete',
            // updateUrl: '/dg/serviceConfig/update',
            hiddenEdit: true,
            showAction: false,
            param: {},
            headers:this.headers,
            columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    key: 'name',
                    title: '名称',
                    align: 'left',
                },
                {
                    key: 'createTime',
                    title: '创建时间',
                    align: 'left',
                },
                {
                    key: 'creatorName',
                    title: '创建人',
                    align: 'left',
                },
                {
                    key: 'lastModifyTime',
                    title: '更新时间',
                    align: 'left',
                },
                {
                    key: 'lastModifierName',
                    title: '更新人',
                    align: 'left',
                },
                { //没有该字段 显示所有默认按钮
                    title: '操作',
                    width: '100',
                    columns: [{
                            name: '编辑',
                            // collapse: true,
                            click: (params) => {
                                console.log('编辑')
                                this.isAdd = false
                                this.checked = params.row
                                let nodeDataArray = [],linkDataArray=[]
                                for(let a of this.checked.nodes){
                                    nodeDataArray.push(JSON.parse(a.nodeInfo))
                                }
                                for(let a of this.checked.edges){
                                    linkDataArray.push({
                                        from:a.source,
                                        to:a.target
                                    })
                                }
                                this.showEditor = true
                                this.$nextTick(()=>{
                                    this.$refs.editor.load({
                                        nodeDataArray,linkDataArray
                                    })
                                })
                                
                            }
                        },
                    ],
                }
            ],
            searchDynamic: [
                [{
                        name: 'name',
                        type: 'text',
                        span: 6,
                        label: '名称'
                    }
                ]
            ]
        }
    },
}
</script>