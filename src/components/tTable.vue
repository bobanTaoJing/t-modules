<template>
<div :style="'height:'+(height)+'px;position:relative;'+(columns.length<=0?'border:1px solid #ddd':'')">
    <!-- <Spin size="large" fix v-if="loading"></Spin> -->
    <div v-if="columns.length<=0" style="position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            height: 30px;
                            width: 100px;">{{'暂无数据'}}</div>
    <div style="height:42px;overflow:hidden;user-select: none;">
        <div @scroll="tableSroll" ref="tableHeader"
         :style="{color:headerStyle.color,background:headerStyle.bgColor,fontSize:headerStyle.size+'px',fontWeight:headerStyle.weight}" style="white-space: nowrap;overflow-x:auto;overflow-y:hidden;font-weight:bold">
            <div v-for="(item,index) in columns" :style="'width:'+(newWidths[index]?newWidths[index]:item.width)+'px; display:inline-block;position:relative;height:40px;line-height:40px;overflow:hidden;border-right:1px solid #6f707085;border-top:1px solid #6f707085;border-bottom:1px solid #6f707085;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index">
                <div style="padding-left:3px;" :style="item.titleStyle?item.titleStyle:''">
                    {{item.title}}
                </div>
                <div class="right" @mousedown="moveIndex=index;honmousedown($event)" @mouseup="hmouseup"></div>
            </div>
            <div v-if="(data.length*30)>(height - 42)" style="display:inline-block;width:8px;height:40px;line-height:40px;;background:#E0E2E2;vertical-align: bottom;opacity:0"></div>
        </div>
    </div>
    <div @scroll="tableSroll2" class="tableBody" ref="tableBody" 
    :style="{color:bodyStyle.color,background:bodyStyle.bgColor,fontSize:bodyStyle.size+'px',fontWeight:bodyStyle.weight,height:height - 42 +'px'}" style="overflow:auto;'">
        <!-- <div> -->
            <div v-for="(item,index) in data" :key="index" style="white-space: nowrap;height:30px;" :style="data&&data.length>0?'':'opacity:0'">
                <div v-for="(itemf,indexf) in columns" :key="indexf+'-'+index" :style="'width:'+(newWidths[indexf]?newWidths[indexf]:itemf.width)+'px;display:inline-block;border-right:1px solid #6f707085;border-bottom:1px solid #6f707085;overflow:hidden;'+(indexf==0?'border-left:1px solid #6f707085;':'')"  style="height: 30px;border-bottom:1px solid #6f707085;">
                    <div v-if="itemf.html" v-html="itemf.html(item)"
                        @click="itemf.click?itemf.click(item):''">
                    </div>
                    <div v-else @click="itemf.click?itemf.click(item):''" :style="item.valueStyle?item.valueStyle:''" style="padding-left:3px;line-height: 30px;">{{item[itemf.key]}}</div>
                </div>
            </div>
        <!-- </div> -->
    </div>
</div>
</template>

<script>
export default {
    name:'tTable',
    props:{
        columns:{
            type:Array,
            default:function(){
                return []
            }
        },
        data:{
            type:Array,
            default:function(){
                return []
            }
        },
        height:{
            type:Number,
            default:400
        },
        loading:{
            type:Boolean,
            default:false
        },
        headerStyle:{
            type:Object,
            default:function(){
                return {
                    color:'#000',
                    bgColor:'#fff',
                    size:16,
                    weight:600
                }
            }
        },
        bodyStyle:{
            type:Object,
            default:function(){
                return {
                    color:'#000',
                    bgColor:'#fff',
                    size:16,
                    weight:300
                }
            }
        }
    },
    data(){
        return{
            newWidths:{},
            moveIndex:-1
        }
    },
    computed:{
        // hcolumns(){
        //     let arr = [],allWidth=0
        //     for(let a of this.columns){
        //         if(a.width){
        //             allWidth+=a.width
        //             a.width+='px'
        //         }
        //         else{

        //         }
        //     }
        // }
    },
    mounted() {
        document.onmouseup = () => {
            this.moveIndex = -1
            document.onmousemove = null;

        }
    },
    methods: {
        tableSroll2() {
            this.$refs.tableHeader.scrollLeft = this.$refs.tableBody.scrollLeft
        },
        tableSroll() {
            this.$refs.tableBody.scrollLeft = this.$refs.tableHeader.scrollLeft
        },
        honmousedown(e) {
            this.$nextTick(() => {
                if (['right'].indexOf(e.target.className) > -1 && this.moveIndex > -1) {
                    //event的兼容性
                    let hisWidth = this.newWidths[this.moveIndex] ? this.newWidths[this.moveIndex] : this.columns[this.moveIndex].width
                    //获取鼠标按下的坐标
                    var x1 = e.clientX;
                    // var y1 = e.clientY;
                    //给可视区域添加鼠标的移动事件
                    document.onmousemove = (ev) => {
                        //event的兼容性

                        //获取鼠标移动时的坐标
                        var x2 = ev.clientX;
                        // var y2 = ev.clientY;

                        //计算出鼠标的移动距离
                        var x = x2 - x1;
                        // var y = y2 - y1;

                        //移动的数值与元素的left，top相加，得出元素的移动的距离
                        if (e.target.className == 'right') {
                            // tsvg.style.left = x + hisLeft
                                this.$set(this.newWidths, this.moveIndex, (hisWidth + x) < 30 ? 30 : (hisWidth + x))
                            // this.newWidths[this.moveIndex] = (hisWidth + x)<30?30:(hisWidth + x)
                            // this.columns1[this.moveIndex].width = (hisWidth + x)<30?30:(hisWidth + x)

                        }
                    }
                }
            })
        },
        hmouseup() {
            this.moveIndex = -1
            document.onmousemove = null;
        },
    },
}
</script>
<style scoped>
.right{
    position:absolute;
        width:10px;
        height:100%;
        top:0;
        right:-5px;
        cursor: e-resize;
    }
    .tableBody::-webkit-scrollbar{
    height:10px;
    width:8px;
}
 /*定义滚动条轨道 内阴影+圆角*/
  .tableBody::-webkit-scrollbar-track {
    border: none;
    background-color: #fff; /*滚动条的背景颜色*/
  }
  /*定义滑块 内阴影+圆角*/
 .tableBody::-webkit-scrollbar-thumb {
   background-color: #46464795; /*滚动条的背景颜色*/
 }
   /* ::-webkit-scrollbar-corner {
     background-color: #035252;
   } */
  
p{
    margin:0;
}
</style>
