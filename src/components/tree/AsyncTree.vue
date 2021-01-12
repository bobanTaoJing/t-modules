<template>
<div class="data-tree-panel" style="width:200px;min-height:300px;">
    <!-- 异步树 -->
     <Button size="small" v-if="treeOptions.showReflash" shape="circle" ghost type='primary'  @click="queryData()">
         <Icon type="ios-refresh" />刷新</Button>
    <template v-if="editOptions">
        <template v-if="showAdd">
            <Button size="small" shape="circle" ghost type='primary' icon="ios-add"  @click="treeAddData()">添加</Button>
        </template>
        <template v-if="showUpdate">
            <Button size="small" shape="circle" ghost type='primary' icon="ios-build" @click="treeEditData()"
                  :disabled="selected.length==0">编辑
          </Button>
        </template>

        <template v-if="isPopupEdit">
          <!--弹出式编辑框-->
          <PopupEdit ref="treePopupEdit"
                     :width="treeOptions.editOptions.width"
                     :dynamic="treeOptions.editOptions.dynamic"
                     @on-success="editTreeSuccess"
                     :label-width="treeOptions.editOptions.labelWidth">
          </PopupEdit>
        </template>
        <Poptip confirm title="您确认删除选中的内容吗？" @on-ok="treeDelData()" placement="bottom-start" transfer>
          <Button ghost type='primary' size="small" shape="circle" icon="ios-beaker" @click="" :disabled="selected.length==0">
            删除
          </Button>
        </Poptip>
      </template>
    <Tree ref="tree" :showCheckbox="showCheckbox" :data="treeData" v-if="treeOptions.renderContentJson" :render="renderContent" :class="{'tree-loading': loading}" size="large" @on-select-change="onSelectChange" @on-check-change="onCheckChange" @on-toggle-expand="onToggleExpand"></Tree>
    <Tree ref="tree" :showCheckbox="showCheckbox" :data="treeData" v-else :class="{'tree-loading': loading}" size="large" @on-select-change="onSelectChange" @on-check-change="onCheckChange" @on-toggle-expand="onToggleExpand"></Tree>
    <spin v-if="loading" size="large" class="tree-spin"></spin>
</div>
</template>

<script>
import {PopupEdit,PermsValid} from '../../components/index'
export default {
    props:{
        treeOptions:{
            dataUrls:{
                default:''
            },
            editOptions:{
                default:false
            },
            isPopupEdit:{
                default:true
            },
            showAdd:{
                default:true
            },
            showUpdate:{
                default:true
            },
            renderContentJson:{
                default:''
            },
            ip:{
                default:''
            },
            showReflash:{
                default:true
            },
            data:{
                type:Array,
                default:function(){
                    return []
                }
            }
        }
        },
    data() {
        return {
            ip:'',
            treeData: [],
            selected:[],
            loading: false,
            showCheckbox: false,
        }
    },
    computed:{
        editOptions(){
            return this.hanlerProps('editOptions',false)
        },
        isPopupEdit(){
            return this.hanlerProps('isPopupEdit',true)
        },
        showAdd(){
            return this.hanlerProps('showAdd',true)
        },
        showUpdate(){
            return this.hanlerProps('showUpdate',true)
        }
    },
    mounted(){
        this.ip = this.treeOptions.ip
        this.queryData()
    },
    methods: {
        hanlerProps(key,defaultValue){
            if(this.treeOptions[key]!==undefined)
                return this.treeOptions[[key]]
            else return defaultValue
        },
        queryData(){
            if(this.treeOptions.data){
                this.treeData = this.treeOptions.data
            }else{
                this.loading=true
                let url = this.ip+this.treeOptions.dataUrls
                this.$http.apiGet(url)
                    .then(res=>{
                        this.loading=false
                        if(res.success){
                            let arr = []
                            for(let a of res.data.rows){
                                a.hc=false
                                a.level=0
                                if(a.hasChildren)
                                    a.children=[{}]
                                arr.push(a)
                            }
                            this.treeData=arr
                        }
                    })
                    .finally(()=>{
                        this.loading=false
                    })
            }
            
        },
        treeQuery(data){
            // console.log(this.ip+data.treeUrl)
            this.$http.apiGet(this.ip+data.treeUrl)
                .then(res=>{
                    if(res.success){
                        let children=[]
                        for(let a of res.data.rows){
                            a.hc=false
                            a.parent=data
                            a.level=data.level+1

                            if(a.hasChildren)
                                a.children=[{}]
                            children.push(a)
                        }
                        this.$set(data,'hc',true)
                        this.$set(data,'children',children)
                    }
                })
        },
        //点击树节点事件
        onSelectChange(node,data) {
            // console.log(data)
            this.selected=this.$refs.tree.getSelectedNodes()
            if(!data.expand&&data.hasChildren&&data.treeUrl){
                this.treeQuery(data)
            }
            this.$set(data, 'expand', !data.expand)
            this.$emit('onSelectChange',data,this.treeData)
        },
        //选中节点选择框事件
        onCheckChange(node){
            // console.log(node)
            // if(node[0]&&node[0].hasChildren&&node[0].treeUrl){
            //     this.treeQuery(node)
            // }
        },
        //节点展开与关闭事件
        onToggleExpand(data) {
            // console.log(data)
            if(data.expand&&data.hasChildren&&data.treeUrl){
                this.treeQuery(data)
            }
        },
        //自定义树节点html
        renderContent(h, {
            root,
            node,
            data
        }) {
            if(data.level==this.treeOptions.renderContentJson.level){
                return h('span', {
                    'class': {
                        showTreeButton: true,
                    },
                    style: {
                        display: 'inline-block',
                        width: '100%'
                    },
                }, [
                    // h('span', {
    
                    // },[
                    //     h('Icon', {
                    //         props: {
                    //             type: data.icon
                    //         },
                    //         style: {
                    //             marginRight: '8px',
                    //         }
                    //     }),
                    //     h('span', data.title)
                    // ]),
                    this.treeOptions.renderContentJson.hFunction(h,data)
                ]);
            }else{
                return h('span', {
                    'class': {
                        showTreeButton: true,
                    },
                    style: {
                        display: 'inline-block',
                        width: '100%',
                        cursor:'pointer'
                    },
                    on: {
                            click: () => {
                                if(data.expand){
                                    data.expand=false
                                }else{
                                    this.onSelectChange('',data)
                                }
                            }
                        }
                }, [
                    h('span', {
                    },[
                        h('Icon', {
                            props: {
                                type: data.icon
                            },
                            style: {
                                marginRight: '8px'
                            }
                        }),
                        h('span', {
                            
                        },data.title)
                    ]),
                ]);
            }
                

            
        },
        treeAddData(){

        },
        treeEditData(){},
        treeDelData(){},
        editTreeSuccess(){}
    },
    components:{
        PopupEdit,PermsValid
    }
}
</script>
<style>
    .showTreeButton:hover .treeButton{
        display:inline-block;
    }
    .treeButton{
        display: none;
    }
    .treeButton i{
        cursor: pointer;
    }
      .data-tree-panel .tree-loading {
    opacity: 0.5
  }

  .data-tree-panel .ivu-tree .ivu-tree-title {
    font-size: 13px;
  }

  .data-tree-panel .ivu-tree .ivu-tree-arrow {
    font-size: 14px;
  }
</style>
<style scoped>
  .data-tree-panel {
    width: 100%;
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .tree-spin {
    position: absolute;
    left: 40%;
    top: 50%;
  }

</style>
