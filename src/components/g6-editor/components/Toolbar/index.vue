<template>
<div class="toolbar">
    <i class="command iconfont icon-undo" title="撤销" :class="undoList.length>0?'':'disable'" @click="handleUndo"></i>
    <i class="command iconfont icon-redo" title="重做" :class="redoList.length>0?'':'disable'" @click="handleRedo"></i>
    <span class="separator"></span>
    <!-- <i data-command="copy" class="command iconfont icon-copy-o disable" title="复制"></i>
    <i data-command="paste" class="command iconfont icon-paster-o disable" title="粘贴"></i>-->
    <i data-command="delete" class="command iconfont icon-delete-o" title="删除" :class="selectedItem?'':'disable'" @click="handleDelete"></i>
    <span class="separator"></span>
    <i data-command="zoomIn" class="command iconfont icon-zoom-in-o" title="放大" @click="handleZoomIn"></i>
    <i data-command="zoomOut" class="command iconfont icon-zoom-out-o" title="缩小" @click="handleZoomOut"></i>
    <i data-command="autoZoom" class="command iconfont icon-fit" title="适应画布" @click="handleAutoZoom"></i>
    <i data-command="resetZoom" class="command iconfont icon-actual-size-o" title="实际尺寸" @click="handleResetZoom"></i>
    <span class="separator"></span>
    <i data-command="toBack" class="command iconfont icon-to-back" :class="selectedItem?'':'disable'" title="层级后置" @click="handleToBack"></i>
    <i data-command="toFront" class="command iconfont icon-to-front" :class="selectedItem?'':'disable'" title="层级前置" @click="handleToFront"></i>
    <span class="separator"></span>
    <span class="separator"></span>
    <!-- <i
      data-command="multiSelect"
      class="command iconfont icon-select"
      :class="multiSelect?'disable':''"
      title="多选"
      @click="handleMuiltSelect"
    ></i>
    <i
      data-command="addGroup"
      class="command iconfont icon-group"
      title="成组"
      :class="addGroup?'':'disable'"
      @click="handleAddGroup"
    ></i>
    <i data-command="unGroup" class="command iconfont icon-ungroup disable" title="解组"></i> -->
    <i-button @click="modal1=true" type="primary">保存</i-button>
    <!-- <i-button @click="consoleData" type="primary">打印数据</i-button> -->
    
    <Modal v-model="modal1" :title="checked.id?'修改流程':'保存流程'">
        <FormDynamic ref="savedata" :data="dynamic" :label-width="100"></FormDynamic>
        <p slot="footer">
            <Button :loading="loadingSave" @click="saveData">确定</Button>
        </p>
    </Modal>
</div>
</template>

