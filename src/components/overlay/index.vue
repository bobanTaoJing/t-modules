<template>
    <div v-show="close" :style="overlayClickIndex==index?'z-index:13':''" ref="dom" class="tOverlay">
        <template v-if="!disabled">
            <div @mousemove="canMove=true" class="top"></div>
            <div @mousemove="canMove=true" class="bottom"></div>
            <div @mousemove="canMove=true" class="left"></div>
            <div @mousemove="canMove=true" class="right"></div>
        </template>
        <div class="overlayTitle bgColorTitle" style="cursor: all-scroll;" @dblclick="isWinMax?winDef():winMax()" @mousemove="canMove=true" @click="$store.dispatch('setOverlayClickIndex',index)">
            <div class="toolBox" v-if="!disabled">
                <slot name="icon">

                </slot>
                <!-- <Icon class="btn" style="cursor: default;" v-if="isWinMax" @click="winDef" type="ios-photos-outline" />
                <Icon class="btn" style="cursor: default;" type="md-expand" @click="winMax" v-else /> -->
                <span style="padding:0 5px">
                    <svg t="1608260585006" v-if="isWinMax" @click="winDef" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4775" width="16" height="20"><path d="M351.665658 639.937506h0.699931c17.398301 0 31.696905 14.298604 31.696905 31.696905v320.668684c0 17.398301-14.298604 31.696905-31.696905 31.696905h-0.699931c-17.398301 0-31.696905-14.298604-31.696905-31.696905V671.634411c0-17.398301 14.298604-31.696905 31.696905-31.696905z" fill="currentColor" p-id="4776"></path><path d="M0 672.234352v-0.699932C0 654.23611 14.198613 639.937506 31.696905 639.937506h320.668684c17.398301 0 31.696905 14.298604 31.696905 31.696905v0.699931c0 17.398301-14.298604 31.696905-31.696905 31.696905H31.696905C14.198613 703.931257 0 689.732643 0 672.234352z" fill="currentColor" p-id="4777"></path><path d="M374.263451 649.136608l0.499951 0.499951c12.298799 12.298799 12.298799 32.496826 0 44.795625L55.494581 1013.601016c-12.298799 12.298799-32.496826 12.298799-44.795626 0l-0.499951-0.499952c-12.298799-12.298799-12.298799-32.496826 0-44.795625l319.168831-319.168831c12.398789-12.298799 32.596817-12.298799 44.895616 0z" fill="currentColor" p-id="4778"></path><path d="M672.234352 639.937506h-0.699932c-17.398301 0-31.696905 14.298604-31.696904 31.696905v320.668684c0 17.398301 14.298604 31.696905 31.696904 31.696905h0.699932c17.398301 0 31.696905-14.298604 31.696905-31.696905V671.634411c0-17.398301-14.198613-31.696905-31.696905-31.696905z" fill="currentColor" p-id="4779"></path><path d="M1023.90001 672.234352v-0.699932c0-17.398301-14.298604-31.696905-31.696905-31.696904H671.634411c-17.398301 0-31.696905 14.298604-31.696905 31.696904v0.699932c0 17.398301 14.298604 31.696905 31.696905 31.696905h320.668684c17.398301 0 31.596914-14.198613 31.596915-31.696905z" fill="currentColor" p-id="4780"></path><path d="M649.636559 649.136608l-0.499951 0.499951c-12.298799 12.298799-12.298799 32.496826 0 44.795625l319.168831 319.168832c12.298799 12.298799 32.496826 12.298799 44.795625 0l0.499952-0.499952c12.298799-12.298799 12.298799-32.496826 0-44.795625L694.432184 649.136608c-12.298799-12.298799-32.496826-12.298799-44.795625 0z" fill="currentColor" p-id="4781"></path><path d="M351.665658 383.962504h0.699931c17.398301 0 31.696905-14.298604 31.696905-31.696905V31.696905C383.962504 14.198613 369.76389 0 352.265599 0h-0.699932C334.267357 0 319.968753 14.198613 319.968753 31.696905v320.668684c0 17.398301 14.298604 31.596914 31.696905 31.596915z" fill="currentColor" p-id="4782"></path><path d="M0 351.665658v0.699931C0 369.76389 14.198613 383.962504 31.696905 383.962504h320.668684c17.398301 0 31.696905-14.298604 31.696905-31.696905v-0.699932c0-17.398301-14.298604-31.696905-31.696905-31.696904H31.696905C14.198613 319.968753 0 334.267357 0 351.665658z" fill="currentColor" p-id="4783"></path><path d="M374.263451 374.763402l0.499951-0.499951c12.298799-12.298799 12.298799-32.496826 0-44.795626L55.494581 10.298994C43.195782-1.999805 22.997754-1.999805 10.698955 10.298994l-0.499951 0.499951c-12.298799 12.298799-12.298799 32.496826 0 44.795626l319.168831 319.168831c12.398789 12.298799 32.596817 12.298799 44.895616 0z" fill="currentColor" p-id="4784"></path><path d="M672.234352 383.962504h-0.699932c-17.398301 0-31.696905-14.298604-31.696904-31.696905V31.696905C639.937506 14.198613 654.23611 0 671.634411 0h0.699931C689.732643 0 703.931257 14.198613 703.931257 31.696905v320.668684c0 17.398301-14.198613 31.596914-31.696905 31.596915z" fill="currentColor" p-id="4785"></path><path d="M1023.90001 351.665658v0.699931c0 17.398301-14.298604 31.696905-31.696905 31.696905H671.634411c-17.398301 0-31.696905-14.298604-31.696905-31.696905v-0.699931c0-17.398301 14.298604-31.696905 31.696905-31.696905h320.668684c17.398301 0 31.596914 14.298604 31.596915 31.696905z" fill="currentColor" p-id="4786"></path><path d="M649.636559 374.763402l-0.499951-0.499951c-12.298799-12.298799-12.298799-32.496826 0-44.795626L968.405429 10.298994c12.298799-12.298799 32.496826-12.298799 44.795626 0l0.499951 0.499951c12.298799 12.298799 12.298799 32.496826 0 44.795626L694.432184 374.763402c-12.298799 12.298799-32.496826 12.298799-44.795625 0z" fill="currentColor" p-id="4787"></path></svg>
                    <svg t="1608260359922" v-else class="icon" @click="winMax" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4148" width="16" height="20"><path d="M32.321058 1023.900012h-0.699915C14.223267 1023.900012 0.025 1009.701745 0.025 992.203881V671.543025C0.025 654.245136 14.223267 639.946881 31.721131 639.946881h0.699914c17.397876 0 31.696131 14.298255 31.696131 31.696131v320.660857c-0.099988 17.397876-14.298255 31.596143-31.796118 31.596143z" fill="currentColor" p-id="4149"></path><path d="M383.978131 991.603955v0.699914c0 17.397876-14.298255 31.696131-31.696131 31.696131H31.721131C14.223267 1023.900012 0.025 1009.701745 0.025 992.203881v-0.699914C0.025 974.206078 14.223267 959.907824 31.721131 959.907824h320.660857c17.397876 0 31.596143 14.298255 31.596143 31.696131z" fill="currentColor" p-id="4150"></path><path d="M9.723816 1014.701135l-0.499939-0.499939c-12.298499-12.298499-12.298499-32.496033 0-44.794532l294.564043-294.564042c12.298499-12.298499 32.496033-12.298499 44.794531 0l0.499939 0.499939c12.298499 12.298499 12.298499 32.496033 0 44.794532L54.518348 1014.701135c-12.298499 12.298499-32.496033 12.298499-44.794532 0z" fill="currentColor" p-id="4151"></path><path d="M32.321058 0.024997h-0.699915C14.223267 0.024997 0.025 14.223264 0.025 31.721128v320.660857C0.025 369.779861 14.223267 383.978128 31.721131 383.978128h0.699914c17.397876 0 31.696131-14.298255 31.696131-31.696131V31.721128C64.017188 14.223264 49.818922 0.024997 32.321058 0.024997z" fill="currentColor" p-id="4152"></path><path d="M383.978131 32.321055v-0.699915C383.978131 14.223264 369.779864 0.024997 352.282 0.024997H31.721131C14.223267 0.024997 0.025 14.223264 0.025 31.721128v0.699914C0.025 49.818919 14.223267 64.017185 31.721131 64.017185h320.660857c17.397876 0 31.596143-14.198267 31.596143-31.69613z" fill="currentColor" p-id="4153"></path><path d="M9.723816 9.223874l-0.499939 0.499939C-3.074622 22.022312-3.074622 42.219846 9.223877 54.518345l294.564043 294.564042c12.298499 12.298499 32.496033 12.298499 44.794531 0l0.499939-0.499939c12.298499-12.298499 12.298499-32.496033 0-44.794531L54.518348 9.223874C42.219849-3.074625 22.022315-3.074625 9.723816 9.223874z" fill="currentColor" p-id="4154"></path><path d="M991.603958 1023.900012h0.699914c17.397876 0 31.696131-14.298255 31.696131-31.696131V671.643012c0-17.397876-14.298255-31.696131-31.696131-31.696131h-0.699914c-17.397876 0-31.696131 14.298255-31.696131 31.696131v320.660857c0 17.397876 14.298255 31.596143 31.696131 31.596143z" fill="currentColor" p-id="4155"></path><path d="M639.946885 991.603955v0.699914c0 17.397876 14.298255 31.696131 31.69613 31.696131h320.660857c17.397876 0 31.696131-14.298255 31.696131-31.696131v-0.699914c0-17.397876-14.298255-31.696131-31.696131-31.696131H671.643015c-17.397876 0-31.696131 14.298255-31.69613 31.696131z" fill="currentColor" p-id="4156"></path><path d="M1014.201199 1014.701135l0.499939-0.499939c12.298499-12.298499 12.298499-32.496033 0-44.794532L720.037108 674.842622c-12.298499-12.298499-32.496033-12.298499-44.794532 0l-0.499939 0.499939c-12.298499 12.298499-12.298499 32.496033 0 44.794532l294.564042 294.564042c12.398487 12.298499 32.596021 12.298499 44.89452 0z" fill="currentColor" p-id="4157"></path><path d="M991.603958 0.024997h0.699914c17.397876 0 31.696131 14.198267 31.696131 31.696131v320.660857c0 17.397876-14.298255 31.696131-31.696131 31.69613h-0.699914c-17.397876 0-31.696131-14.298255-31.696131-31.69613V31.721128C959.907827 14.223264 974.206081 0.024997 991.603958 0.024997z" fill="currentColor" p-id="4158"></path><path d="M639.946885 32.321055v-0.699915C639.946885 14.223264 654.245139 0.024997 671.643015 0.024997h320.660857c17.397876 0 31.696131 14.198267 31.696131 31.696131v0.699914c0 17.397876-14.298255 31.696131-31.696131 31.696131H671.643015C654.245139 64.017185 639.946885 49.818919 639.946885 32.321055z" fill="currentColor" p-id="4159"></path><path d="M1014.201199 9.223874l0.499939 0.499939c12.298499 12.298499 12.298499 32.496033 0 44.794532L720.037108 349.082387c-12.298499 12.298499-32.496033 12.298499-44.794532 0l-0.499939-0.499939c-12.298499-12.298499-12.298499-32.496033 0-44.794531L969.406667 9.223874c12.298499-12.298499 32.496033-12.298499 44.794532 0z" fill="currentColor" p-id="4160"></path></svg>
                </span>
                <span class="overClose">
                    <svg t="1608258262701" @click.stop="closeFun" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3235" width="20" height="20"><path d="M153.998 113.778l756.224 756.224-40.22 40.22-756.224-756.224z" fill="currentColor" p-id="3236"></path><path d="M870.002 113.778l40.22 40.22-756.224 756.224-40.22-40.22z" fill="currentColor" p-id="3237"></path></svg>
                </span>
                <!-- <Icon class="btn" type="md-close" style="font-size:22px;margin-left:5px;cursor: default;" /> -->
            </div>
            <h3 style="margin:0;padding-left:10px">{{title}}</h3>
        </div>
        <div class="overlayMain bgColorBody" @mousemove="canMove=false">
            <div v-if="maskOverlay" class="mask"></div>
            <template v-if="reflash">
                <slot name="main">

                </slot>
            </template>
        </div>
        <div class="overlayFooter" style="text-align:center" @mousemove="canMove=false">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
