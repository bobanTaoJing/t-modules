<template>
    <div class="historyRoute" style="width:100%;box-shadow:inset 0 0 3px 2px hsla(0,0%,39.2%,.1);height:36px;padding:2px 0;
    margin-bottom: 9px;">
          <Button @click="moveMenu(1)" class="menu" style="float:left;height:100%;border:none;background:#fff !important;color:#515A6E !important">
            <Icon type="ios-arrow-back" />
          </Button>
          <div ref="menusBox" style="width:calc(100% - 100px);float:left;height:30px;position:relative;overflow:hidden">
            <div ref="menusBox2" :style="'width:max-content;position:absolute;left:'+left+'px'">
              <p class="menu" v-for="(item,index) in menu" :key="index" @click="$router.push(item.path)">
                <Icon type="md-disc" style="font-size:16px;vertical-align: sub;margin-right:5px" :class="{checkedRoute:item.path==nowPath}" />{{item.name}}
                <Icon class="iconClickHover" v-show="item.name!='首页'" style="font-size:14px;" @click.stop="deleteRoute(index)" type="ios-close" />
              </p>
              <div style="clear:both"></div>
            </div>
          </div>
          <!-- <ul style="list-style:none">
            <li v-for="(item,index) in menu" :key="index" @click="$router.push(item.path)">
              <Icon type="md-disc" :style="item.path==nowPath?'color:#2D8CF0;':''" />{{item.meta.title}}
              <Icon class="iconClickHover" @click.stop="deleteRoute(index)" type="ios-close" />
            </li>
            <li style="clear:both"></li>
          </ul> -->
          <Button class="menu" @click="moveMenu(-1)" style="float:right;height:100%;border:none;background:#fff !important;color:#515A6E !important">
            <Icon type="ios-arrow-forward" />
          </Button>
          <div style="clear:both"></div>
        </div>
</template>
<script>
//历史路由
export default {
  data(){
    return{
      nowPath:'',
      left:0
    }
  },
    computed:{
        menu(){
            return this.$store.getters.userInfo.menu?this.$store.getters.userInfo.menu:[]
        }
    },
    mounted(){
      console.log(this.$route)
      this.nowPath = this.$route.path
    },
    methods:{
      moveMenu(value){

        let width = this.$refs.menusBox2.offsetWidth - this.$refs.menusBox.offsetWidth
        if(width<= 0) return
        if((this.left + (value*100))>0){
          this.left = 0
        }else{
          if((this.left + (value*100))<0)
          this.left = -width
          else this.left +=(value*100)
        }
      },
      deleteRoute(index){
        if(this.nowPath==this.menu[index].path){
          if(index>0) this.$router.push(this.menu[index-1].path)
          else{
            if(this.menu[index+1]) this.$router.push(this.menu[index+1].path)
          }
        }
        this.$store.dispatch('delMenu', {index});
      }
    },
    watch:{
      $route(){
        this.nowPath = this.$route.path
      }
    }
}
</script>
<style scoped>
  .historyRoute .menu{
    float:left;
  height: 100%;
    line-height: 30px;
    padding: 0 12px;
    margin:0 5px;
    cursor: pointer;
  }
  .historyRoute .menu:hover{
    opacity: .85;
  }
</style>