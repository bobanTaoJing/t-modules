<template>
<div :style="{height:'100%'}" style="overflow:auto">
    <div :style="{width:leftWidth-1+'px'}" style="height:100%;width:display:inline-block;    vertical-align: top;border-right:1px solid #ddd;position:relative;float:left">
        <div class="right" @mousedown="moveLR($event)"></div>
        <Split v-model="split" mode="vertical">
            <div slot="top" class="demo-split-pane" style="height:100%">
                <div style="padding-top:5px">
                    <span style="font-weight:600">script > export default > data</span>
                    <Button @click="run" icon="ios-arrow-dropright" type="success" style="float:right" size="small">运行</Button><span v-if="error1" style="color:red">编辑器内容有误</span>
                    <div style="clear:both"></div>
                </div>
                <div style="overflow:hidden;height:calc(100% - 30px)">
                    
                    <editor style="position:relative;left:0" @init="editorInit" :lang="'javascript'" theme="chrome" :height="'100%'" v-model="dataString" />
                </div>
            </div>
            <div slot="bottom" class="demo-split-pane" style="height:100%">
                <p style="padding-top:10px;font-weight:600">template</p>
                <pre style="margin:0;height:calc(100% - 35px)" v-highlightjs="htmlCode"><code style="background:#f3f3f3;height:100%" class="html"></code></pre>
            </div>
        </Split>
    </div>
    <div :style="{width:'calc(100% - '+leftWidth+'px)'}" style="padding:5px;display:inline-block;    vertical-align: top;height:100vh;overflow:auto">
        <slot name="right"></slot>
    </div>
</div>
</template>

<script>
import editor from '../../self_node_modules/vue2-ace-editor/index.vue'
export default {
    data() {
        return {
            leftWidth: 500,
            htmlCode:'',
            dataString:'',
            error1:false,
            split:.8
        }
    },
    mounted() {
    },
    methods: {
        inCome(obj){
            this.htmlCode = obj.htmlCode
            this.dataString = obj.dataString
        },
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
        editorInit: function () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')
            require('brace/mode/javascript') //language
            require('brace/mode/mysql') //language
            require('brace/mode/java') //language
            require('brace/mode/yaml') //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            // require('brace/theme/chaos')
            require('brace/theme/tomorrow_night_bright')
            require('brace/snippets/javascript') //snippet
            require('brace/snippets/mysql') //snippet
            require('brace/snippets/java') //snippet
            require('brace/snippets/yaml') //snippet
            // ace.define("ace/mode/mysql_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],langTools.langMysql(this.selfWord.join('|')+'|'))
        },
        run(){
            try{
                let obj = eval(`(()=>{${this.dataString}\n return data})()`)
                this.$emit('run',obj)
                this.error1 = false
            }catch(error){
                this.error1 = true
            }
        }
    },
    components:{editor}
}
</script>

