<template>
<div class="sobject">
    <Row>
        <!-- <i-col :span="24" v-if="!isNativeQuery">
            <div style="text-align:right;padding:5px;border-bottom:1px solid #ddd">
                <Button style="float:left" :disabled="loading" type="primary" ghost @click="stbutton" :class="{checked:showSt}">
                <Icon type="md-apps" />
                生成视图</Button>
                <Switch style="float:left;margin:4px;" :disabled="loading" v-model="tubiao" true-color="#509EE3" false-color="#509EE3" >
                    <span slot="open">表</span>
                    <span slot="close">图</span>
                </Switch>
                <Button :disabled="loading" @click="glButton(1)" class="guolvbutton" :class="{checked2:filterType==1&&showGl}">
                    <svg class="Icon Icon-filter Icon-cxuQhR kTAgZA" viewBox="0 0 32 32" width="14" height="14" fill="currentcolor"><path d="M3.556 4h24.888a3.556 3.556 0 1 1 0 7.111H3.556a3.556 3.556 0 1 1 0-7.111zm4 11.556h16.888a2.222 2.222 0 1 1 0 4.444H7.556a2.222 2.222 0 0 1 0-4.444zM12 24.444h8a2.222 2.222 0 0 1 0 4.445h-8a2.222 2.222 0 0 1 0-4.445z"></path></svg>
                    过滤器</Button>
                <Button :disabled="loading" @click="glButton(2)" class="juhebutton" :class="{checked3:filterType==2&&showGl}">
                    <svg class="Icon Icon-insight Icon-cxuQhR kTAgZA" viewBox="0 0 32 32" width="14" height="14" fill="currentcolor"><path d="M12.6325203 19.3674797 0 16 12.6325203 12.6325203 16 0 19.3674797 12.6325203 32 16 19.3674797 19.3674797 16 32z"></path></svg>
                    聚合</Button>
            </div>
        </i-col> -->
        <i-col :span="showSt?4:0">
            <div v-show="showSt">
                <!-- <div style="height:43px;border-bottom:1px solid #ddd"></div> -->
                <part1 ref="part1" @setChart="setChart" @saveChart="saveChart" :saveChartLoading="saveChartLoading" :tubiao.sync="tubiao" :columns="columns1" :data="dataTable"></part1>
            </div>
        </i-col>
        <i-col :span="showSt&&showGl?16:showGl||showSt?20:24">
            <div v-if="isNativeQuery" :style="'height:calc(100vh - 115px)'">
                <Split v-model="splitValue" mode="vertical">
                    <div slot="top" style="height:100%">
                        <nativeQuery ref="nativeQuery" @getObject="getObject" @changeDatasourceId="changeDatasourceId" :baseData="baseData" :showSt.sync="showSt" :showGl.sync="showGl"></nativeQuery>
                    </div>
                    <div slot="bottom" style="height:100%">
                        <div :style="'position:relative;height:100%;padding:5px 5px 0 5px;border-left:1px solid #ddd;border-right:1px solid rgb(221, 221, 221)'">
                            <Table v-show="tubiao" :columns="columns1" no-data-text='' :data="dataTable" class="hidden-tbody" :loading="loading"></Table>
                            <div v-show="tubiao" :style="'height:'+(columns1.length>0?'calc(100% - 80px)':'calc(100% - 36px)')+';overflow:auto;background:#fff'">
                                <Table :show-header="false" :columns="columns1" :data="dataTable" :loading="loading"></Table>
                            </div>
                            <div v-if="!tubiao">
                                <charts :chartType="chartType" :chartValue="chartValue" :mapName="mapName" :numTrueValue="true" :height="tableHeight-60"></charts>
                            </div>
                            <div style="text-align:right;padding:5px;" v-if="chartType!='number'">
                                <template v-if="isNativeQuery">
                                    <Button style="float:left" :disabled="loading" type="primary" ghost @click="stbutton" :class="{checked:showSt}">
                                    <Icon type="md-apps" />
                                    生成视图</Button>
                                    <Switch style="float:left;margin:4px;" :disabled="loading" v-model="tubiao" true-color="#509EE3" false-color="#509EE3" >
                                        <span slot="open">表</span>
                                        <span slot="close">图</span>
                                    </Switch>
                                </template>
                                <label>
                                    <span>最大行：</span>
                                    <Select v-model="maxResults" @on-change="getObject(true)" style="width:200px">
                                        <Option v-for="(item,index) in [20,50,100,300]" :value="item" :key="index+'a'">{{ item }}</Option>
                                    </Select>
                                </label>
                            </div>
                        </div>
                    </div>
                </Split>
            </div>
            <div v-else :style="'position:relative;height:calc(100vh - 102px)'+';padding:5px 5px 0 5px;border-left:1px solid #ddd;border-right:1px solid rgb(221, 221, 221)'">
                <Table v-show="tubiao" :columns="columns1" :data="dataTable" :height="tableHeight+32" :loading="loading"></Table>
                <div v-if="!tubiao">
                    <charts :chartType="chartType" :chartValue="chartValue" :mapName="mapName" :numTrueValue="true" :height="tableHeight-44"></charts>
                </div>
                <div style="text-align:right;padding:5px;" v-if="chartType!='number'">
                    <template v-if="isNativeQuery">
                        <Button style="float:left" :disabled="loading" type="primary" ghost @click="stbutton" :class="{checked:showSt}">
                        <Icon type="md-apps" />
                        生成视图</Button>
                        <Switch style="float:left;margin:4px;" :disabled="loading" v-model="tubiao" true-color="#509EE3" false-color="#509EE3" >
                            <span slot="open">表</span>
                            <span slot="close">图</span>
                        </Switch>
                    </template>
                    <label>
                        <span>最大行：</span>
                        <Select v-model="maxResults" @on-change="getObject(true)" style="width:200px">
                            <Option v-for="(item,index) in [20,50,100,300]" :value="item" :key="index+'b'">{{ item }}</Option>
                        </Select>
                    </label>
                </div>
            </div>
        </i-col>
        <i-col :span="showGl?4:0">
            <div v-show="showGl" style="height:calc(100vh - 145px)">
                <template v-if="isNativeQuery">
                    <Fieid ref="fieid" :baseData="baseData" style="height:calc(100vh - 98px);border-top:1px solid rgb(221, 221, 221);padding:5px"></Fieid>
                </template>
                <template v-else>
                    <div style="height:100%">
                        <!-- <template v-if="filterType==1"> -->
                            <div style="height:100%" v-show="filterType==1">
                                <tFilter @reflashGetObject="reflashGetObject" :aggregation="aggregation" :groupBy="groupBy" :ffilter="filter" :showGl.sync="showGl" :data="fullColumns"></tFilter>
                            </div>
                        <!-- </template> -->
                        <!-- <template v-else-if="filterType==2"> -->
                            <div style="height:100%" v-show="filterType==2">
                                <tGroup @reflashGetObject="reflashGetObject" :filter="filter" :showGl.sync="showGl" :data="fullColumns"></tGroup>
                                
                            </div>
                        <!-- </template> -->
                    </div>
                </template>
            </div>
        </i-col>
    </Row>
