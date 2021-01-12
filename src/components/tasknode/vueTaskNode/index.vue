<template>
<div>
    <div class="hello" style="text-align: center">
        <!-- <div class="node-model cell-left">
            <ul>
                <li style="border-bottom: 2px solid aliceblue;" v-for="nodeM in nodeModels" :key="nodeM.id">
                    <task-node-model :node="nodeM">
                        <span class="task-node-model-label">{{nodeM.name}}</span>
                    </task-node-model>
                </li>
                <li>
                    <select class="demo-line" v-model="ini_config.lineType">
                        <option value='ML'>直线</option>
                        <option value='Q'>曲线</option>
                        <option value='L'>折线</option>
                    </select>
                </li>
                <li>
                    <select class="demo-line" v-model="ini_config.isDotted">
                        <option :value=true>虚线</option>
                        <option :value=false>实线</option>
                    </select>
                </li>
                <li>
                    <button class="demo-btn" @click="zoomIn">放大</button>
                    <button class="demo-btn" @click="zoomOut">缩小</button>
                </li>
            </ul>
        </div> -->
        <div class="cell-right">
            <p style="text-align:left"><i-button @click="autoLineOne">同行映射</i-button><i-button @click="autoNameOne">同名映射</i-button><i-button @click="autoPaixu">按映射排序</i-button></p>
            <task-work-area width=800 :height="height" svgWidth=790 :svgHeight="svgHeight" :id="work_id" :ini="ini_config" style="cursor:default" v-on:on-add-nodemodel="onAddNodeModel" v-on:on-mouse="mouseMenu" ref="area">
                <task-curve-path :areaid="work_id" :paths="paths" ref="curve" v-on:on-mouse="mouseFn" v-on:on-mouse-over="mouseOverFn" v-on:on-mouse-out="mouseOutFn"></task-curve-path>
                <template v-for="node in nodes">
                    <!-- <task-common-node :key="node.id" :node="node" v-on:on-add-path="addPath" v-on:on-select="selectlMethod" v-on:on-drag-start="dragStart" v-on:on-drag-ging="dragGing" v-on:on-drag-end="dragEnd" :updateTem="updateCompleted" v-on:on-mouse="mouseNodeMenu"></task-common-node> -->
                    <selfNode :key="node.id" :node.sync="node" v-on:on-add-path="addPath" v-on:on-select="selectlMethod" v-on:on-drag-start="dragStart" v-on:on-drag-ging="dragGing" v-on:on-drag-end="dragEnd" :updateTem="updateCompleted" v-on:on-mouse="mouseNodeMenu"></selfNode>
                </template>
                <!-- <task-initial-node :node="initialData" backgroundColor="#ff5722" v-on:on-add-path="addPath" v-on:on-select="selectlMethod" v-on:on-drag-start="dragStart" v-on:on-drag-ging="dragGing" v-on:on-drag-end="dragEnd" :updateTem="updateCompleted" v-on:on-mouse="mouseNodeMenu"></task-initial-node> -->
            </task-work-area>
        </div>
    </div>
</div>
</template>

<script>
import selfNode from './selfNode'

