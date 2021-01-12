<template>
<div :style="{height:'100%'}" style="overflow:auto">
    <div :style="{width:leftWidth-1+'px'}" style="height:100%;width:display:inline-block;    vertical-align: top;border-right:1px solid #ddd;position:relative;float:left">
        <div class="right" @mousedown="moveLR($event)"></div>
        <p>template</p>
        <pre style="" v-highlightjs="code"><code style="background:#f3f3f3;max-height:300px;" class="html"></code></pre>
        <p>script > export default > data
            <Button @click="run" size="small">运行</Button><span v-if="error1" style="color:red">编辑器内容有误</span>
        </p>
        <div style="overflow:hidden;height:calc(100% - 200px)">
            
            <editor style="position:relative;left:0" @init="editorInit" :lang="language" theme="chrome" :height="'100%'" v-model="dataString" />
        </div>
    </div>
    <div :style="{width:'calc(100% - '+leftWidth+'px)'}" style="display:inline-block;    vertical-align: top;">
        <tTable :columns="columns" :data="data" :height="height" :headerStyle="headerStyle" :bodyStyle="bodyStyle"/>
    </div>
</div>
</template>

<script>
import tTable from '../../components/tTable.vue'
import editor from '../../../self_node_modules/vue2-ace-editor/index.vue'
import {tTableData} from '../devTool/defaultData/index'

export default {
    name:'tTableExample',
    components: {
        tTable,
        editor
    },
    data() {
        return {
            columns: [{
                    title: 'test',
                    key: 'test',
                    width: 100
                },
                {
                    title: 'test2',
                    key: 'test2',
                    width: 100
                },
                {
                    title: 'test3',
                    key: 'test3',
                    width: 100
                },
                {
                    title: 'test4',
                    key: 'test4',
                    width: 100
                },
                {
                    title: 'test5',
                    key: 'test5',
                    width: 100
                },
            ],
            data: [{
                test: 'test',
                test2: 'test2',
                test3: 'test3',
                test4: 'test4',
                test5: 'test5'
            }],
            headerStyle:{},
            bodyStyle:{},
            dataString: '',
            height: 400,
            code: '<tTable :columns="columns" :data="data" :height="height" :headerStyle="headerStyle" :bodyStyle="bodyStyle"/>',
            language: 'javascript',
            error1: false,
            error2: false,
            winHeight: window.innerHeight,
            leftWidth: 500
        }
    },
    mounted() {
        this.dataString = tTableData
        let obj = eval(`(()=>{${this.dataString}\n return data})()`)
        this.data = obj.data
        this.columns = obj.columns
        this.height = obj.height
        this.headerStyle = obj.headerStyle
        this.bodyStyle = obj.bodyStyle
        this.error1 = false
    },
    methods: {
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
        run(){
            try{
                let obj = eval(`(()=>{${this.dataString}\n return data})()`)
                this.data = obj.data
                this.columns = obj.columns
                this.height = obj.height
                this.headerStyle = obj.headerStyle
                this.bodyStyle = obj.bodyStyle
                this.error1 = false
            }catch{
                this.error1 = true
            }
        }
    },
    watch: {
        // dataString() {
        //     try {
        //         eval(`(()=>{${this.dataString}\n return data})()`)
        //         this.error1 = false
        //     } catch {
        //         this.error1 = true
        //     }
        // }
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
}
</style>