<script>
export default {
    name:'tOverlay',
    props:{
        close:{},
        title:{},
        width:{},
        height:{},
        disabled:{},
        isReflash:{
            type:Boolean,
            default:true
        }
    },
    model: {
        prop: 'close',
        event: 'change'
    },
    data(){
        return{
            index:'',
            bcTsvg:{},
            isWinMax:false,
            canMove:false,
            reflash:true
        }
    },
    computed:{
         maskOverlay(){
           return this.$store.getters.tUserInfo.maskOverlay
        },
        overlayCount(){
            return this.$store.getters.tUserInfo.overlayCount
        },
        overlayClickIndex(){
            return this.$store.getters.tUserInfo.overlayClickIndex
        },
    },
    mounted(){
        if(this.disabled){
            this.disableResize()
            window.addEventListener('resize',this.disableResize)
        }else
        this.windowAddMouseWheel(this.width?this.width:800,this.height?this.height:600)
    },
    beforeDestroy(){
        window.removeEventListener('resize',this.disableResize)
    },
    methods:{
        disableResize(){
            var tsvg = this.$refs.dom
            tsvg.style.width = '400px'
            tsvg.style.height = window.innerHeight - 30 +'px'
            tsvg.style.top = '30px'
            tsvg.style.left = window.innerWidth - 400 +'px'
            tsvg.style.boxShadow = 'none'
            tsvg.style.border = '1px solid #ddd'
        },
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
                if(!this.canMove) return
                this.$store.dispatch('setMaskOverlay',true)
                if(['top','bottom','right','left'].indexOf(e.target.className)>-1){
                    tsvg.style.transition = 'none'
                    var hisTop = parseInt(tsvg.style.top.split('px')[0])
                    var hisLeft = parseInt(tsvg.style.left.split('px')[0])
                    var hisHeight = parseInt(tsvg.style.height.split('px')[0])
                    var hisWidth = parseInt(tsvg.style.width.split('px')[0])
                    //event的兼容性
                    var ev = e;

                    //获取鼠标按下的坐标
                    var x1 = ev.clientX;
                    var y1 = ev.clientY;
                    var lt = 0;
                    var ls = 0;
                    //给可视区域添加鼠标的移动事件
                    document.onmousemove =  (ev)=> {
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
                        this.$emit('winMax')
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
                    tsvg.style.transition = 'width,height .3s ease'
                    this.$store.dispatch('setMaskOverlay',false)
                }
                document.onmouseup = (ev)=> {
                    tsvg.style.transition = 'width,height .3s ease'
                    document.onmousemove = null;
                    this.$store.dispatch('setMaskOverlay',false)

                }
            }
        },
        closeFun(){
            this.$emit('change',false)
            this.$emit('on-close')
        },
        //最大化
        winMax(){
            //存储当前定位
            var tsvg = this.$refs.dom
            this.bcTsvg = {
                top:tsvg.style.top,
                left:tsvg.style.left,
                width:tsvg.style.width,
                height:tsvg.style.height,
            }

            tsvg.style.width = window.innerWidth - 0 +'px'
            tsvg.style.height = window.innerHeight - 0 +'px'
            tsvg.style.top = '0px'
            tsvg.style.left = '0px'
            this.isWinMax = true
            this.$emit('winMax',true)
            if(this.isReflash){
                this.reflash = false
                setTimeout(()=>{
                    this.reflash = true
                },300)
            }
        },
        //还原大小
        winDef(){
            var tsvg = this.$refs.dom

            tsvg.style.width = this.bcTsvg.width
            tsvg.style.height = this.bcTsvg.height
            tsvg.style.top = this.bcTsvg.top
            tsvg.style.left = this.bcTsvg.left
            this.isWinMax = false
            this.$emit('winMax',false)
            if(this.isReflash){
                this.reflash = false
                setTimeout(()=>{
                    this.reflash = true
                },300)
            }
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
        overlayClickIndex(){
            if(this.overlayClickIndex!==this.index) this.closeFun()
        },
        $route(){
            this.closeFun()
        },
    }
}
</script>
<style scoped>
    .overClose:hover{
        cursor: default;
        color:red;
    }
