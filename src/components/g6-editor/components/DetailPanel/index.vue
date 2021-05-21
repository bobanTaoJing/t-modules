<template>
<div class="detailpannel">
    <div style="height:100%">
        <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
            <div class="pannel-title">节点详情</div>
            <div class="block-container">
                <Row :gutter="10">
                    <!-- <i-col :span="8">名称</i-col> -->
                    <i-col :span="24">
                        <span style="width:50px;display:inline-block;float:left">名称:</span>
                        <span style="font-size: 14px;font-weight: 600;line-height: 14px;">{{node.label}}</span>
                        <!-- <i-input style="width:calc(100% - 50px)" :disabled="true" v-model="node.label" @change="handleChangeName" /> -->
                    </i-col>
                    <!-- <i-col :span="24">
                        <div style="padding:5px 0;">其他属性</div>
                    </i-col> -->
                    <i-col :span="24" v-if="node.insert_data.needDataSource">
                        <FormDynamic ref="savedataSource" :data="dynamicSource" :label-width="50"></FormDynamic>
                    </i-col>
                    <i-col :span="24" style="position:relative">
                        <Spin size="large" fix v-if="loadingForm"></Spin>
                        <FormDynamic ref="savedata" :data="dynamic" :label-width="50"></FormDynamic>
                    </i-col>
                    <template v-if="node.insert_data.isAutoLoadSchema">
                        <i-col :span="24">
                            <span style="margin-top:30px;">输入</span>
                            <EditTable :columns="editoTableColums" :deleteTip="false" :height="400" ref="inEditTable" style="padding:0;width:100%" :disabled="true" :showSerial="false" :showTopd="false">
                                <template slot="button">
                                </template>
                            </EditTable>
                        </i-col>
                        <i-col :span="24">
                            <span style="margin-top:30px;">输出</span>
                            <EditTable :columns="editoTableColums" :deleteTip="false" :height="400" ref="outEditTable" style="padding:0;width:100%" :disabled="true" :showSerial="false" :showTopd="false">
                                <template slot="button">
                                </template>
                            </EditTable>
                        </i-col>
                    </template>
                    <template v-else>
                        <i-col :span="24" v-show="node.insert_data.type!='SINK'">
                            <span style="margin-top:30px;">模式</span>
                            <EditTable :columns="editoTableColums" :deleteTip="false" :height="400" ref="editTable" style="padding:0;width:100%" :disabled="false" :showSerial="false" :showTopd="false">
                                <template slot="button">
                                    <Button style="margin-left:10px;" @click="showPLDR">批量导入</Button>
                                </template>
                            </EditTable>
                            <copyTable @output="output" ref="copyTable"/>
                        </i-col>
                    </template>
                </Row>
            </div>
            <p style="border-top:1px solid #ddd;height:30px;line-height:30px;text-align:center">
                <Button size="small" type="primary" @click="save">确定</Button>
            </p>
        </div>
        <div v-else-if="status=='edge-selected'" class="pannel" id="node_detailpannel">
            <div class="pannel-title">线详情</div>
            <div class="block-container">
                <Row :gutter="10">
                    <i-col :span="24">
                        <span style="width:50px;display:inline-block;float:left">起点:</span>
                        <span style="font-size: 14px;font-weight: 600;line-height: 14px;">{{node.source.name}}</span>
                    </i-col>

                    <i-col :span="24">
                        <span style="width:50px;display:inline-block;float:left">终点:</span>
                        <span style="font-size: 14px;font-weight: 600;line-height: 14px;">{{node.target.name}}</span>
                    </i-col>
                    <i-col :span="24">
                        <span style="width:50px;display:inline-block;float:left">操作名称:</span>
                        <!-- <span style="font-size: 14px;font-weight: 600;line-height: 14px;">{{node}}</span> -->
                    </i-col>
                    <!-- <i-col :span="8">其他属性</i-col> -->
                    <!-- <i-col :span="16">
              <i-input v-model="node.xxx" />
            </i-col> -->
                </Row>
            </div>
        </div>
        <div v-if="status==='canvas-selected'" class="pannel" id="canvas_detailpannel">
            <div class="pannel-title">画布</div>
            <div class="block-container">
                <Checkbox v-model="showGrid" @on-change="changeGridState">网格对齐</Checkbox>
            </div>
        </div>
        <!-- <div v-if="status==='group-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">群组详情</div>
        <div class="block-container">
          <div class="p">
            名称：
            <i-input v-model="name" />
          </div>
          <div class="p">
            任意属性：
            <i-input v-model="color" />
          </div>
        </div>
      </div>
      -->
    </div>
</div>
</template>

