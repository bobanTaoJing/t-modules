<style scoped>
    .detailpannel .checked{
        background: #6985d5 !important;
        color:#fff;
    }
</style>
<template>
<div class="detailpannel">
    <div style="height:100%">
        <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
            <div class="pannel-title">节点详情 {{node.label}}
            </div>
            <div class="block-container" style="position:relative">
                    <Spin size="large" fix v-if="loading"></Spin>
                    <Row :gutter="10" v-else>
                         <i-col :span="12" v-for="(item,index) in lines" :key="index">
                             <h3 style="text-align:center">{{item.name}}</h3>
                             <div style="height:30px;line-height:30px">
                                 <div :class="{checked:checkedTypes[index]==1}" @click="changeCheckedType(index,1)" style="width:50%;float:left;text-align:center;cursor:pointer;background:#ddd">图形信息</div>
                                 <div :class="{checked:checkedTypes[index]==2}" @click="changeCheckedType(index,2)" style="width:50%;float:left;text-align:center;cursor:pointer;background:#ddd">基础信息</div>
                             </div>
                            <ChartLine v-show="checkedTypes[index]==1" :xData="jobItem.lineXdata" :value="[{name:item.name,value:item.lineValue,color:item.color}]" :disHover="true" height="250px"/>
                            <AceEditor v-show="checkedTypes[index]==2" :height="250+'px'" :readOnly="true" :showAction="false" :showMenu="false" :codes="item.metric" :language="'yaml'" />
                        </i-col>
                    </Row>
            </div>
        </div>
        <div v-else class="pannel" id="node_detailpannel">
            <div class="pannel-title">请选择节点
            </div>
            <div class="block-container">
                <p>
                    <!-- <span>jobId : {{jobItem.jobId}}</span> -->
                </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import eventBus from "../../../../components/g6-editor/utils/eventBus";
import Grid from "@antv/g6/build/grid";
import {
    FormDynamic,ChartLine
} from '../../../../components/';
import EditTable from '../../../../components/table/EditTable'
import AceEditor from '../../../../components/editor/AceEditor.vue';
export default {
    props:['jobItem','ip','headers'],
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
            lines:[],
            loading:false,
            checkedTypes:[]
        };
    },
    created() {
        this.init();
        this.bindEvent();
    },
    methods: {
        init() {
        },
        bindEvent() {
            let self = this;
            eventBus.$on("afterAddPage", page => {
                self.page = page;
                self.graph = self.page.graph;
                eventBus.$on("nodeselectchange", item => {
                    console.log(item)
                    if (item.select === true && item.target.getType() === "node") {
                        self.status = "node-selected";
                        self.item = item.target;
                        self.node = item.target.getModel();
                        console.log(self.node.insert_data.type)
                        if(!this.jobItem.jobId){
                            this.$Message.warning('请输入jobjId!')
                        }else{
                            this.get_operator_name(self.node.insert_data)
                        }
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
                });
            });
            eventBus.$on('deleteItemAfter',item=>{
              if(this.item.id==item.id){
                this.status ='canvas-selected'
              }
            })
        },
        get_operator_name(obj){
            this.$http.apiGet(this.ip+'/job/stream/node/detail/list',{params:{key:obj.key},headers:this.headers})
                .then(res=>{
                    if(res.success){
                        this.lines = res.data.nodes[0].metrics
                        if(this.lines.length>=0)
                        this.getLine()
                    }
                })
        },
        getLine(data=[]){
            this.loading = true
            let count = 0
            let checkedTypes = []
            for(let a of this.lines){
                checkedTypes.push(1)
                a.color = '#'+this.getColor('')
                let obj ={
                    query:a.metric+'{operator_name=~"'+".*"+this.node.operatorName+'",job_id="'+this.jobItem.jobId+'"}',
                    start: this.jobItem.start,
                    end: this.jobItem.end,
                    step: 1,
                    _: new Date().getTime(),
                }
                this.$http.apiGet(this.ip+'/api/v1/query_range?',{
                    params:obj,headers:this.headers
                })
                .then(res=>{
                    count++
                    if(count >= this.lines.length) this.loading = false
                    // this.loading = false
                    if(res.status=='success'){
                        if(res.data.result.length>0){
                            let lineValue = []
                            for(let b of res.data.result[0].values){
                                if(this.jobItem.lineXdata2.indexOf(b[0])>-1){
                                    lineValue[this.jobItem.lineXdata2.indexOf(b[0])] = b[1]
                                }

                            }
                            // this.lineValue = lineValue
                            a.lineValue = lineValue
                            let metrics = res.data.result[0].metric
                            let metric = ''
                            for(let i in metrics){
                                metric = metric+i+' : '+metrics[i]
                                metric +='\n'
                            }
                            a.metric = metric
                            console.log(lineValue)
                        }
                    }
                })
                .catch(()=>{
                    count++
                    if(count >= this.lines.length) this.loading = false
                })
            }
            this.checkedTypes = checkedTypes
        },
        changeCheckedType(index,type){
            this.$set(this.checkedTypes,index,type)
            // this.checkedTypes[index] = type
            console.log(this.checkedTypes)
        },
        getColor(color){
            // let base = '0123401234abcabc'//浅色
            let base = '5678956789defdef'//深色
            return(color += base [Math.floor(Math.random() * 16)]) &&
                    (color.length == 6) ? color : this.getColor(color)
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
            //properties
            this.submit((res, res2) => {
                let obj = this.node.insert_data
                obj.properties = res
                obj.schema = res2
                this.$set(this.node, 'insert_data', obj)
                console.log(this.node)
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
                        success(params, {})
                    }

                })
            } else {
                if (node.insert_data.type != 'SINK') {
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
        ChartLine,
        AceEditor
    },
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
    height: calc(100% - 33px);
    min-height: 300px;
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