</style>
<style>
    .tOverlay{
        position: fixed;
        top: 20px;
        left: 100px;
        width: 800px;
        height: 600px;
        /* text-align: center; */
        z-index: 13;
        /* background: #252526; */
        background: #fff;
        box-shadow: 0 0 6px 3px #00000025;
        /* border-radius: 10px; */
        /* border: 1px solid #ddd;
        box-shadow: 0px 0px 3px 1px #ececec; */
        /* display: none; */
        transition: width,height .3s ease;
    }
    .tOverlay .overlayTitle{
        background:#FFFFFF;
        border-bottom: 1px solid #EEEEEE;
        color:#000;
        height:30px;
        line-height:30px;
        position:relative;
        /* border-radius: 10px 10px 0 0; */
    }
    .tOverlay .overlayTitle .toolBox{
        position:absolute;right:5px;top:0px;font-size:18px;
        cursor: default;
    }
    .tOverlay .overlayTitle .toolBox:hover{
        filter: brightness(1.2);
    }
    .tOverlay .overlayMain{
        position: relative;
        height:calc(100% - 120px);
        overflow:auto;
        margin: 20px;
    }
    .tOverlay .overlayFooter{
        background:#F5F5F5;
        border-top:1px solid #DDDDDD;
        box-shadow: inset 0 1px 0 #ffffff;
        height:50px;
        line-height:50px;
        position:relative;
        /* border-radius: 0 0 10px 10px; */
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