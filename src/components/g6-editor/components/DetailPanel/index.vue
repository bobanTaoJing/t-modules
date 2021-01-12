<template>
  <div class="detailpannel">
    <div>
      <div v-if="status=='node-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">模型详情</div>
        <div class="block-container">
          <Row :gutter="10">
            <i-col :span="8">名称</i-col>
            <i-col :span="16">
              <i-input v-model="node.label" @change="handleChangeName" />
            </i-col>
            <i-col :span="8">任意属性</i-col>
            <i-col :span="16">
              <i-input v-model="node.xxx" />
            </i-col>
          </Row>
        </div>
      </div>
      <div v-else-if="status=='edge-selected'" class="pannel" id="node_detailpannel">
        <div class="pannel-title">线详情</div>
        <div class="block-container">
          <Row :gutter="10">
            <i-col :span="8">起点</i-col>
            <i-col :span="16">
              <i-input v-model="node.source.name" disabled />
            </i-col>
            <i-col :span="8">终点</i-col>
            <i-col :span="16">
              <i-input v-model="node.target.name" disabled />
            </i-col>
            <i-col :span="8">任意属性</i-col>
            <i-col :span="16">
              <i-input v-model="node.xxx" />
            </i-col>
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
import eventBus from "@/components/g6-editor/utils/eventBus";
import Grid from "@antv/g6/build/grid";
export default {
  data() {
    return {
      status: "canvas-selected",
      showGrid: false,
      page: {},
      graph: {},
      item: {},
      node: {},
      grid: null
    };
  },
  created() {
    this.init();
    this.bindEvent();
  },
  methods: {
    init() {},
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
          } else if (item.select === true && item.target.getType() === "edge"){
            self.status = "edge-selected";
            self.item = item.target;
            self.node = {
              source: item.target._cfg.source.getModel(),
              target: item.target._cfg.target.getModel(),
            };
            console.log(self.node)
          }
          else{
            self.status = "canvas-selected";
            self.item = null;
            self.node = null;
          }
        });
      });
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
    }
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
