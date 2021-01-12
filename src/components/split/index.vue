<template>
<div :style="{height:'100%'}" style="overflow:auto">
    <div :style="{width:leftWidth-1+'px'}" style="height:100%;width:display:inline-block;    vertical-align: top;border-right:1px solid #ddd;position:relative;float:left">
        <div class="right" @mousedown="moveLR($event)"></div>
        <slot name="left"></slot>
    </div>
    <div :style="{width:'calc(100% - '+leftWidth+'px)'}" style="display:inline-block;    vertical-align: top;">
        <slot name="right"></slot>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            leftWidth: 500,
        }
    },
    mounted() {
    },
    methods: {
        moveLR(e) {
            if (['right', 'left'].indexOf(e.target.className) > -1) {
                //event的兼容性

                //获取鼠标按下的坐标
                var left = this.left
                var right = this.leftWidth
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

                    if (e.target.className == 'left') {
                        if ((left + x) > 80) this.leftWidth = left + x
                        else this.leftWidth = 50
                    }else if(e.target.className == 'right'){
                            if((right+x)>100) this.leftWidth = right + x
                            else this.leftWidth = 100

                        }
                }
            }
            document.onmouseup = () => {
                document.onmousemove = null;

            }
        },
    }
}
</script>