<script>
import eventBus from "../../../../components/g6-editor/utils/eventBus";
import Grid from "@antv/g6/build/grid";
import {
    FormDynamic
} from '../../../../components/';
import EditTable from '../../../../components/table/EditTable'
import {deepCopy} from '../../../../utils/tools'
import copyTable from './copyTable/index'
export default {
    props:{
        checked:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        ip:{},
        headers:{}
    },
    data() {
        return {
            status: "canvas-selected",
            showGrid: false,
            page: {},
            graph: {},
            item: {},
            node: {},
            grid: null,
            dynamic: [],
            dynamicSource:[
                [{
                    name: 'dataSourceId',
                    type: 'cascader',
                    span: 24,
                    clearable:false,
                    label: '数据源',
                    valField:'subsystemId',
                    textField:'subsystemName',
                    childField:'relateDatasources',
                    valField2:'dataSourceId',
                    textField2:'dataSourceName',
                    dataUrl: this.ip+'/resource/subsystem/configure/listByProject',
                    headers:this.headers,
                    dataType:'get',
                    param:{projectId:this.checked.projectId},
                    rules:{
                        required:true,
                        type:'number'
                    }
                }]
            ],
            editoTableColums: [{
                    title: '类型',
                    key: 'type',
                    type: 'select',
                    // width: 100,
                    value: 'string',
                    data: [{
                            label: 'string',
                            value: 'string'
                        },
                        {
                            label: 'number',
                            value: 'number'
                        },
                        {
                            label: 'array',
                            value: 'array'
                        },
                        {
                            label: 'object',
                            value: 'object'
                        },
                        {
                            label: 'boolean',
                            value: 'boolean'
                        },
                        {
                            label: 'integer',
                            value: 'integer'
                        }
                    ]
                },
                {
                    title: '参数名称',
                    key: 'name',
                    required: true,
                    // width: 100,
                    value: '',
                    type: 'input',
                }
            ],
            formRows:{},
            nodeInsertData:{},
            loadingForm:false
        };
    },
    created() {
        this.init();
        this.bindEvent();
    },
    methods: {
        init() {
            this.getDataType()
        },
        //批量导入
        showPLDR(){
            let data = this.graph.save()
            console.log(data)
            for (let a of data.nodes) {
                if(this.nodeInsertData[a.id]){
                    this.$set(a,'insert_data',this.nodeInsertData[a.id])
                    this.$set(a,'properties',this.nodeInsertData[a.id].properties)
                    this.$set(a,'schema',this.nodeInsertData[a.id].schema)
                }
            }
            this.$refs.copyTable.inCome({data:{id:this.checked.projectId},g6Data:data})
        },
        getDataType(){
            this.$http.apiGet(this.ip+'/job/stream/constant/dataType',{
                headers:this.headers
            })
                .then(res=>{
                    if(res.success){
                        let arr = []
                        for(let a of res.data.rows){
                            arr.push({
                            label: a,
                            value: a
                        })
                        }
                        this.$set(this.editoTableColums[0],'data',arr)
                    }
                })
        },
        bindEvent() {
            let self = this;
            eventBus.$on("afterAddPage", page => {
                self.page = page;
                self.graph = self.page.graph;
                eventBus.$on("nodeselectchange", item => {
                    if(this.$refs.copyTable&&this.$refs.copyTable.close) return
                    console.log(item)
                    self.status = "canvas-selected";
                    self.item = null;
                    self.node = null
                    setTimeout(()=>{
                        if (item.select === true && item.target.getType() === "node") {
                            self.status = "node-selected";
                            self.item = item.target;
                            let node = deepCopy(item.target.getModel());
                            if(node.insert_data.needDataSource){
                                this.$set(this.dynamicSource[0][0].param,'type',node.insert_data.supportDataSource[0].dataSourceType)
                                let version = ''
                                console.log(node.insert_data.supportDataSource)
                                for(let a of node.insert_data.supportDataSource){
                                    version+=a.dataSourceVersion+','
                                }
                                this.$set(this.dynamicSource[0][0].param,'version',version)
                            }
                            self.node = node
                            if(self.node.insert_data.needDataSource){
                                this.$nextTick(()=>{
                                    this.$refs.savedataSource.setFormData(self.node.insert_data.properties)
                                })
                            }
                            if(self.node.insert_data.isAutoLoadSchema){
                                this.$nextTick(()=>{
                                    this.$refs.inEditTable.tableData = self.node.insert_data.inParameters
                                    this.$refs.outEditTable.tableData = self.node.insert_data.outParameters
                                })
                            }else{
                                if (self.node.insert_data.type != 'SINK') {
                                    this.$nextTick(() => {
                                        this.$refs.editTable.tableData = []
                                        if(this.nodeInsertData[this.node.id]){
                                            if (this.nodeInsertData[this.node.id].schema) {
                                                this.$refs.editTable.tableData = this.nodeInsertData[this.node.id].schema
                                            }
                                        }else{
                                            if (self.node.insert_data.schema) {
                                                this.$refs.editTable.tableData = self.node.insert_data.schema
                                            }
                                        }
                                    })
                                }
                            }
                            this.getForm(self.node.insert_data.key)
                        } else if (item.select === true && item.target.getType() === "edge") {
                            self.status = "edge-selected";
                            self.item = item.target;
                            self.node = {
                                source: item.target._cfg.source.getModel(),
                                target: item.target._cfg.target.getModel(),
                            };
                            console.log(self.node)
                        } else {
                            self.status = "canvas-selected";
                            self.item = null;
                            self.node = null;
                        }
                    },1)
                });
            });
            eventBus.$on('deleteItemAfter',item=>{
              if(this.item.id==item.id){
                this.status ='canvas-selected'
              }
            })
        },
        output(selection,type){
            console.log('change')
            if(type==1) this.$refs.editTable.tableData = selection
            else{
                let data = this.$refs.editTable.tableData
                data = data.concat(selection)
                this.$refs.editTable.tableData = data
            }
        },
        getForm(value) {
          if(this.formRows[value]==undefined){
              this.loadingForm = true
            this.$http.apiGet(this.ip + '/job/stream/getform?group=stream-node_' + value,{
                headers:this.headers
            })
                .then(res => {
                    this.loadingForm = false
                    if (res.success) {
                      this.formRows[value] = res.data.rows
                        this.dynamic = [res.data.rows]
                        this.$nextTick(() => {
                            this.$refs.savedata.setFormData({})
                            console.log(this.node.insert_data.properties)
                            if (this.node.insert_data.properties) {
                                let obj = {}
                                for(let i in this.node.insert_data.properties){
                                    obj[i] = this.node.insert_data.properties[i]
                                }
                                this.$refs.savedata.setFormData(obj)
                            }
                        })
                    }
                })
                .finally(()=>{
                    this.loadingForm = false
                })
          }else{
            this.dynamic = [this.formRows[value]]
            this.$nextTick(() => {
                this.$refs.savedata.setFormData({})
                console.log(this.node.insert_data.properties)
                if(this.nodeInsertData[this.node.id]){
                    if (this.nodeInsertData[this.node.id].properties) {
                        let properties = this.nodeInsertData[this.node.id].properties
                        let obj = {}
                        for(let i in properties){
                            obj[i] = properties[i]
                        }
                        this.$refs.savedata.setFormData(obj)
                    }
                }else{
                    if (this.node.insert_data.properties) {
                        let obj = {}
                        for(let i in this.node.insert_data.properties){
                            obj[i] = this.node.insert_data.properties[i]
                        }
                        this.$refs.savedata.setFormData(obj)
                    }
                }
            })
          }
        },
        handleChangeName(e) {
            const model = {
                label: e
            };

            this.graph.update(this.item, model);
        },
        changeGridState(value) {
            if (value) {
                this.grid = new Grid();
                this.graph.addPlugin(this.grid);
            } else {
                this.graph.removePlugin(this.grid);
            }
        },
        save() {
            if(this.node.insert_data.needDataSource){
                this.$refs.savedataSource.submit(params=>{
                     this.submit((res, res2) => {
                        let obj = this.node.insert_data
                        obj.properties = Object.assign(res,params)
                        obj.schema = res2
                        this.$set(this.node, 'insert_data', obj)
                        this.$set(this.item._cfg.model, 'insert_data', obj)
                        this.nodeInsertData[this.node.id] = obj
                        this.$Message.success('操作成功!')
                    })
                })
            }else
            this.submit((res, res2) => {
                let obj = this.node.insert_data
                obj.properties = res
                obj.schema = res2
                this.$set(this.node, 'insert_data', obj)
                this.$set(this.item._cfg.model, 'insert_data', obj)
                this.nodeInsertData[this.node.id] = obj
                this.$Message.success('操作成功!')
            })
        },
        submit(success) {
            if (this.dynamic[0].length > 0) {
                this.$refs.savedata.submit((params) => {
                    if (this.node.insert_data.type != 'SINK') {
                        this.$refs['editTable'].submit(params2 => {
                            if (params2.length <= 0) {
                                this.$Message.warning('请正确填写schema!')
                            } else {
                                success(params, params2)
                            }
                        })
                    } else {
                        success(params, [])
                    }

                })
            } else {
                if (this.node.insert_data.type != 'SINK') {
                    this.$refs['editTable'].submit(params2 => {
                        if (params2.length <= 0 && this.checkedNode.type != 'sink') {
                            this.$Message.warning('请正确填写schema!')
                        } else {
                            success({}, params2)
                        }
                    })
                }
            }
        },
    },
    components: {
        FormDynamic,
        EditTable,
        copyTable
    }
};
</script>

<style scoped>
.detailpannel {
    height: 100%;
    position: absolute;
    right: 0px;
    z-index: 2;
    background: #f7f9fb;
    width: 200px;
    border-left: 1px solid #e6e9ed;
}

.pannel {
    height: 100%;
}

.block-container {
    height: calc(100% - 65px);
    overflow: auto;
}

.detailpannel .block-container {
    padding: 16px 8px;
}

.block-container .i-col {
    height: 28px;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.pannel-title {
    height: 32px;
    border-top: 1px solid #dce3e8;
    border-bottom: 1px solid #dce3e8;
    background: #ebeef2;
    color: #000;
    line-height: 28px;
    padding-left: 12px;
}
</style>
