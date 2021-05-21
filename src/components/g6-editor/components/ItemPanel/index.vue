<template>
  <div class="itempannel" :style="close?'width:0px':''">
    <div class="closeBtn" @click="close=!close,close?$emit('reflashPage',close):$emit('reflashPage',close)">
      <Icon v-if="!close" type="md-arrow-round-back" />
      <Icon v-if="close" type="md-arrow-round-forward" />
    </div>
    <div v-if="!close" style="height:100%;overflow:auto">
      <Item :ip="ip" :headers="headers"/>
    </div>
  </div>
</template>

<script>
import Item from "./item";
import eventBus from "../../../../components/g6-editor/utils/eventBus";
export default {
  props:['ip','headers'],
  components: { Item },
  data() {
    return {
      page: null,
      command:null,
      close:false
    };
  },
  created() {
    this.bindEvent();
  },
  methods: {
    bindEvent() {
      eventBus.$on("afterAddPage", page => {
        this.page = page;
      });
    },
  }
};
</script>

<style scoped>
.closeBtn{
  position:absolute;right:-20px;font-size:20px;background:#fff;
  cursor: pointer;
}
.closeBtn:hover{
  background: #6591c7;
  color:#fff;
}
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
  /* overflow:auto; */
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