export default {
    components: {
        selfNode
    },
    props:{
        sourceTable:{
            type:Object,
            default:function(){
                return {
                    data:[],
                    columns:[]
                }
            }
        },targetTable:{
            type:Object,
            default:function(){
                return {
                    data:[],
                    columns:[]
                }
            }
        },lines:{
            type:Array,
            default:function(){
                return []
            }
        },
        
    },
    data() {
        return {
            dtl: 10,
            work_id: 'work_id',
            ini_config: {
                lineType: 'ML',
                isDotted: false,
                scaling: {
                    ZoomX: 1,
                    ZoomY: 1
                }
            },
            startNode: {},
            nodeModels: [{
                id: '12',
                name: 'SQL'
            }, {
                id: '13',
                name: 'WorkData'
            }, {
                id: '14',
                name: 'TableToTV'
            }, {
                id: '15',
                name: '增加系列'
            }],
            initialData: {
                id: 'node4',
                name: '节点4',
                positionX: 300,
                positionY: 60,
                icon: 'task-icon-41',
                inPorts: [],
                outPorts: [{
                    id: 'node4_5'
                }]
            },
            nodes: [{
                id: 'node1',
                name: '节点1',
                positionX: 75,
                positionY: 10,
                state: 'success',
                columns:[],
                tableData:[],
            }, {
                id: 'node2',
                name: '节点2',
                positionX: 515,
                positionY: 10,
                state: 'mistake',
                columns:[],
                tableData:[]
            }],
            paths: []
        }
    },
    created(){
        let tableData=[],tableData2=[]
        this.sourceTable.data.forEach((item,index)=>{
            item.tableNodePid = item.tableNodePid ?item.tableNodePid :'node1_'+index
            tableData.push(item)
        })
        this.targetTable.data.forEach((item,index)=>{
            item.tableNodePid = item.tableNodePid ?item.tableNodePid :'node2_'+index
            tableData2.push(item)
        })
        this.nodes[0].columns = this.sourceTable.columns
        this.nodes[0].tableData = tableData

        this.nodes[1].columns = this.targetTable.columns
        this.nodes[1].tableData = tableData2

        this.paths = this.lines
    },
    mounted(){
        this.$set(this.ini_config,'lineType','Q')
        setTimeout(()=>{
            this.$set(this.ini_config,'lineType','ML')
        },100)
    },
    computed:{
       height(){
            let maxLenght = Math.max(this.nodes[0].tableData.length,this.nodes[1].tableData.length)
            if(parseInt(maxLenght)*41 + 41*2 <= 500)
                return parseInt(maxLenght)*41 + 41*2 +20 +'px'
            else return '500px'
        },
        svgHeight(){
            let maxLenght = Math.max(this.nodes[0].tableData.length,this.nodes[1].tableData.length)
            return parseInt(maxLenght)*41 + 41*2 + 15
        }
    },
    methods: {
        //进入是调用
        //同行映射
        autoLineOne(){
            for(let item of this.nodes){
                for(let ins of item.tableData){
                        this.$set(ins,'isConnected',false)
                    }
            }
            let minLenght = Math.min(this.nodes[0].tableData.length,this.nodes[1].tableData.length)
            console.log(minLenght)
            this.paths = []
            for(let i=0;i<minLenght;i++){
                this.addPath('event',this.nodes[0].tableData[i].tableNodePid, this.nodes[1].tableData[i].tableNodePid)
            }
            
        },
        //同名映射
        autoNameOne(){
            for(let item of this.nodes){
                for(let ins of item.tableData){
                        this.$set(ins,'isConnected',false)
                    }
            }
            this.paths = []
            for(let item of this.nodes[0].tableData){
                for(let ine of this.nodes[1].tableData){
                    if(item.name === ine.name&&item.name!==''){
                        this.addPath('event',item.tableNodePid,ine.tableNodePid)
                    }
                }
            }
        },
        //按映射排序
        autoPaixu(){
            let tableData = this.nodes[0].tableData,tableData2 = this.nodes[1].tableData
            let newTableData = [],newTableData2=[],newDataIds=[],newDataIds2=[]
            for(let a of this.paths){
                newDataIds.push(a.startPort)
                newDataIds2.push(a.endPort)
                for(let item of tableData){
                    if(item.tableNodePid == a.startPort) newTableData.push(item)
                }
                for(let item of tableData2){
                    if(item.tableNodePid == a.endPort) newTableData2.push(item)
                }
            }
            for(let a of tableData){
                if(newDataIds.indexOf(a.tableNodePid)<=-1) newTableData.push(a)
            }
            for(let a of tableData2){
                if(newDataIds2.indexOf(a.tableNodePid)<=-1) newTableData2.push(a)
            }
            this.$set(this.nodes[0],'tableData',newTableData)
            this.$set(this.nodes[1],'tableData',newTableData2)
        },
        //获取数据
        submit(success,error){
            let obj = {
                sourceData:this.nodes[0].tableData,
                targetData:this.nodes[1].tableData,
                path:this.paths
            }
            success(obj)
        },
        zoomIn(event) {
            this.ini_config.scaling.ZoomX = this.ini_config.scaling.ZoomX + 0.1
            this.ini_config.scaling.ZoomY = this.ini_config.scaling.ZoomY + 0.1
        },
        zoomOut(event) {
            this.ini_config.scaling.ZoomX = this.ini_config.scaling.ZoomX - 0.1
            this.ini_config.scaling.ZoomY = this.ini_config.scaling.ZoomY - 0.1
        },
        onAddNodeModel(event, node) {
            console.log('添加节点', event.clientX, event.clientY, node)
            let newNode = {}
            newNode = node
            newNode.id = 'node' + (this.dtl++)
            newNode.positionX = node.positionX - 90 // -15 -90 定位到节点的终点
            newNode.positionY = node.positionY - 15
            newNode.outPorts = [{
                id: newNode.id + '_' + Math.floor(Math.random() * 10)
            }]
            newNode.inPorts = []
            this.nodes.push(newNode)
        },
        mouseFn(event, portData) {
            console.log('mouseFn', 'on-mouse', '鼠标右击路径事件', event, portData,this.paths)
            for(let i in this.paths){
                let a = this.paths[i]
                if(a.startPort===portData.startPort && a.endPort===portData.endPort){
                    this.paths.splice(i,1)
                    for(let item of this.nodes){
                        for(let ins of item.tableData){
                            if (ins.tableNodePid === portData.startPort||ins.tableNodePid === portData.endPort ) {
                                this.$set(ins,'isConnected',false)
                            }
                        }
                    }
                    return
                }
            }
        },
        mouseOverFn(event, portData) {
            console.log('mouseFn', 'on-mouse-over', '鼠标划入路径事件', event, portData)
        },
        mouseOutFn(event, portData) {
            console.log('mouseFn', 'on-mouse-out', '鼠标划出路径事件', event, portData)
        },
        selectlMethod: function (event, data, node) {
            console.log('selectlMethod', 'on-select', '节点左键点击事件', event, data, node)
        },
        dragStart: function (event, node) {
            let nodeData = event.dataTransfer.getData('nodedata')
            console.log('节点开始移动', event.clientX, event.clientY, node, JSON.parse(nodeData))
            this.startNode = {
                id: node.id,
                positionX: event.clientX,
                positionY: event.clientY
            }
        },
        dragEnd: function (event, node) {
            console.log('节点移动结束', event.clientX, event.clientY, node)
            let nodeXY = {}
            nodeXY.x = event.clientX
            nodeXY.y = event.clientY
            let me = this
            this.nodes.forEach(function (item) {
                if (item.id === node.id) {
                    item.positionX = node.positionX + (nodeXY.x - me.startNode.positionX)
                    item.positionY = node.positionY + (nodeXY.y - me.startNode.positionY)
                }
            })
            if (node.id === this.initialData.id) {
                this.initialData.positionX = node.positionX + (nodeXY.x - me.startNode.positionX)
                this.initialData.positionY = node.positionY + (nodeXY.y - me.startNode.positionY)
            }
        },
        addPath: function (event, startData, endData) {
            let me = this
            console.log('添加路径', event, startData, endData)
            console.log(this.nodes)
            for(let item of this.nodes){
                if(item.tableData){
                    for(let ins of item.tableData){
                        if (ins.tableNodePid === startData ) {
                            if(ins.isConnected){
                                return
                            }
                        }
                        if (ins.tableNodePid === endData ) {
                            if(ins.isConnected){
                                return
                            }
                        }
                    }
                }else return
            }
            for(let item of this.nodes){
                for(let ins of item.tableData){
                        if (ins.tableNodePid === startData||ins.tableNodePid === endData ) {
                            me.$set(ins,'isConnected',true)
                        }
                    }
            }
             setTimeout(function () {
                me.paths.push({
                    dotted: me.ini_config.isDotted,
                    ptype: me.ini_config.lineType,
                    startPort: startData,
                    endPort: endData
                })
            }, 200)
        },
        dragGing: function (event) {
            console.log('节点移动中...', event.clientX, event.clientY)
        },
        updateCompleted: function () {
            console.log('updateCompleted!!')
            // 重新加载路径
            this.$refs.curve.vReload()
        },
        mouseMenu: function (event, id) {
            console.log('mouseMenu', 'on-mouse', '工作区右击事件', event, id)
        },
        mouseNodeMenu: function (event, node) {
            console.log('mouseNodeMenu', 'on-mouse', '节点右击事件', event, node)
        }
    }
}
</script>

<style>
.node-model {
    background-color: #eee;
    width: 140px;
    height: 500px;
}

.cell-left {
    float: left;
}

.cell-fight {
    float: left;
}

.demo-line {
    width: 140px;
    height: 26px;
    border: none;
}

.demo-btn {
    width: 48%;
    background-color: #fff;
    border: 1px solid #eee;
    font-size: 14px;
    line-height: 26px;
    cursor: pointer;
}

/* // @import "lib/styles/index.less"; */
/*#app {*/
/*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
/*-webkit-font-smoothing: antialiased;*/
/*-moz-osx-font-smoothing: grayscale;*/
/*text-align: center;*/
/*color: #2c3e50;*/
/*padding: 50px;*/
/*background-color: #cccccc;*/
/*}*/
</style>

<!--
.icon {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

[class^="icon-task"], [class*=" icon-task"] {
  font-family:"iconfont" !important;
  /* 以下内容参照第三方图标库本身的规则 */
  font-size: 18px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
