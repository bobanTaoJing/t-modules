<template>
  <ul ref="itemBox">
    <li
      v-for="(item,index) in list"
      :key="index"
      class="getItem"
      :data-shape="item.shape"
      :data-type="item.type"
      :data-size="item.size"
      draggable
      @dragstart="handleDragstart"
      @dragend="handleDragEnd($event,item)"
    >
      <span class="pannel-type-icon" :style="{background:'url('+item.image+')'}"></span>
      {{item.name}}
    </li>
  </ul>
</template>

<script>
import eventBus from "@/components/g6-editor/utils/eventBus";
import okSvg from "@/components/g6-editor/assets/icons/ok.svg";
import bgImg from "@/components/g6-editor/assets/bg.jpg";
export default {
  data() {
    return {
      page: null,
      command: null,
      offsetX: 0,
      offsetY: 0,
      list: [
        {
          name: "表圆节点",
          label: "表圆节点",
          size: "80*80",
          type: "node",
          nodeType:'circle',
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          // stateImage: okSvg,
          inPoints: [[0.5, 0]],
          outPoints: [[0.2, 1]],
          isDoingStart: true,
          isDoingEnd:true
        },
        {
          name: "表节点",
          label: "表节点",
          objects:[
            {name:'id',type:'bigint'},
            {name:'name',type:'varchar'},
            {name:'create_time',type:'datetime'}
          ],
          size: "170*34",
          type: "node",
          nodeType:'table',
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          // stateImage: okSvg,
          inPoints: [[0.5, 0],[0, 0.7]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "表节点2",
          label: "表节点2",
          objects:[
            {name:'id',type:'bigint'},
            {name:'name',type:'varchar'},
            {name:'create_time长度测试create_time长度测试create_time长度测试',type:'datetime'},
            {name:'create_time',type:'datetime'},
            {name:'create_time',type:'datetime'},
            {name:'create_time',type:'datetime'},
          ],
          size: "170*34",
          type: "node",
          nodeType:'table',
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          // stateImage: okSvg,
          inPoints: [[0.5, 0],[0, 0.7]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "测试节点",
          label: "测试节点",
          size: "170*80",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0.5, 0],[0, 0.7]],
          outPoints: [[1, 0.5]]
        },

        {
          name: "背景图片节点",
          label: "背景图片节点",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          backImage: bgImg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "双输出节点",
          label: "双输出节点",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.4], [1, 0.6]]
        },
        {
          name: "大型节点",
          label: "大型节点",
          size: "340*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]]
        },
        {
          name: "动画开始节点",
          label: "动画开始",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingStart: true
        },
        {
          name: "动画结束节点",
          label: "动画结束",
          size: "170*34",
          type: "node",
          x: 0,
          y: 0,
          shape: "customNode",
          color: "#1890ff",
          image:
            "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
          stateImage: okSvg,
          inPoints: [[0, 0.5]],
          outPoints: [[1, 0.5]],
          isDoingEnd: true
        }
      ]
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    handleDragstart(e) {
      this.offsetX = e.offsetX;
      this.offsetY = e.offsetY;
    },
    //判断是否拖到编辑器中
    isDragOnEditor(value){
      let x = this.$refs.itemBox.offsetWidth,parent = this.$refs.itemBox.offsetParent
      while(parent!==null){
        x+=parent.offsetLeft
        parent = parent.offsetParent
      }
      return value>x
    },
    handleDragEnd(e, item) {
      console.log(this.$refs)
      console.log(e)
      item.color = '#'+this.getColor('')
      if(!this.isDragOnEditor(e.screenX)) return
      let data = {};
      Object.assign(data, item);
      data.offsetX = this.offsetX;
      data.offsetY = this.offsetY;
      if (this.page) {
        const graph = this.page.graph;
        // const size = e.target.dataset.size.split("*");
        const xy = graph.getPointByClient(e.x, e.y);
        data.x = xy.x;
        data.y = xy.y;
        data.size = item.size.split("*");
        data.type = "node";
        this.command.executeCommand("add", [data]);
      }
    },
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
        this.command = page.command;
      });
    },
    getColor(color){
      let base = '0123401234abcabc'//浅色
      // let base = '5678956789defdef'//深色
      return(color += base [Math.floor(Math.random() * 16)]) &&
            (color.length == 6) ? color : this.getColor(color)
    }
  }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempannel ul {
  padding: 0px;
  padding-left: 16px;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  width: 160px;
  height: 28px;
  line-height: 26px;
  padding-left: 8px;
  border: 1px solid rgba(0, 0, 0, 0);
  list-style-type: none;
}
.itempannel li:hover {
  background: white;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>