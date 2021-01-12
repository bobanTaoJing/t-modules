<style>
    /* .CodeMirror-hints{
        position: fixed;
    } */
</style>
<template>
    <div :style="'height:'+height" @contextmenu.prevent="contextmenu">
        <p v-if="showAction" style="background: #F7F7F7;display: block;width:100%;padding-left:5px;font-size:16px;padding-left:7px"> 
            <!-- 文件导入 -->
            <template v-if="!hiddenSelfAction">
                <Icon @click="RunResult" type="md-arrow-dropright-circle" title="执行SQL"/>
                <Icon @click="RunResultTime" type="ios-alarm"  title="执行SQL"/>
                <Select v-model="maxRows" size="small" style="width:50px">
                    <Option v-for="item in [{value:10,label:10},{value:50,label:50},{value:100,label:100},{value:1000,label:1000}]" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <label>
                    <Checkbox v-model="enableForward">数据转发</Checkbox>
                </label>
            </template>
            <template>
                <slot name="action">

                </slot>
            </template>
            <Icon type="md-alert" title="按Ctrl键显示代码联想" />
            <!-- <Icon @click="test" type="ios-alarm" /> -->
            <!-- <Icon type="ios-folder" />
            <Icon type="md-list-box" />
            <Icon type="ios-flash" />
            <Icon type="ios-flash-outline" />
            <Icon type="md-checkmark" />
            <Icon type="md-close" /> -->
        </p>
        <codemirror v-contextmenu:contextmenu  ref="editor"  v-model="content"  :options="cmOptions"   @changes="changes" class="code"  style="height:calc(100% - 24px);overflow:auto"></codemirror>
        <v-contextmenu ref="contextmenu">
            <template v-if="showMenu">
                <v-contextmenu-item @click="menuContrl.a?RunResult2():disabledMenuClick()" :class="{menuDisabled:!menuContrl.a}">运行</v-contextmenu-item>
                <v-contextmenu-item v-if="showTimeRun" @click="menuContrl.b?RunResultTime2():disabledMenuClick()" :class="{menuDisabled:!menuContrl.b}">定时运行</v-contextmenu-item>
                <v-contextmenu-item @click="menuContrl.c?content='':disabledMenuClick()" :class="{menuDisabled:!menuContrl.c}">清空</v-contextmenu-item>
            </template>
        </v-contextmenu>
    </div>
</template>
<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
  require("codemirror/mode/javascript/javascript.js")
  require("codemirror/mode/sql/sql.js")
  require('codemirror/addon/fold/foldcode.js')
  require('codemirror/addon/fold/foldgutter.js')
  require('codemirror/addon/fold/brace-fold.js')
  require('codemirror/addon/fold/xml-fold.js')
  require('codemirror/addon/fold/indent-fold.js')
  require('codemirror/addon/fold/markdown-fold.js')
  require('codemirror/addon/fold/comment-fold.js')
  require('codemirror/addon/hint/show-hint.js')
  require('codemirror/addon/hint/show-hint.css')
  require('codemirror/addon/hint/javascript-hint.js')
  require('codemirror/addon/hint/sql-hint.js')
export default {
    components:{
        codemirror
    },
    props:{
        codes:{
            type:String,
            default:function(){
                return ''
            }
        },
        language:{
            type:String,
            default:function(){
                return 'mysql'
            }
        },
        showAction:{
            type:Boolean,
            default:false
        },
        height:{
            type:String,
            default:'300px'
        },
        rmenuFun:{
            type:Array,
            default:function(){
                return [
                    {label:'test',id:'test'}
                ]
            }
        },
        showMenu:{
            default:false
        },
        selfWord:{
            type:Array,
            default:function(){
                return []
            }
        },
        readOnly:{
            type:Boolean,
            default:false
        },
        showTimeRun:{
            type:Boolean,
            default:true
        },
        hiddenSelfAction:{
            type:Boolean,
            default:false
        }
    },
    model: {
        prop: 'codes',
        event: 'returnBack'
    },
    created(){
        this.content = this.codes
        if(this.language=='mysql') this.cmOptions.mode = 'sql'
        else
        this.cmOptions.mode = this.language
    },
    data(){
        return{
            content:'',
            cmOptions:{
                tabSize:4,
                mode:'javascript',
                //mode:{name:'javascript',json:true},//代码类型
                theme:'default',//设置主题
                lineNumbers:true,//是否显示行数
                lineWrapping:true,
                extraKeys:{'Ctrl':'autocomplete'},//按键配置
                lineWiseCopyCut:true,
                showCursorWhenSelecting:true,
                matchBrackets:true,//括号匹配
                // readOnly:'nocursor',//只读
                line:true,
                keyMap:'default',//快捷键
                extraKeys: { "Ctrl": "autocomplete" },
            },
            selectedText:'',
            dragOver:false,
            showContextmenuBox:false,
            menuBoxStyle:{
                top:0,
                left:0
            },
            menuContrl:{
                a:true,
                b:true,
                c:true,
            },
            maxRows:10,
            enableForward:false
        }
    },
    methods:{
        changes(value){
            this.$emit('returnBack', this.content);
        },
        contextmenu(e){
            // console.log(e)
            //选中内容
            let value1 = this.$refs.editor.codemirror.getSelection()
            console.log(value1)
            if(value1==''){
                this.$set(this.menuContrl,'a',false)
                this.$set(this.menuContrl,'b',false)
            }
            else{
                this.$set(this.menuContrl,'a',true)
                this.$set(this.menuContrl,'b',true)
            }
        },
        disabledMenuClick(){
            setTimeout(()=>{
                this.$refs.contextmenu.visible = true
            },10)
        },
        test(){
            // let value = this.$refs.editor.editor.session.getTextRange(this.$refs.editor.codemirror.getSelection())
            // console.log(value)
        },
        clearText(){
            // console.log('clearText')
            this.content = ''
        },
        RunResult(){
            this.$emit('runResult',this.content,this.maxRows,this.enableForward)
        },
        RunResult2(){
            let value = this.$refs.editor.codemirror.getSelection()
            if(value){
                this.$emit('runResult',value,this.maxRows,this.enableForward)
            }
        },
        RunResultTime(){
            if(this.content){
                this.$emit('runResultTime',this.content,this.enableForward)
            }else{
               this.$Message.warning('请填写sql语句！')
            }
        },
        RunResultTime2(){
            let value = this.$refs.editor.codemirror.getSelection()
            if(value){
                this.$emit('runResultTime',value,this.enableForward)
            }
        },
    }
}
</script>
<style>
    .contextmenuBox{
        width:100px;
        position: absolute;
        top:0;
        left:0;
    }
    .menuDisabled{
        color:#a99f9f !important;
        cursor:default !important;
    }
    .menuDisabled:hover{
        background:#fff !important;
        color:#a99f9f !important;
    }
</style>
<style scoped>
    i{
        border:1px transparent solid;
    }
    i:hover{
        background:#B3D7F3;
        border:1px solid #0078D7;
    }
</style>