<template>
    <div @dragover="dragover" @drop="drop" @contextmenu.prevent="contextmenu" ref="aceEditor" class="test" :style="{'position':'relative','height':height?height:'100%'}">
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
            <!-- <Icon @click="test" type="ios-alarm" /> -->
            <!-- <Icon type="ios-folder" />
            <Icon type="md-list-box" />
            <Icon type="ios-flash" />
            <Icon type="ios-flash-outline" />
            <Icon type="md-checkmark" />
            <Icon type="md-close" /> -->
        </p>
        <editor v-model="content"
        ref="editor"
         @init="editorInit" :lang="language" theme="chrome" :style="showAction?'height:calc(100% - 24px)':'100%'"
         :readOnly="readOnly"
         :options="{
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        }"></editor>
    </div>
</template>
<script>
// import * as langTools from './AceEditor'
import editor from '../../../self_node_modules/vue2-ace-editor/index.vue'
import ace from 'brace'
export default {
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
    components:{
        editor
    },
    data(){
        return{
            content:'',
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
    mounted(){
        if(this.codes==this.content||!this.codes||typeof this.codes!='string') return
            else{
                this.content = this.codes
            }
    },
    methods: {
        contextmenu(){
            // console.log(e)
            //选中内容
            let value1 = this.$refs.editor.editor.session.getTextRange(this.$refs.editor.editor.getSelectionRange())
            // console.log(value1)
            if(value1){
                this.$set(this.menuContrl,'a',true)
                this.$set(this.menuContrl,'b',true)
            }
            else{
                this.$set(this.menuContrl,'a',false)
                this.$set(this.menuContrl,'b',false)
            }
        },
        disabledMenuClick(){
            setTimeout(()=>{
                this.$refs.contextmenu.visible = true
            },10)
        },
        test(){
            // let value = this.$refs.editor.editor.session.getTextRange(this.$refs.editor.editor.getSelectionRange())
            // console.log(value)
        },
        clearText(){
            // console.log('clearText')
            this.selectedText = ''
        },
        selectText(value){
            // console.log(value)
            this.selectedText = value
        },
        dragover(e){
            e.preventDefault();
            // console.log('dragover')
        },
        drop(e){
            console.log('drop')
            e.preventDefault();
            // var data=e.dataTransfer.getData("Text");
            // console.log(data)
            // this.content = this.content + ' ' + data
        },
        RunResult(){
            this.$emit('runResult',this.content,this.maxRows,this.enableForward)
        },
        RunResult2(){
            let value = this.$refs.editor.editor.session.getTextRange(this.$refs.editor.editor.getSelectionRange())
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
            let value = this.$refs.editor.editor.session.getTextRange(this.$refs.editor.editor.getSelectionRange())
            if(value){
                this.$emit('runResultTime',value,this.enableForward)
            }
        },
        editorInit: function () {
            require('brace/ext/language_tools') //language extension prerequsite...
            require('brace/mode/html')                
            require('brace/mode/javascript')    //language
            require('brace/mode/mysql')    //language
            require('brace/mode/java')    //language
            require('brace/mode/yaml')    //language
            require('brace/mode/less')
            require('brace/theme/chrome')
            require('brace/snippets/javascript') //snippet
            require('brace/snippets/mysql') //snippet
            require('brace/snippets/java') //snippet
            require('brace/snippets/yaml') //snippet
            // ace.define("ace/mode/mysql_highlight_rules",["require","exports","module","ace/lib/oop","ace/lib/lang","ace/mode/doc_comment_highlight_rules","ace/mode/text_highlight_rules"],langTools.langMysql(this.selfWord.join('|')+'|'))
        },
        setWord(word=[]){
            ace.config.init()
            var languageTools = ace.acequire("ace/ext/language_tools");
            let arr = []
            for(let a of word){
                arr.push(
                    {
                        name : a.name,
                        value : a.fullName,
                        caption: a.name,
                        meta: '表',
                        type: "local",
                        docHTML:'<b>数据源：'+a.dataSourceName+'</b><br><b>schema：'+a.schemaName+'</b><br><b>值：'+a.fullName+'</b>',
                        score : 0 // 让test排在最上面
                    }
                )
            }
            languageTools.addCompleter({
                getCompletions: function(editor, session, pos, prefix, callback) {
                callback(null,  arr);
                }
            });
        }
    },
    watch:{
        content(){
            this.$emit('returnBack', this.content);
        },
        codes(){
            // console.log(typeof this.codes)
            if(this.codes==this.content||typeof this.codes!='string') return
            else{
                this.content = this.codes
            }
        },
        selfWord:{
            handler(){
               this.setWord(this.selfWord)
            },
            deep:true
        }
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