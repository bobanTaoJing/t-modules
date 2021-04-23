<template>
  <div id="app">
    <div style="width:200px;float:left">
      <template v-for="(item,index) in allcomNames">
        <p @click="show=item" :class="{menuli:true,checked:show==item}" :key="index">{{item}}</p>
      </template>
    </div>
    <div style="width:calc(100% - 200px);float:left;height:100vh">
      <template v-for="(item,index) in allcomNames">
        <component :is="item" v-if="show==item" :key="index"></component>
      </template>
    </div>
  </div>
</template>

<script>
import * as allcom from './view/index.js'

export default {
  name: 'App',
  components: allcom,
  data(){
    return{
      show:'crudViewExample',
      allcomNames:[]
    }
  },
  mounted(){
    for(let a in allcom){
      console.log(a)
      this.allcomNames.push(a)
    }
  }
}
</script>

<style>
#app {
  /* font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale; */
  /* text-align: center; */
  /* color: #2c3e50;
  margin-top: 60px; */
  height:100vh;
  box-sizing: border-box;
  min-width:1080px;
  /* background: #ddd; */
}
body{
  margin:0;
}
.right{
  position:absolute;
        width:5px;
        height:100%;
        top:0;
        right:-5px;
        cursor: e-resize;
        z-index: 3;
    }
</style>
<style scoped>
.menuli{
  padding: 10px;
}
  .menuli:hover{
    background: #7b98ce78;
    padding: 10px;
    color: #fff;
  }
  .checked{
    background: #7b98ce;
    padding: 10px;
    color: #fff;
  }
</style>
