<template>
    <div>
        <div style="position:relative;">
            <div style="top: 6px;position: absolute;right: 7px;z-index: 1;">
                <Icon title="放大" @click="modal1=true" style="cursor:pointer" type="md-expand" />
            </div>
            <charts v-if="chartOption.cardAttribute&&chartOption.cardAttribute.chartType" :disHover='disHover' :mapName="chartOption.cardAttribute.mapName" :chartType="chartOption.cardAttribute.chartType" :loading="loading" :text="chartOption.name" :chartValue="chartValue" :height="height"></charts>
            <Card v-else :bordered='false' :dis-hover="false">
                <div>
                    <div class="chart-title">{{chartOption.name}}</div>
                    <Table :columns="columns1" :data="dataTable" :height="height" :loading="loading"></Table>
                    <!-- <slot name="novalue" v-if="noValue"></slot> -->
                </div>
            </Card>
        </div>
        <Modal
            v-model="modal1"
            :title="chartOption.name" footer-hide :width="1000">
            <template v-if="modal1">
                <Tabs value="name1">
                    <TabPane label="视图" name="name1">
                        <charts v-if="chartOption.cardAttribute&&chartOption.cardAttribute.chartType" :disHover='disHover' :mapName="chartOption.cardAttribute.mapName" :chartType="chartOption.cardAttribute.chartType" :loading="loading" :chartValue="chartValue" :height="500"></charts>
                    </TabPane>
                    <TabPane label="表格" name="name2">
                        <Table :columns="columns1" :data="dataTable" :height="500" :loading="loading"></Table>
                    </TabPane>
                </Tabs>
            </template>
        </Modal>
    </div>
</template>
<script>
import {ip,setChart} from './basedata'
import charts from './objCharts'
export default {
    components:{charts},
    props:{
        chartOption:{
            type:Object,
            default:function(){
                return {}
            }
        },
        height:{
            type:Number,
            default:150
        },
        disHover:{
            type:Boolean,
            default:true
        },
    },
    data(){
        return{
            chartValue:{},
            columns1:[],
            data1:[],
            dataTable:[],
            loading:false,
            modal1:false
        }
    },
    mounted(){
        
        this.getObject()
    },
    methods:{
        getObject(){
            if(Object.keys(this.chartOption).length<=0) return
             this.loading = true
            //  console.log(this.chartOption)

             this.$http.get(ip+'/resource/statistic/query/result',{
                params:{
                    queryId:this.chartOption.id
                }
            })
            .then(res1=>{
                this.loading = false
                let res = res1.data
                if(res.success){
                    this.columns1 = res.data.column
                    this.data1 = res.data.result
                    this.dataTable = res.data.result
                    if(this.chartOption.cardAttribute)
                    this.chartValue = setChart(this.chartOption.cardAttribute,this.dataTable)
                }else{
                    this.$Message.error(res.message)
                }
            })
            .finally(()=>{
                this.loading = false
            })
            return
            // this.$http.get('http://localhost'+'/php/route/module/getFeature.php?name=')
            setTimeout(() => {
                let data = {}
                let columns = []
                for (let i = 0; i < 20; i++) {
                    columns.push({
                        title: 'key' + i,
                        key: 'key' + i,
                        width:100
                    })
                    data['key' + i] = i
                }
                let data1 = []
                for (let i = 0; i < 300; i++) {
                    data1.push(data)
                }
                let dataTable = [];
                for (let j = 0; j < 300; j++) {
                    let obj = {}
                    for (let i = 0; i < 20; i++) {
                        obj['key' + i] = (Math.random()*100 + 0.56).toFixed(2)
                    }
                    dataTable.push(obj)

                }
                this.columns1 = columns
                this.data1 = data1
                this.dataTable = dataTable
                this.chartValue = setChart(this.chartOption.chart,dataTable)
                // console.log(this.chartValue)
                this.loading = false

            }, 100)
        },
    },
    watch:{
        chartOption(){
            this.getObject()
        }
    }
}
</script>