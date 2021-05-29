<template>
    <div>
        <div class="ivu-form" style="width:550px;margin:0 auto;">
            <div class="ivu-form-item ivu-form-item-required">
                <label class="ivu-form-item-label" style="width:100px;position:relative;z-index:1">
                    选择节点<i data-command="autoZoom" style="margin-left:10px" class="command iconfont icon-fit" title="适应画布" @click="$refs.page.graph.fitView(20)"></i>
                </label>
                <br>
                <div class="ivu-form-item-content data-tree-panel">
                    
                    <Page :runTime="runTime" :pageId="'pageId2'" :style="runTime?'padding:0':''" :height="600" :width="550"  :data="data" ref="page" />
                </div>
            </div>
            <div class="ivu-form-item ivu-form-item-required">
                <label class="ivu-form-item-label" style="width:100px">
                    选择字段
                </label>
                <div class="ivu-form-item-content data-tree-panel" style="margin-left:100px;">
                    <Table :columns="columns.columns1" ref="table" :data="proData" :height="300"
                    @on-selection-change="selectionChange"
                     :loading="loadingTable"></Table>
                </div>
            </div>
            <div style="text-align:center">
                <Button @click="nextstep(1)">替换</Button>
                <Button @click="nextstep(2)" style="margin:0 5px;" class="add">添加</Button>
            </div>
        </div>
    </div>
</template>
<script>
import columns from './columns'
import Page from './page'
import Editor from "../../../../../components/g6-editor/components/Base/Editor";
// import command from "../../../../../components/g6-editor/command";
import eventBus from "../../../../../components/g6-editor/utils/eventBus";
export default {
    props:['data'],
    data(){
        return{
            columns,
            proData:[],
            loadingTable:false,
            runTime:true,
            editor:{},
            command:null,
            selection:[]
        }
    },
    mounted(){
        this.editor = new Editor();
      this.command = new command(this.editor);
      this.$nextTick(()=>{
          this.$refs.page.init(this.editor,this.command)
          this.$refs.page.graph.fitView(20);
          eventBus.$on("nodeselectchange2", item => {
              console.log(eventBus)
              console.log(item)
              this.proData = item.target._cfg.model.insert_data.schema?item.target._cfg.model.insert_data.schema:[]
          })
      })
    },
    methods:{
        selectionChange(selection){
            this.selection = selection
        },
        nextstep(type) {
            if(this.selection.length>0)
            this.$emit('output',this.selection,type)
            else
            this.$Message.warning('请选择字段!')
        },
    },
    beforeDestroy(){
        eventBus.$off('nodeselectchange2')
    },
    watch:{
        proData(){
            this.selection = []
        }
    },
    components:{Page}
}
</script>