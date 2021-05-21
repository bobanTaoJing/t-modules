<template>
  <div id="mountNode" :style="{width:width}">
      <toolbar ref="toolbar" @getNodesInsertData="getNodesInsertData" v-show="false" :runTime="runTime" :checked="checked" />
    <div class="editor" >
      <Page :runTime="runTime" :onlyRead="true" :style="runTime?'padding:0':''" :height="height+37" :width="width"  :data="data" ref="page" />
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
      default:true
    }
  },
  created() {
    this.init();
  },
  mounted(){
    // this.miniWidth = this.$refs['split-right'].clientWidth
    this.$nextTick(()=>{
      this.$refs.page.init(this.editor,this.command)
      this.$refs.toolbar.handleAutoZoom()
    })
  },
  data() {
    return {
      editor: {},
      command: null,
      miniWidth:200,
      split1:this.runTime?.5:.8,
      jobId:''
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
    },
    changeJobId(id){
      this.jobId = id
    },
    getNodesInsertData(success){

      let nodeInsertData = this.$refs.detailPanel.nodeInsertData
      success(nodeInsertData)
    }
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