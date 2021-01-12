<template>
    <div v-show="close" :style="overlayClickIndex==index?'z-index:2':''" ref="dom" id="overlay">
        <div class="top"></div>
        <div class="bottom"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="overlayTitle bgColorTitle" style="cursor: all-scroll;" @dblclick="isWinMax?winDef():winMax()" @click="$store.dispatch('setOverlayClickIndex',index)">
            <div class="toolBox">
                <slot name="icon">

                </slot>
                <Icon class="btn" style="cursor: default;" v-if="isWinMax" @click="winDef" type="ios-photos-outline" />
                <Icon class="btn" style="cursor: default;" type="md-expand" @click="winMax" v-else />
                <Icon class="btn" type="md-close" @click.stop="closeFun" style="font-size:22px;margin-left:5px;cursor: default;" />
            </div>
            <h3>{{title}}</h3>
        </div>
        <div class="overlayMain bgColorBody">
            <div v-if="maskOverlay" class="mask"></div>
            <slot name="main">

            </slot>
        </div>
        <slot name="footer">

        </slot>
    </div>
</template>
<script>
import tiframe from './tiframe'
export default {
    props:['close','title','width','height'],
    components:{tiframe},
    data(){
        return{
            index:'',
            bcTsvg:{},
            isWinMax:false
        }
    },
    computed:{
         maskOverlay(){
           return this.$store.getters.userInfo.maskOverlay
        },
        overlayCount(){
            return this.$store.getters.userInfo.overlayCount
        },
        overlayClickIndex(){
            return this.$store.getters.userInfo.overlayClickIndex
        }
    },
    mounted(){
        this.windowAddMouseWheel(this.width?this.width:800,this.height?this.height:600)
    },
    methods:{
        //弹框拖拽
        windowAddMouseWheel(width,height) {
            var tsvg = this.$refs.dom
            tsvg.style.position = 'fixed'
            
            tsvg.style.top = '40px'
            tsvg.style.left = (window.innerWidth - width)/2+'px'
            tsvg.style.width = width +'px'
            tsvg.style.height =height +'px'
            let timer = null
            tsvg.onmousedown = (e) => {
                this.$store.dispatch('setMaskOverlay',true)
                if(['top','bottom','right','left'].indexOf(e.target.className)>-1){
                    var hisTop = parseInt(tsvg.style.top.split('px')[0])
                    var hisLeft = parseInt(tsvg.style.left.split('px')[0])
                    var hisHeight = parseInt(tsvg.style.height.split('px')[0])
                    var hisWidth = parseInt(tsvg.style.width.split('px')[0])
                    // console.log(hisTop)
                    //event的兼容性
                    var ev = e;

                    //获取鼠标按下的坐标
                    var x1 = ev.clientX;
                    var y1 = ev.clientY;
                    var lt = 0;
                    var ls = 0;
                    //给可视区域添加鼠标的移动事件
                    document.onmousemove = function (ev) {
                        clearTimeout(timer)
                        timer = null
                        //event的兼容性
                        var ev = ev;

                        //获取鼠标移动时的坐标
                        var x2 = ev.clientX;
                        var y2 = ev.clientY;

                        //计算出鼠标的移动距离
                        var x = x2 - x1;
                        var y = y2 - y1;

                        //移动的数值与元素的left，top相加，得出元素的移动的距离
                        lt = y;
                        ls = x;
                        if(e.target.className == 'top'){
                            tsvg.style.top = y + hisTop +'px'
                            tsvg.style.height = (hisHeight - y)<100?100:(hisHeight - y) +'px'
                        }else if(e.target.className == 'bottom'){
                            // tsvg.style.top = y + hisTop
                            tsvg.style.height = (y + hisHeight)<100?100:(y + hisHeight) +'px'

                        }else if(e.target.className == 'left'){
                            tsvg.style.left = x + hisLeft +'px'
                            tsvg.style.width = (hisWidth - x)<100?100:(hisWidth - x) +'px'

                        }else if(e.target.className == 'right'){
                            // tsvg.style.left = x + hisLeft
                            tsvg.style.width = (hisWidth + x)<100?100:(hisWidth + x) +'px'

                        }
                    }
                }else{
                    var hisTop = parseInt(tsvg.style.top.split('px')[0])
                    var hisLeft = parseInt(tsvg.style.left.split('px')[0])
                    //event的兼容性
                    var ev = e;
    
                    //获取鼠标按下的坐标
                    var x1 = ev.clientX;
                    var y1 = ev.clientY;
                    var lt = 0;
                    var ls = 0;
                    //给可视区域添加鼠标的移动事件
                    document.onmousemove = function (ev) {
                        console.log('move')
                        //event的兼容性
                        var ev = ev || event;
    
                        //获取鼠标移动时的坐标
                        var x2 = ev.clientX;
                        var y2 = ev.clientY;
    
                        //计算出鼠标的移动距离
                        var x = x2 - x1 + hisLeft;
                        var y = y2 - y1 + hisTop;
    
                        //移动的数值与元素的left，top相加，得出元素的移动的距离
                        lt = y;
                        ls = x;
                        if(y<0) y=0
                        else if(y>window.innerHeight-30) y = window.innerHeight-30
                        if(x<-(tsvg.style.width.split('px')[0] - 30)){
                            x = tsvg.style.width.split('px')[0] - 30
                        }else if(x>(window.innerWidth + tsvg.style.width.split('px')[0] - 30)){
                            x = window.innerWidth - 30
                        }
                        tsvg.style.top = y+'px'
                        tsvg.style.left = x+'px'
                    }
                }

                //清除
                tsvg.onmouseup = (ev)=> {
                    document.onmousemove = null;
                    this.$store.dispatch('setMaskOverlay',false)
                }
                document.onmouseup = (ev)=> {
                    document.onmousemove = null;
                    this.$store.dispatch('setMaskOverlay',false)

                }
            }
        },
        closeFun(){
            this.$emit('update:close',false)
        },
        //最大化
        winMax(){
            console.log('winmax')
            //存储当前定位
            var tsvg = this.$refs.dom
            this.bcTsvg = {
                top:tsvg.style.top,
                left:tsvg.style.left,
                width:tsvg.style.width,
                height:tsvg.style.height,
            }

            tsvg.style.width = window.innerWidth - 8 +'px'
            tsvg.style.height = window.innerHeight - 8 +'px'
            tsvg.style.top = '4px'
            tsvg.style.left = '4px'
            this.isWinMax = true
        },
        //还原大小
        winDef(){
            var tsvg = this.$refs.dom

            tsvg.style.width = this.bcTsvg.width
            tsvg.style.height = this.bcTsvg.height
            tsvg.style.top = this.bcTsvg.top
            tsvg.style.left = this.bcTsvg.left
            this.isWinMax = false
        }
    },
    beforeDestroy(){
        this.$refs.dom.onmousedown = null
    },
    watch:{
        close(){
            let count = this.overlayCount
            if(this.close){
                this.$store.dispatch('setOverlayCount',count+1)
                this.index = count+1
                this.$store.dispatch('setOverlayClickIndex',this.index)
            }
        },
        $route(){
            this.closeFun()
        }
    }
}
</script>
<style>
    #overlay{
        position: fixed;
        top: 20px;
        left: 100px;
        width: 800px;
        height: 600px;
        text-align: center;
        z-index: 1;
        background: #252526;
        box-shadow: 0 0 6px 3px #141313;
        /* border: 1px solid #ddd;
        box-shadow: 0px 0px 3px 1px #ececec; */
        /* display: none; */
    }
    #overlay .overlayTitle{
        /* background:#3C3C3C; */
        height:30px;
        line-height:30px;
        position:relative;
    }
    #overlay .overlayTitle .toolBox{
        position:absolute;right:5px;top:0px;font-size:18px;
    }
    #overlay .overlayMain{
        position: relative;
        height:calc(100% - 30px);
        /* overflow:auto; */
    }
    #overlay .overlayFooter{
        background:#3C3C3C;
        height:50px;
        line-height:50px;
        position:relative;
    }
    .top,.bottom,.left,.right{
        position:absolute;
    }
    .top{
        width:100%;
        height:5px;
        top:-5px;
        left:0;
        cursor: n-resize;
    }
    .bottom{
        width:100%;
        height:5px;
        bottom:-5px;
        left:0;
        cursor: n-resize;
    }
    .left{
        width:5px;
        height:100%;
        top:0;
        left:-5px;
        cursor: e-resize;
    }
    .right{
        width:5px;
        height:100%;
        top:0;
        right:-5px;
        cursor: e-resize;
    }
</style>