</div>
</template>

<script>
// import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css'
// import '@grapecity/spread-sheets-vue'
import nativeQuery from './nativeQuery/index'
import Fieid from './nativeQuery/fieid'
import part1 from './sobject/part1'
import charts from './sobject/charts'
import {ip,setChart} from '../basedata'
import tFilter from './sobject/tFilter'
import tGroup from './sobject/tGroup'
import qs from 'qs'
export default {
    props:{
        objectName:{
            type:String,
            default:''
        },
        objectId:{
            type:[Number,String],
            default:''
        },
        isNativeQuery:{
            type:Boolean,
            default:false
        },
        baseData:{
            type:Array,
            default:()=>{
                return []
            }
        },
        FfullColumns:{
            type:Array,
            default:()=>{
                return []
            }
        },
        FtableData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    components:{part1,charts,tFilter,tGroup,nativeQuery,Fieid},
    data() {
        return {
            gcwidth:'100%',
            showSt:true,
            showGl:false,
            filterType:1,
            loading:false,
            hostClass: 'spread-host',
            autoGenerateColumns: true,
            width: '100',
            visible: true,
            resizable: false,
            formatter: "$ #.00",
            columns1: [],
            data1: [],
            fullColumns:[],
            columnStyle: {
                color: 'red'
            },
            dataTable: [],
            changeShowSt:true,
            tableHeight:100,
            tubiao:true,
            chartType:'',
            chartValue:{},
            lineXData:[],
            saveChartLoading:false,
            maxResults:100,
            aggregation:[],
            filter:[],
            groupBy:{},
            mapName:'china',
            splitValue:.5
        }
    },
    created() {
        if(!this.isNativeQuery){
            this.fullColumns = this.FfullColumns
            let columns1 = this.FfullColumns
            for(let a of columns1){
                a.renderHeader = this.renderHeader
                a.minWidth = 100
                a.tooltip = true
            }
            this.columns1 = columns1
            this.data1 = this.FtableData
            this.dataTable = this.FtableData
            // this.getObject()
            // this.getColum()
        }
        if(this.isNativeQuery){
            this.tableHeight = window.innerHeight/2 - 70
        }else{
            this.tableHeight = window.innerHeight - 180
        }
        window.onresize = ()=>{
            if(this.isNativeQuery){
                this.tableHeight = window.innerHeight/2 - 70
            }else{
                this.tableHeight = window.innerHeight - 180
            }

        }
    },
    methods:{
        reflashGetObject(filter=[],aggregation=[],groupBy={}){
            this.filter = filter
            this.aggregation = aggregation
            this.groupBy = groupBy
            this.getObject(true)
        },
        getColum(){
            this.$http.post('/resource/statistic/query/result',
                qs.stringify(
                    {
                    queryAttribute:JSON.stringify({
                        query:{
                            objectId:this.objectId
                        },
                        constraints:{
                            maxResults:1
                        }
                    })
                }
                )
            )
            .then(res1=>{
                let res = res1.data
                if(res.success){
                    this.fullColumns = res.data.column
                }
            })
        },
        getObject(reflashShitu=false,type=1){
            this.loading = true
            // this.$http.get('http://localhost'+'/php/route/module/getFeature.php?name=')
            this.columns1 = []
            this.data1 = []
            this.dataTable = []
            if(type==1){
                let query={
                                objectId:this.objectId
                            }
                if(this.aggregation.length>0) query.aggregation = this.aggregation
                if(this.filter.length>0) query.filter = this.filter
                if(Object.keys(this.groupBy).length>0) query.groupBy = this.groupBy
                this.$http.post('/resource/statistic/query/result',
                    qs.stringify({
                        queryAttribute:JSON.stringify({
                            query,
                            constraints:{
                                maxResults:this.maxResults
                            }
                        })
                    })
                )
                .then(res1=>{
                    this.loading = false
                    let res = res1.data
                    if(res.success){
                        let columns1 = res.data.column
                        for(let a of columns1){
                            a.renderHeader = this.renderHeader
                            a.minWidth = 100
                            a.tooltip = true
                        }
                        this.columns1 = columns1
                        this.data1 = res.data.result
                        this.dataTable = res.data.result
                        if(reflashShitu) this.$refs.part1.setChart()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
                .finally(()=>{
                    this.loading = false
                })
            }else if(type==2){
                let query={
                                datasourceId:this.$refs.nativeQuery.datasourceId
                            }
                if(this.aggregation.length>0) query.aggregation = this.aggregation
                if(this.filter.length>0) query.filter = this.filter
                if(Object.keys(this.groupBy).length>0) query.groupBy = this.groupBy
                this.$http.post('/resource/statistic/query/result',
                    qs.stringify({
                        queryAttribute:JSON.stringify({
                            datasourceId:this.$refs.nativeQuery.datasourceId,
                            sql:this.$refs.nativeQuery.sql
                        })
                    })
                )
                .then(res1=>{
                    this.loading = false
                    let res = res1.data
                    if(res.success){
                        let columns1 = res.data.column
                        for(let a of columns1){
                            a.renderHeader = this.renderHeader
                            a.minWidth = 100
                            a.tooltip = true
                        }
                        this.columns1 = columns1
                        this.data1 = res.data.result
                        this.dataTable = res.data.result
                        if(reflashShitu) this.$refs.part1.setChart()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
                .finally(()=>{
                    this.loading = false
                })
            }
        },
        stbutton(){
            this.showSt = !this.showSt
            if(this.showSt) this.showGl = false
            // this.gcwidth = '99%'
            // setTimeout(()=>{
            //     this.gcwidth = '100%'
            // },10)
        },
        glButton(type){
            if(this.showGl){
                if(this.filterType==type){
                    this.showGl = false
                }else{
                    this.filterType = type
                }
            }else{
                this.showGl = true
                this.showSt = false
                this.filterType = type
            }
        },
        setChart(obj){
            console.log(obj)
            this.mapName = obj.mapName
            this.chartType = obj.chartType
            this.chartValue = setChart(obj,this.dataTable)
            // console.log(this.chartValue)
        },
        saveChart(obj){
            this.saveChartLoading = true
            let query={
                            objectId:this.objectId
                        }
            if(this.aggregation.length>0) query.aggregation = this.aggregation
            if(this.filter.length>0) query.filter = this.filter
            if(Object.keys(this.groupBy).length>0) query.groupBy = this.groupBy
            let params = Object.assign(obj,{
                queryAttribute:JSON.stringify({
                    query,
                    constraints:{
                        maxResults:this.maxResults
                    }
                })
            })

            // console.log(params)
            let config = {
                    headers: {
                    'Content-Type': 'application/json'
                    }
                }
            this.$http.post('/resource/statistic/query/create',qs.stringify(params))
            // this.$http.post(ip+'/resource/statistic/query/create',params,config)
                .then(res1=>{
                    let res = res1.data
                    this.saveChartLoading = false
                    if(res.success){
                        this.$Message.success('保存成功')
                        this.$refs.part1.saveSuccess()
                    }else{
                        this.$Message.error(res.message)
                    }
                })
                .finally(()=>{
                    this.saveChartLoading = false
                })
        },
        renderHeader(h,{column,index}){
            return h('div',{
                style:'color:#2d8cf0'
            },column.title)
        },
        changeDatasourceId(){
            if(this.isNativeQuery){
                this.showGl = true
                this.$refs.fieid.selectItemFromOther(this.$refs.nativeQuery.datasourceId)
            }
        }
    }
}
</script>

<style>
    .sobject .hidden-tbody .ivu-table-body,.sobject .hidden-tbody .ivu-table-tip {
    display: none;
    
}
 .zhibiaohover{
  cursor: pointer;
    border-radius: 4px;
    box-sizing: border-box;
    /* margin-top: 8px; */
    padding: 5px;
    line-height: 12px
}
.zhibiaohover> span:first-child{
    color:#C7CFD4;
}
.zhibiaohover> span{
      vertical-align: middle;
    font-size: 12px;
    font-weight: 700;
}
</style>
<style scoped>
.checked{
    background-color: rgb(80, 158, 227);
    color: white;
}
.checked2{
    background-color: #7172AD !important;
    color: white !important;
}
.checked3{
    background-color: #88BF4D !important;
    color: white !important;
}
.spread-host {
    width: 100%;
    height: calc(100% - 30px);
}
.guolvbutton{
    background-color: rgba(113, 114, 173, 0.2);
    color: rgb(113, 114, 173);
}
.juhebutton{
    background-color: rgba(136, 191, 77, 0.2);
    color: rgb(136, 191, 77);
}
</style>