<script>
import eventBus from "../../../../components/g6-editor/utils/eventBus";
import Util from "@antv/g6/src/util";
import {
    uniqueId,
    getBox
} from "../../../../components/g6-editor/utils";
import {
    FormDynamic
} from '../../../../components/';
export default {
    components: {
        FormDynamic
    },
    props: {
        checked: {
            type: Object,
            default: () => {
                return {}
            }
        },
        runTime: {
            type: Boolean,
            default: false
        },
        ip:{},
        headers:{}
    },
    data() {
        return {
            page: {},
            graph: {},
            redoList: [],
            undoList: [],
            editor: null,
            command: null,
            selectedItem: null,
            multiSelect: false,
            addGroup: false,
            modal1: false,
            dynamic: [
                [{
                    name: 'projectId',
                    type: 'select',
                    span: 24,
                    label: '所属项目',
                    clearable: false,
                    disabled:true,
                    valField:'id',
                    textField:'name',
                    dataUrl: '/admin/api/sys/project/list',
                    param:{sortField:'id',sortOrder:'asc'},
                    value:this.checked.projectId,
                    rules:{
                        required:true,
                        type:'number'
                    }
                }],
                [{
                    type: 'text',
                    label: '名称',
                    name: 'name',
                    value: this.checked.name,
                    rules: {
                        required: true
                    }
                }]
            ],
            loadingSave: false
        };
    },
    created() {
        this.init();
        this.bindEvent();
    },
    watch: {
        selectedItem(val) {
            if (val && val.length > 1) {
                this.addGroup = true;
            } else {
                this.addGroup = false;
            }
        }
    },
    methods: {
        init() {
            const {
                editor,
                command
            } = this.$parent;
            this.editor = editor;
            this.command = command;
        },
        bindEvent() {
            let self = this;
            eventBus.$on("afterAddPage", page => {
                self.page = page;
                self.graph = self.page.graph;
            });
            eventBus.$on("add", data => {
                console.log('add')
                this.redoList = data.redoList;
                this.undoList = data.undoList;
            });
            eventBus.$on("update", data => {
                this.redoList = data.redoList;
                this.undoList = data.undoList;
            });
            eventBus.$on("delete", data => {
                this.redoList = data.redoList;
                this.undoList = data.undoList;
            });
            eventBus.$on("updateItem", item => {
                console.log('updateItem')
                this.command.executeCommand("update", [item]);
            });
            eventBus.$on("addItem", item => {
                // console.log('additem')
                this.command.executeCommand("add", [item]);
            });
            eventBus.$on("nodeselectchange", () => {
                this.selectedItem = this.graph.findAllByState("node", "selected");
                this.selectedItem = this.selectedItem.concat(
                    ...this.graph.findAllByState("edge", "selected")
                );
            });
            eventBus.$on("deleteItem", () => {
                if (this.runTime) return
                this.handleDelete();
            });
            eventBus.$on("muliteSelectEnd", () => {
                this.multiSelect = false;
                this.selectedItem = this.graph.findAllByState("node", "selected");
            });
        },
        handleUndo() {
            if (this.undoList.length > 0) this.command.undo();
        },
        handleRedo() {
            if (this.redoList.length > 0) this.command.redo();
        },
        handleDelete() {
            if (this.selectedItem && this.selectedItem.length > 0) {
                eventBus.$emit("deleteItemAfter", this.selectedItem);
                this.command.executeCommand("delete", this.selectedItem);
                this.selectedItem = null;
            }
        },
        getFormatPadding() {
            return Util.formatPadding(this.graph.get("fitViewPadding"));
        },
        getViewCenter() {
            const padding = this.getFormatPadding();
            const graph = this.graph;
            const width = this.graph.get("width");
            const height = graph.get("height");
            return {
                x: (width - padding[2] - padding[3]) / 2 + padding[3],
                y: (height - padding[0] - padding[2]) / 2 + padding[0]
            };
        },
        handleZoomIn() {
            const currentZoom = this.graph.getZoom();
            this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
        },
        handleZoomOut() {
            const currentZoom = this.graph.getZoom();
            this.graph.zoomTo(currentZoom - 0.5, this.getViewCenter());
        },
        handleToBack() {
            if (this.selectedItem && this.selectedItem.length > 0) {
                this.selectedItem.forEach(item => {
                    item.toBack();
                    this.graph.paint();
                });
            }
        },
        handleToFront() {
            if (this.selectedItem && this.selectedItem.length > 0) {
                this.selectedItem.forEach(item => {
                    if (item.getType() === "edge") {
                        // const nodeGroup = this.graph.get("nodeGroup");
                        // const edgeGroup = item.get("group");
                        // nodeGroup.toFront();
                        // edgeGroup.toFront()
                    } else {
                        item.toFront();
                    }

                    this.graph.paint();
                });
            }
        },
        handleAutoZoom() {
            this.graph.fitView(20);
        },
        handleResetZoom() {
            this.graph.zoomTo(1, this.getViewCenter());
        },
        handleMuiltSelect() {
            this.multiSelect = true;
            this.graph.setMode("mulitSelect");
        },
        handleAddGroup() {
            //TODO 这部分等阿里更新Group之后添加
            // const model = {
            //   id: "group" + uniqueId(),
            //   title: "新建分组"
            // };
            // // this.command.executeCommand("add", "group", model);
            // this.selectedItem.forEach(item => {
            //   console.log(item);
            // });

            //this.getPosition(this.selectedItem);
        },
        getPosition(items) {
            const boxList = [];
            items.forEach(item => {
                const box = item.getBBox();
                boxList.push(getBox(box.x, box.y, box.width, box.height));
            });
            let minX1, minY1, MaxX2, MaxY2;
            boxList.forEach(box => {
                if (typeof minX1 == "undefined") {
                    minX1 = box.x1;
                }
                if (typeof minY1 == "undefined") {
                    minY1 = box.y1;
                }
                if (typeof MaxX2 == "undefined") {
                    MaxX2 = box.x2;
                }
                if (typeof MaxY2 == "undefined") {
                    MaxY2 = box.y2;
                }
                if (minX1 > box.x1) {
                    minX1 = box.x1;
                }
                if (minY1 > box.y1) {
                    minY1 = box.y1;
                }
                if (MaxX2 < box.x2) {
                    MaxX2 = box.x2;
                }
                if (MaxY2 < box.y2) {
                    MaxY2 = box.y2;
                }
            });
            const width = MaxX2 - minX1,
                height = MaxY2 - minY1,
                x = minX1 + width / 2,
                y = minY1 + height / 2,
                id = "team" + uniqueId();
            const model = {
                id: id,
                width,
                height,
                x,
                y,
                shape: "teamNode"
            };
            this.command.executeCommand("add", model);
            // const item = this.graph.findById(id);
            // item.get("group").toBack();
            // const edgeGroup = this.graph.get("edgeGroup");
            // edgeGroup.toFront();
            // this.graph.paint();
        },
        consoleData(){
            let data = this.graph.save()
            let nodes = [],
                edges = [],nodesInsertData={}
            this.$emit('getNodesInsertData',res=>{
                nodesInsertData = res
                for (let a of data.nodes) {
                    if(nodesInsertData[a.id]){
                        this.$set(a,'insert_data',nodesInsertData[a.id])
                        this.$set(a,'properties',nodesInsertData[a.id].properties)
                        this.$set(a,'schema',nodesInsertData[a.id].schema)
                        nodes.push({
                            id: a.id,
                            type: a.insert_data.type,
                            key: a.insert_data.key,
                            properties: a.properties,
                            schema: a.schema,
                            nodeInfo: JSON.stringify(a)
                        })
                    }else
                    nodes.push({
                        id: a.id,
                        type: a.insert_data.type,
                        key: a.insert_data.key,
                        properties: a.insert_data.properties,
                        schema: a.insert_data.schema,
                        nodeInfo: JSON.stringify(a)
                    })
                }
                for (let a of data.edges) {
                    edges.push({
                        source: a.source,
                        target: a.target,
                        edgeInfo: JSON.stringify(a)
                    })
                }
                let obj = {
                    nodes,
                    edges,
                    name: 'test0603'
                }
                console.log(obj);
            })
        },
        saveData() {
            let data = this.graph.save()
            
            let nodes = [],
                edges = [],nodesInsertData={}
            this.$emit('getNodesInsertData',res=>{
                nodesInsertData = res
                for (let a of data.nodes) {
                    console.log(a)
                    // if(a.error){
                        let item = this.graph.findById(a.id)
                        let model = item.getModel()
                        model.error = false
                        this.graph.updateItem(item,model)
                    // }
                    if(nodesInsertData[a.id]){
                        this.$set(a,'insert_data',nodesInsertData[a.id])
                        this.$set(a,'properties',nodesInsertData[a.id].properties)
                        this.$set(a,'schema',nodesInsertData[a.id].schema)
                        nodes.push({
                            id: a.id,
                            type: a.insert_data.type,
                            key: a.insert_data.key,
                            properties: a.properties,
                            schema: a.schema,
                            isAutoLoadSchema:a.insert_data.isAutoLoadSchema,
                            nodeInfo: JSON.stringify(a)
                        })
                    }else
                    nodes.push({
                        id: a.id,
                        type: a.insert_data.type,
                        key: a.insert_data.key,
                        properties: a.insert_data.properties,
                        schema: a.insert_data.schema,
                        isAutoLoadSchema:a.insert_data.isAutoLoadSchema,
                        nodeInfo: JSON.stringify(a)
                    })
                }
                for (let a of data.edges) {
                    edges.push({
                        source: a.source,
                        target: a.target,
                        edgeInfo: JSON.stringify(a)
                    })
                }
                let obj = {
                    nodes,
                    edges,
                    name: ''
                }
                this.$refs.savedata.submit(params => {
                    this.loadingSave = true
                    if (this.checked.id) {
                        obj.id = this.checked.id
                        obj.projectId = params.projectId
                        obj.name = params.name

                        this.$http.apiPostJson(this.ip + '/job/stream/node/config/update', obj, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    ...this.headers
                                }
                            })
                            .then(res => {
                                this.loadingSave = false
                                if (res.success) {
                                    this.modal1 = false
                                    this.$emit('updateSuc',{type:1,name:params.name})
                                    this.$Message.success('保存成功！')
                                } else {
                                    if(res.data.errorInfo){
                                        let item = this.graph.findById(res.data.errorInfo.nodeId)
                                        let model = item.getModel()
                                        model.error = true
                                        this.graph.updateItem(item,model)
                                        this.modal1 = false
                                    }
                                    this.$Message.error(res.message)
                                }
                            })
                            .finally(() => {
                                this.loadingSave = false
                            })
                    } else {
                        obj.projectId = params.projectId
                        obj.name = params.name
                        this.$http.apiPostJson(this.ip + '/job/stream/node/config/create', obj, {
                                headers: {
                                    'Content-Type': 'application/json',
                                    ...this.headers
                                }
                            })
                            .then(res => {
                                this.loadingSave = false
                                if (res.success) {
                                    this.modal1 = false
                                    this.$emit('updateSuc',{type:2,id:res.data.id, name:params.name})
                                    this.$Message.success('保存成功！')
                                } else {
                                    if(res.data.errorInfo){
                                        let item = this.graph.findById(res.data.errorInfo.nodeId)
                                        let model = item.getModel()
                                        model.error = true
                                        this.graph.updateItem(item,model)
                                        this.modal1 = false
                                    }
                                    this.$Message.error(res.message)
                                }
                            })
                            .finally(() => {
                                this.loadingSave = false
                            })
                    }
                })
            })
        }
    }
};
</script>

