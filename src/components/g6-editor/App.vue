<template>
  <div ref="edit" style="height:100%">
    <G6Editor :width="width" :height="height" mode="edit">

    </G6Editor>
  </div>
</template>

<script>
import G6Editor from './components/G6Editor'
export default {
  components:{G6Editor},
  data(){
    return{
      width:700,
      height:500,
      show:false
    }
  },
  mounted(){
    console.log(this.$refs)
    this.width = this.$refs.edit.offsetWidth
    this.height = this.$refs.edit.offsetHeight - 50
    this.$nextTick(()=>{
      this.show = true
    })
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
