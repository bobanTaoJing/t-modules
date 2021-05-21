<template>
  <div ref="edit" style="height:calc(100vh - 130px)">
    <G6Editor ref="g6editor" v-if="!onlyRead" :ip="ip" :headers="headers" @updateSuc="updateSuc" :jobItem="jobItem" :width="width" :checked="checked" :height="height" :data="pageData"
    :runTime="runTime" mode="edit">

    </G6Editor>
    <G6EditorOnlyRead ref="G6EditorOnlyRead" v-else :ip="ip" :headers="headers" :width="width" :checked="checked" :height="400" :data="pageData"
    :runTime="true" mode="edit">

    </G6EditorOnlyRead>
  </div>
</template>

<script>
import G6Editor from './components/G6Editor/index'
import G6EditorOnlyRead from './components/G6Editor/onlyReadIndex'
import eventBus from "../../components/g6-editor/utils/eventBus";
export default {
  components:{G6Editor,G6EditorOnlyRead},
  props:{
    checked:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        onlyRead:{
            type:Boolean,
            default:false
        },
        runTime:{
          type:Boolean,
          default:false
        },
        jobItem:{
          type:Object,
          default:()=>{
            return{}
          }
        },
        ip:{
        },
        headers:{}
  },
  data(){
    return{
      width:700,
      height:500,
      pageData:{nodes:[],edges:[]}
    }
  },
  mounted(){
    this.init()
  },
  methods:{
    init(){
      this.width = this.$refs.edit.offsetWidth
      this.height = this.$refs.edit.offsetHeight - 50
      if(this.height<500) this.height = 500
      if(!this.checked.id) return
      let obj = this.checked,nodes=[],edges=[]
      for(let a of obj.nodes){
        let nodeInfo = a.nodeInfo?JSON.parse(a.nodeInfo):{}
        nodeInfo.operatorName = a.operatorName
        nodes.push(nodeInfo)
      }
      for(let a of obj.edges){
        let edgeInfo = a.edgeInfo?JSON.parse(a.edgeInfo):{}
        edges.push(edgeInfo)
      }
      this.pageData = {
        nodes,edges
      }
      
    },
    updateSuc(obj){
      this.$emit('updateSuc',obj)
    }
  },
  beforeDestroy(){
    eventBus.$off('contextmenuClick')
    eventBus.$off('mousedown')
    eventBus.$off('afterAddPage')
    eventBus.$off('deleteItemAfter')
    eventBus.$off('nodeselectchange')
    eventBus.$off('add')
    eventBus.$off('update')
    eventBus.$off('delete')
    eventBus.$off('updateItem')
    eventBus.$off('addItem')
    eventBus.$off('nodeselectchange')
    eventBus.$off('deleteItem')
    eventBus.$off('muliteSelectEnd')
  }
}
</script>

<style>
html, body {
    overflow: hidden;
    margin: 0;
    font-size: 12px;
}
#app{
  margin: 0;
  padding: 0;
}
</style>
