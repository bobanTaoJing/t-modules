<template>
  <div id="navigator" style="overflow:auto">
    <div class="pannel-title">导航器</div>
    <div id="minimap" class="minimap" ref="minimap" style="width:200px;height:100px;    border: 1px solid; padding:0 5px;margin-left:7px;overflow:hidden"></div>
    <!-- <div>
      <Slider v-model="value1"></Slider>
      <span></span>
    </div> -->
    <!-- <div id="zoom-slider">
      <a class="zoom-dropdown-btn ant-dropdown-trigger" href="#">
        100 %
        <i class="anticon anticon-down"></i>
      </a>
    </div> -->
  </div>
</template>

<script>
import Minimap from "@antv/g6/build/minimap";
import eventBus from "../../../../components/g6-editor/utils/eventBus";
import Util from "@antv/g6/src/util";
export default {
  props:{
    width:{
      type:Number,
      default:200
    }
  },
  data() {
    return {
      minimap: null,
      graph: null
    };
  },
  created() {
    this.bindEvent();
  },
  mounted() {
    this.$nextTick(() => {
      this.initMinmap();
    });
  },
  methods: {
    reflash(){
      this.graph.removePlugin(this.minimap)
      this.minimap = null
      this.initMinmap()
      this.graph.addPlugin(this.minimap)
      // this.initMinmap()
    },
    initMinmap() {
      console.log(this.width)
      const cfgs = {
        container: "minimap",
        size:[this.width,100]
      };
      if(this.minimap){
        this.minimap._updateViewport({ refresh:true,size:[this.width,100] })
      }else{
        this.minimap = new Minimap({ ...cfgs });
      }
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.graph = page.graph;
        this.bindPage();
      });
    },
    bindPage() {
      if (!this.minimap || !this.graph) {
        return;
      }
     this.graph.addPlugin(this.minimap)
    },
    handleZoomIn() {
          const currentZoom = this.graph.getZoom();
          this.graph.zoomTo(currentZoom + 0.5, this.getViewCenter());
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
  }
};
</script>

<style scoped>
#navigator {
  width: 100%;
  height: 162px;
  position: absolute;
  bottom: 0px;
  right: 0px;
  z-index: 3;
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
