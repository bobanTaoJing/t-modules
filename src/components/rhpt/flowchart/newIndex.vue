<template>
    <div>
        <CrudView v-show="!showEditor" ref='crudView' :tableOptions='tableOptions'>
            <template slot='toolbar'>
                <Button icon="ios-add" ghost type='primary' shape="circle" @click="modal1=true">新增</Button>
            </template>
        </CrudView>
        <div v-if="showEditor">
            <div style="height:45px;line-height:45px;padding-left:5px;">
                <i-button type="primary" shape="circle" @click="showEditor=false,$refs.crudView.refreshTable()">返回</i-button>
                <template v-if="runTime" style="font-size: 18px;margin-left: 10px;vertical-align: sub;">
                    <span>{{checked.name}}</span>
                    <Input v-model="jobId" placeholder="jobId" style="width: 300px" />
                    <DatePicker v-model="date" type="datetimerange" placeholder="Select date" style="width: 300px"></DatePicker>
                    <Button @click="save">确定</Button>
                </template>
                <span v-else style="font-size: 18px;margin-left: 10px;vertical-align: sub;">{{isAdd?'新增':'编辑 -- '}}{{checked.name}}</span>
            </div>
            <editor ref="editor" :ip="ip" :headers="headers" @updateSuc="updateSuc" :checked="checked" :isAdd="isAdd" :jobItem="context" :runTime="runTime" v-if="showEditor"></editor>
        </div>
        <Modal
            v-model="modal1"
            title="请先选择所属项目">
            <FormDynamic ref="projectForm" :data="dynamic" :label-width="100"></FormDynamic>
            <p slot="footer">
                <Button @click="ok">确定</Button>
            </p>
        </Modal>
        <runTime ref="runTime"/>
        <!-- 定时任务 -->
        <Modal :title="'定时任务'" class="popup-edit-modal" v-model='close3' :width='1000' :styles="{top: '20px'}">
            <timedtask v-if="close3" :ip="ip" :headers="headers" :topicId="topicId" :group="'STREAM'"/>
        </Modal>
    </div>
</template>
<script>
import {
    CrudView,
    DataTree,
    FormDynamic,ChartDoubleLine
} from '../../../components/';
import editor from '../../../components/g6-editor/App.vue'
import runTime from './newIndex/runTime'
import timedtask from '../timedtask/index'
export default {
    name:'Flowchart',
    components:{CrudView,editor,FormDynamic,runTime,timedtask},
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
            runTime:false,
            modal1:false,
            dynamic: [
                [{
                    name: 'projectId',
                    type: 'select',
                    span: 24,
                    clearable:false,
                    label: '所属项目',
                    valField:'id',
                    textField:'name',
                    dataUrl: this.ip+'/admin/api/sys/project/list',
                    headers:this.headers,
                    param:{sortField:'id',sortOrder:'asc'},
                    value:1,
                    rules:{
                        required:true,
                        type:'number'
                    }
                }]
            ],
            jobId:'',
            date:[new Date((new Date().getTime() - 30*60*1000)),new Date()],
            context:{},
            close3:false,
            topicId:''
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
                    key: 'projectId',
                    title: '所属项目',
                    align: 'center',
                    queryEnum:{
                        url:this.ip +'/admin/api/sys/project/list'
                    }
                    // width: 110
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
                    width: '310',
                    columns: [{
                            name: '运行',
                            // collapse: true,
                            click: (params) => {
                                this.$http.apiPost(this.ip+'/job/stream/node/config/submit',{streamConfigId:params.row.id})
                                    .then(res=>{
                                        if(res.success){
                                            this.$Message.success('运行成功！')
                                        }else{
                                            this.$Message.error('运行失败！')
                                        }
                                        })
                            }
                        },{
                            name: '定时运行',
                            // collapse: true,
                            click: (params) => {
                                this.$refs.runTime.init(params.row)
                            }
                        },{
                            name: '查看定时任务',
                            // collapse: true,
                            click: (params) => {
                                this.topicId = params.row.id
                                this.close3 = true
                            }
                        },{
                            name: '查看运行状态',
                            // collapse: true,
                            click: (params) => {
                                this.runTime = true
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
                            }
                        },{
                            name: '编辑',
                            // collapse: true,
                            click: (params) => {
                                console.log('编辑')
                                this.runTime = false
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
                                
                            }
                        },
                    ],
                }
            ],
            searchDynamic: [
                [{
                        name: 'projectId',
                        type: 'select',
                        span: 6,
                        label: '所属项目',
                        valField:'id',
                        textField:'name',
                        dataUrl: this.ip +'/admin/api/sys/project/list',
                        headers:this.headers,
                        param:{sortField:'id',sortOrder:'asc'}
                    },{
                        name: 'name',
                        type: 'text',
                        span: 6,
                        label: '名称'
                    }
                ]
            ]
        }
    },
    methods:{
        save(){
            if(this.jobId&&this.date[0]&&this.date[1]){
                this.context.jobId = this.jobId
                console.log(this.date)
                let start = new Date(this.date[0]).getTime()/1000
                let end = new Date(this.date[1]).getTime()/1000
                this.handleTime(start,end)
                this.showEditor = false
                setTimeout(()=>{
                    this.showEditor =true
                },10)
            }
        },
        handleTime(startb,endb){
            console.log(startb,endb)
            let lineXdata = []
            let lineXdata2 = []
            let lineValue = []
            let start = startb-60
            let end = ((endb+60 - start)>3600)?(startb+3660):(endb+60)
            let sstart = start
            for(;sstart<=end;sstart++){
                let date = new Date(sstart*1000)
                lineXdata.push(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())
                lineXdata2.push(sstart)
                lineValue.push('')
            }
            this.context.lineXdata = lineXdata
            this.context.lineXdata2 = lineXdata2
            this.context.lineValue = lineValue
            this.context.start = start
            this.context.end = end
        },
        ok(){
            this.$refs.projectForm.submit(params=>{
                this.isAdd=true
                this.checked={projectId:params.projectId}
                this.runTime = false
                this.showEditor=true
                this.modal1 = false
            })
        },
        updateSuc(obj){
            this.isAdd = false
            if(obj.type==1)
                this.$set(this.checked,'name',obj.name)
            else if(obj.type==2){
                this.$set(this.checked,'id',obj.id)
                this.$set(this.checked,'name',obj.name)
                
            }
        }
    }
}
</script>