<template>
    <div style="height:100%;">
        <div v-show="type==1" style="height:100%">
            <h3>数据源</h3>
            <div style="height:calc(100% - 42px);overflow:auto;padding:0 5px;">
                <p v-for="(item,index) in baseData" :key="index" class="zhibiaohover" @click="selectItem(item)">
                    <Icon type="logo-buffer"/>
                    &nbsp;<span>{{item.name}}</span>
                </p>
            </div>

        </div>
        <div v-show="type==2" style="height:calc(100% - 238px);overflow:auto;">
            <h3>
                <a @click="type=1">
                <Icon type="ios-arrow-back" />&nbsp;&nbsp;<Icon type="logo-buffer"/>{{checkedItem.name}}
                </a>
            </h3>
            <Spin size="large" fix v-if="loadingSchema"></Spin>
            <div v-else>
                <div>
                    <template v-for="(item,index) in schemaData">
                        <div :key="index" v-if="objectData[item.title+'_'+item.id]">
                            <h4>{{item.title}}
                                <span style="color:#cac9c9">(schema)</span>
                            </h4>
                            <p v-for="(item2,index2) in objectData[item.title+'_'+item.id]" style=" white-space:nowrap;" :key="index2" :title="item2.title" draggable="true" @click="getProperty(item2)" @dragstart="dragstart($event,item2)" class="zhibiaohover">
                                <Icon type="logo-buffer"/>
                                &nbsp;<span>{{ item2.title}}</span>
                            </p>
                        </div>
                    </template>
                </div>
                <div style="position: absolute;
                    bottom: 0;
                    box-shadow: 0px 0px 6px 6px #ddd;
                    width: 100%;
                    max-height: 200px;
                    overflow: auto;
                    padding: 5px;">
                    <p style="color:#000;font-weight:bold;">表名：<span style="color:#148814">{{checkedObjectData.title}}</span></p>
                    <br>
                    <p style="color:#000;font-weight:bold;">列：</p>
                    <ul>
                        <li v-for="(item,index) in propertyData" style="padding-left:20px;" :key="index">
                            <span style="width:76px;display: inline-block;" :title="item.name">{{splitString(item.name,8)}}</span>
                            {{item.dataTypeName}}
                        </li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import * as tools from '../../../../../utils/tools'
import qs from 'qs'
export default {
    props:{
        baseData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return{
            type:1,
            checkedItem:{},
            loadingSchema:false,
            schemaData:[],
            objectData:{},
            checkedObjectData:{},
            propertyData:[]
        }
    },
    created(){
        this.splitString =tools.splitString
    },
    methods:{
        selectItemFromOther(id){
            if(this.baseData){
                for(let a of this.baseData){
                    if(a.id == id){
                        this.selectItem(a)
                        return
                    }
                }
            }
        },
        selectItem(item){
            console.log(item)
            this.checkedItem = item
            this.type = 2
            this.showSchema(item)
        },
        showSchema(item){
            this.loadingSchema = true
            this.schemaData = []
            this.$http.get('/resource/metadata/tree?type=SCHEMA&parentId='+item.id)
                .then(res1=>{
                    this.loadingSchema = false
                    let res = res1.data
                    if(res.success){
                        this.schemaData = res.data.rows
                        this.objectData = {}
                        for(let a of this.schemaData){
                            this.getObject(a)   
                        }
                    }
                })
                .finally(()=>{
                    this.loadingSchema = false
                })
        },
        getObject(item){
            this.$http.get(ip+item.treeUrl)
                .then(res1=>{
                    let res = res1.data
                    if(res.success){
                        this.$set(this.objectData,item.title+'_'+item.id,res.data.rows)
                        // this.objectData[item.title+'_'+item.id] = res.data.rows
                        // item.objectData = res.data.rows
                    }
                })
        },
        getProperty(item){
            this.checkedObjectData = item
            this.$http.post('/resource/metadata/basic/property/list',qs.stringify({
                objectId:item.id
            }))
            .then(res1=>{
                let res = res1.data
                if(res.success){
                    this.propertyData = res.data.rows
                }
            })
        },
        dragstart(e,data){
            console.log(e)
            e.dataTransfer.setData("Text",data.title)
        }
    }
}
</script>
<style>
.zhibiaohover:hover{
  background:#4990da;
  color:#fff;
}
</style>