<style scoped>
.toolbar {
    background: #fff;
    box-sizing: border-box;
    padding: 8px 0px;
    width: 100%;
    border: 1px solid #e9e9e9;
    height: 42px;
    z-index: 3;
    box-shadow: 0px 8px 12px 0px rgba(0, 52, 107, 0.04);
    position: absolute;
    top: 0;
}

.toolbar .command:nth-of-type(1) {
    margin-left: 24px;
}

.toolbar .command {
    box-sizing: border-box;
    width: 27px;
    height: 27px;
    margin: 0px 6px;
    border-radius: 2px;
    padding-left: 4px;
    display: inline-block;
    border: 1px solid rgba(2, 2, 2, 0);
}

.toolbar .command:hover {
    cursor: pointer;
    border: 1px solid #e9e9e9;
}

.toolbar .disable {
    color: rgba(0, 0, 0, 0.25);
}

.toolbar .separator {
    margin: 4px;
    border-left: 1px solid #e9e9e9;
}
</style>
<style>
    
@font-face {font-family: "iconfont";
  src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264'); /* IE9*/
  src: url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.eot?t=1522149591264#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff;charset=utf-8;base64,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') format('woff'),
  url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.ttf?t=1522149591264') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('//at.alicdn.com/t/font_598462_3xve1872wizzolxr.svg?t=1522149591264#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-cut:before { content: "\e8a2"; }

.icon-actual-size-o:before { content: "\e8a3"; }

.icon-copy-o:before { content: "\e8a4"; }

.icon-delete-o:before { content: "\e8a5"; }

.icon-fit:before { content: "\e8a6"; }

.icon-select:before { content: "\e8a7"; }

.icon-paster-o:before { content: "\e8a8"; }

.icon-redo:before { content: "\e8a9"; }

.icon-to-front:before { content: "\e8aa"; }

.icon-undo:before { content: "\e8ab"; }

.icon-zoom-in-o:before { content: "\e8ac"; }

.icon-ungroup:before { content: "\e8ad"; }

.icon-zoom-out-o:before { content: "\e8ae"; }

.icon-group:before { content: "\e8af"; }

.icon-to-back:before { content: "\e8b0"; }

</style>
