<template>
  <div id="mountNode" :style="{width:width}">
    <div class="editor" >
      <context-menu />
      <!--toolbar-->
      <toolbar ref="toolbar" :ip="ip" :headers="headers" @updateSuc="updateSuc" @getNodesInsertData="getNodesInsertData" v-if="!runTime" :runTime="runTime" :checked="checked" />
      <RuntimeToolbar ref="toolbar" :ip="ip" :headers="headers" v-else></RuntimeToolbar>
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel @reflashPage="reflashPage" :ip="ip" :headers="headers" v-show="!runTime" />
        <!--detailpannel-->
        <Split v-model="split1" :style="'height:'+height+'px'" :mode="runTime?'vertical':'horizontal'">
            <div :slot="!runTime?'left':'top'" class="demo-split-pane">
                <!--page-->
                <Page :runTime="runTime" :ip="ip" :headers="headers" :style="runTime||close?'padding:0':''" :height="height+37" :width="width"  :data="data" ref="page" />
            </div>
            <div ref="split-right" :min="100" :slot="!runTime?'right':'bottom'" class="demo-split-pane" style="height:100%;position:relative;">
              <template v-if="runTime">
                <RuntimeDetailPanel :jobItem="jobItem" style="width:100%;height:100%;overflow:auto" ></RuntimeDetailPanel>
              </template>
              <template v-else>
                <div style="overflow:auto">
                  <detail-panel ref="detailPanel" :ip="ip" :headers="headers" :checked="checked" style="width:100%;height:calc(100% - 162px);overflow:auto" />
                  <!--miniMap-->
                  <minimap ref="minimap" :width="miniWidth"/>
                </div>
              </template>
            </div>
        </Split>
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import RuntimeToolbar from "../Toolbar/runTimeIndex";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import RuntimeDetailPanel from "../DetailPanel/runTimeIndex";
import Minimap from "../Minimap";
import Page from "../Page";
import Flow from "../Flow"
import ContextMenu from "../ContextMenu";
import Editor from "../../../../components/g6-editor/components/Base/Editor";
import command from "../../../../components/g6-editor/command";
export default {
  name: "G6Editor",
  components: {
    Toolbar,
    RuntimeToolbar,
    ItemPanel,
    DetailPanel,
    RuntimeDetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow
  },
  props: {
    ip:{},
    headers:{},
    checked:{
            type:Object,
            default:()=>{
                return {}
            }
        },
    height: {
      type: Number,
      default: document.documentElement.clientHeight
    },
    width: {
      type: Number,
      default: document.documentElement.clientWidth
    },
    data: {
      type: Object,
      default: () => {
        return {
          // nodes:[
          //   {
          //     name:"表圆节点",label: "表圆节点",
          //     size: [80,80],
          //     type: "node",
          //     nodeType: "circle",
          //     x: 342,
          //     y: 156,
          //     shape: "customNode",
          //     color: "#034b0c",
          //     image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          //     inPoints: [0.5,0],
          //     outPoints: [0.2,1],
          //     isDoingStart: true,
          //     isDoingEnd: true,
          //     offsetX: 84,
          //     offsetY: 16,
          //     id: "node245",
          //   },
          //   {
          //     name:"表圆节点",label: "表圆节点",
          //     size: [80,80],
          //     type: "node",
          //     nodeType: "circle",
          //     x: 442,
          //     y: 156,
          //     shape: "customNode",
          //     color: "#034b0c",
          //     image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          //     inPoints: [0.5,0],
          //     outPoints: [0.2,1],
          //     isDoingStart: true,
          //     isDoingEnd: true,
          //     offsetX: 84,
          //     offsetY: 16,
          //     id: "node246",
          //   },
          // ],
          // edges:[
          //   {source: "node245",target: "node246"}
          // ]
        }
      }
    },
    runTime:{
      type:Boolean,
      default:false
    },
    jobItem:{
      type:Object,
      default:()=>{
        return {}
      }
    }
  },
  created() {
    this.init();
  },
  mounted(){
    // this.miniWidth = this.$refs['split-right'].clientWidth
    this.$nextTick(()=>{
      this.$refs.page.init(this.editor,this.command)
      console.log(this.$refs)
      if(this.runTime) this.$refs.toolbar.handleAutoZoom()
    })
  },
  data() {
    return {
      editor: {},
      command: null,
      miniWidth:200,
      split1:this.runTime?.5:.8,
      close:false
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    },
    getNodesInsertData(success){

      let nodeInsertData = this.$refs.detailPanel.nodeInsertData
      success(nodeInsertData)
    },
    reflashPage(close){
      this.close = close
      // this.$refs.page.reflash(this.editor,this.command,close?this.width+200:this.width)
      // this.$nextTick(()=>{
      //   this.$refs.minimap.reflash()
      // })
    },
    updateSuc(obj){
      this.$emit('updateSuc',obj)
    },
  },
  watch:{
    split1(){
      // this.miniWidth = this.$refs['split-right'].clientWidth
      // console.log(this.miniWidth)
      // this.$nextTick(()=>{
      //   this.$refs.minimap.initMinmap()
      // })
    }
  }
};
</script>

<style scoped>
.editor {
  position: relative;
  width: 100%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}
.bottom-container {
  position: relative;
}
</style>