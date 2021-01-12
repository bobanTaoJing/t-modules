<template>
  <!--步骤1：嵌套task-node节点，这里吧整行copy到你要扩展的节点中，高宽自行设置-->
  <!-- <task-node :node="node" width="200" height="100" v-on:on-select="selectNodeMethod" :draggable="false" v-on:on-drag-ging="dragGing" v-on:on-drag-start="dragStart" v-on:on-drag-end="dragEnd" v-on:updateTem="updateTemp" v-on:on-mouse="mouseMenu">  -->
  <task-node :node="node" width="200" height="100" v-on:on-select="selectNodeMethod" :draggable="false" v-on:updateTem="updateTemp" v-on:on-mouse="mouseMenu"> 
    <div :class="prefixCls" style="cursor: default;">
      <!-- <i-table border :columns="columns" :data="node.tableData">
        <template slot-scope="{ row }" slot="port">
          <div class="left-in">
            <task-in-port v-if="row.nodeType=='in'" :tableNodePid="row.tableNodePid" v-on:on-add-path='addPath' :class="{'is-connected-left':row.isConnected}"></task-in-port>
          </div>
            <task-out-port v-if="row.nodeType=='out'" :tableNodePid="row.tableNodePid" v-on:on-add-path='addPath' :class="{'is-connected-left':row.isConnected}"></task-out-port>
        </template>
      </i-table> -->
        <table class="task-table">
            <thead style=" background: #504242;height:36px;line-height:36px;">
                <tr>
                    <th></th>
                    <th v-for="(item,index) in node.columns" :style="'width:'+item.width+'px'">{{item.name}}
                       <!-- <Icon v-if="index == node.columns.length-1" type="md-create" @click="isEditor=!isEditor" :class="{isEditor:isEditor}" style="cursor:pointer;float:right;margin-top:3px;" /> -->
                    </th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="node.tableData">
                    <tr v-for="(item,index) in node.tableData" style="    border-bottom: 1px solid #635555;">
                        <td>
                            <task-in-port v-if="node.id=='node2'" :pid="item.tableNodePid" v-on:on-add-path='addPath' style="position:relative;left:-5px;" :class="{'is-connected-left':item.isConnected}"></task-in-port>
                        </td>
                        <td v-for="(item2,index) in node.columns" style="padding:5px 5px 0 5px;height:36px;line-height:36px;box-sizing:border-box;">
                          <i-input type="text" v-model="item[item2.key]" size="small" :style="'line-height: normal;height:30px;background:#B7B1B1;font-family: auto;width:'+item2.width+'px'"></i-input>
                          <!-- <div v-else :style="'width:'+item2.width+'px'">{{item[item2.key]}}</div> -->
                        </td>
                        <td>
                            <task-out-port v-if="node.id=='node1'" :pid="item.tableNodePid" v-on:on-add-path='addPath'></task-out-port>
                            
                        </td>
                    </tr>
                    <tr style="    border-bottom: 1px solid #635555;height:30px;">
                      <td :colspan="4" style="cursor:pointer" @click="addNewLine">添加一行 +</td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
  </task-node>
</template>
<script>
import { NodeMix } from '../../../../self_node_modules/vue-task-node/src/lib'//步骤4:必需混入NodeMix，因为<task-node>中的方法都存放在此js中
export default {
  components: {},
  mixins: [ NodeMix ],//混入NodeMix
  name: 'node-erhombus',//自己取的节点名称
  data () {
    return {
      prefixCls: 'node-erhombus-class',
      isEditor:false,
      columns:[
        {
          title:'1',
          slot:'port'
        },{
          title:'源头表字段',
          key:'name'
        },{
          title:'类型',
          key:'type'
        }
      ]
    }
  },
  props: {
    node: {//步骤5:这里根据task-node的数据结构及task-in-port和task-out-port的数据结构，来设计自己的数据格式
      id: [String, Number],
      name: {
        type: [String, Number],
        default: '节点'
      },
      positionX: {
        type: [String, Number],
        default: 0
      },
      positionY: {
        type: [String, Number],
        default: 0
      },
      icon: [String, Number],
      state: {
        type: [String, Number],
        default: 'ready'
      },
    }
  },
  methods: {
    addNewLine(){
      this.isEditor = true
      let allPid = []
      for(let a of this.node.tableData){
        allPid.push(a.tableNodePid.split(this.node.id+'_')[1])
      }
      let obj = {}
      for(let a of this.node.columns){
        obj[a.key] = ''
      }
      let tableNodePid = allPid.length>0?parseInt(Math.max(...allPid)) + 1:0
     this.node.tableData.push(
          Object.assign(obj,
                        {
                          tableNodePid:this.node.id+'_'+tableNodePid,
                          nodeType:this.node.id=='node1'?'out':'in'
                        }
          )
      )
    }
  }
}
</script>
<style scoped>
  .isEditor{
    box-shadow: 0px 0px 2px 2px #2b2424 inset;
  }
</style>
<style>
.task-table{
user-select:none;    border-collapse: collapse;    background: #b7b1b1;
    box-shadow: 0px 0px 5px 1px #403d3d;line-height:30px;
    color: #fff;
}
.task-table .ivu-input{
  background: #B7B1B1 !important;
}
  /* .top-in{
    clear: both;
    margin-top: -5px;
    float: left;
    width: 30px;
    height: 30px;
  }
  .left-out{
    clear: both;
    float: left;
    margin-left: -5px;
    height: 30px;
  }
  .left-in{
    clear: both;
    float: left;
    margin-top: -5px;
    height: 30px;
  }
  .right-out{
      clear: both;
    float: right;
    margin-right: -5px;
    height: 30px;
  }
  .bottom-out{
    clear: both;
    float: left;
    width: 30px;
  }
  .node-erhombus-class{
    height: 160px;
    width: 200px;
    border: 1px solid #289de9;
    cursor: default;
  } */
  .is-connected-left {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 4px 5px;
    border-color: transparent transparent transparent gray;
    background-color: transparent;
    border-radius: 0;
    /* margin-top:-5px; */
    }
</style>
