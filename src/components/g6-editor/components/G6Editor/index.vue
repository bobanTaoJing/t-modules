<template>
  <div id="mountNode">
    <div class="editor" >
      <context-menu />
      <!--toolbar-->
      <toolbar />
      <div style="height: 42px;"></div>
      <div class="bottom-container">
        <!--itempannel-->
        <item-panel />
        <!--detailpannel-->
        <Split v-model="split1" :style="'height:'+height+'px'">
            <div slot="left" class="demo-split-pane">
                <!--page-->
                <Page :height="height+37" :width="width"  :data="data" ref="page" />
            </div>
            <div ref="split-right" slot="right" class="demo-split-pane" style="height:100%;position:relative;">
              <detail-panel style="width:100%" />
              <!--miniMap-->
              <minimap ref="minimap" :width="miniWidth"/>
            </div>
        </Split>
      </div>
    </div>
    <Flow />
  </div>
</template>

<script>
import Toolbar from "../Toolbar";
import ItemPanel from "../ItemPanel";
import DetailPanel from "../DetailPanel";
import Minimap from "../Minimap";
import Page from "../Page";
import Flow from "../Flow"
import ContextMenu from "../ContextMenu";
import Editor from "@/components/g6-editor/components/Base/Editor";
import command from "@/components/g6-editor/command";
export default {
  name: "G6Editor",
  components: {
    Toolbar,
    ItemPanel,
    DetailPanel,
    Minimap,
    Page,
    ContextMenu,
    Flow
  },
  props: {
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
          nodes:[
            {
              name:"表圆节点",label: "表圆节点",
              size: [80,80],
              type: "node",
              nodeType: "circle",
              x: 342,
              y: 156,
              shape: "customNode",
              color: "#034b0c",
              image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
              inPoints: [0.5,0],
              outPoints: [0.2,1],
              isDoingStart: true,
              isDoingEnd: true,
              offsetX: 84,
              offsetY: 16,
              id: "node245",
            },
          ]
        }
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
    })
  },
  data() {
    return {
      editor: {},
      command: null,
      miniWidth:200,
      split1:.8
    };
  },
  methods: {
    init() {
      this.editor = new Editor();
      this.command = new command(this.editor);
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