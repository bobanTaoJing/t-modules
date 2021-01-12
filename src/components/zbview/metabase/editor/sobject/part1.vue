<template>
    <div>
        <div v-show="showtype==1">
            <h3>
            选择可视化方法
            </h3>
            <Row :gutter="10" style="padding:5px">
                <i-col   :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton"
                    v-for="(item,index) in [
                        {name:'柱',value:'bar'},
                        {name:'线段',value:'line'},
                        {name:'饼图',value:'pie'},
                        {name:'数字',value:'number'}
                    ]" :key="index">
                    <Button class="nomalbutton" :class="{checked:chartType==item.value}" @click="showtype=2,chartType=item.value,$emit('update:tubiao',false),changeData()">
                        <chartSvg :type="item.value"></chartSvg>
                    </Button>
                    <span>{{item.name}}</span>
                </i-col>
                <!-- <i-col   :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton">
                    <Button class="nomalbutton" :class="{checked:chartType=='bar'}" @click="showtype=2,chartType='bar',$emit('update:tubiao',false),changeData()">
                        <chartSvg type="bar"></chartSvg>
                    </Button>
                    <span>柱</span>
                </i-col>
                <i-col :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton">
                    <Button class="nomalbutton" :class="{checked:chartType=='line'}"  @click="showtype=2,chartType='line',$emit('update:tubiao',false),changeData()">
                        <chartSvg type="line"></chartSvg>
                    </Button>
                    <span>线段</span>
                </i-col>
                <i-col :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton">
                    <Button class="nomalbutton" :class="{checked:chartType=='pie'}"  @click="showtype=2,chartType='pie',$emit('update:tubiao',false),changeData()">
                        <chartSvg type="pie"></chartSvg>
                    </Button>
                    <span>饼图</span>
                </i-col>
                <i-col :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton">
                    <Button class="nomalbutton" :class="{checked:chartType=='number'}"  @click="showtype=2,chartType='number',$emit('update:tubiao',false),changeData()">
                        <chartSvg type="number2"></chartSvg>
                    </Button>
                    <span>数字</span>
                </i-col>
                <i-col :sm="24" :md="24" :lg="12" :xl="8" class="icon-nomalbutton">
                    <Button class="nomalbutton" :class="{checked:chartType=='map'}"  @click="showtype=2,chartType='map',$emit('update:tubiao',false),changeData()">
                        <chartSvg type="map"></chartSvg>
                    </Button>
                    <span>地图</span>
                </i-col> -->
                <!-- <i-col :span="8" class="icon-nomalbutton">
                    <Button class="nomalbutton">
<svg class="Icon Icon-bubble Icon-cxuQhR kTAgZA" viewBox="0 0 32 32" width="20" height="20" fill="currentcolor"><path d="M18.155 20.882c-5.178-.638-9.187-5.051-9.187-10.402C8.968 4.692 13.66 0 19.448 0c5.789 0 10.48 4.692 10.48 10.48 0 3.05-1.302 5.797-3.383 7.712a7.127 7.127 0 1 1-8.39 2.69zm-6.392 10.14a2.795 2.795 0 1 1 0-5.59 2.795 2.795 0 0 1 0 5.59zm-6.079-6.288a4.541 4.541 0 1 1 0-9.083 4.541 4.541 0 0 1 0 9.083z"></path></svg>                    </Button>
                    <span>柱</span>
                </i-col> -->
            </Row>
        </div>
        <div v-show="showtype==2">
            <h3 @click="showtype=1" style="cursor:pointer">
                <a>
                <Icon type="ios-arrow-back" />&nbsp;&nbsp;选项
                </a>
            </h3>
            <template v-if="['bar','line','pie'].indexOf(chartType)>-1">
                <div class="oneParam">
                    <h5>X轴</h5>
                    <Select v-model="xString1" style="width:100%" @on-change="changeData">
                        <template v-for="item in columns">
                            <Option :value="item.key" :key="item.key" v-if="item.dataType=='STRING'||item.dataType=='DATE'">{{ item.key }}</Option>
                        </template>
                    </Select>
                </div>
                <!-- <Select v-model="xString2" style="width:100%">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <div class="oneParam">
                    <h5>Y轴</h5>
                    <Select v-model="yString1" style="width:100%" @on-change="changeData">
                        <template v-for="item in columns">
                            <Option :value="item.key" :key="item.key" v-if="item.dataType=='NUMBER'">{{ item.key }}</Option>
                        </template>
                    </Select>
                </div>
            </template>
            <template v-else-if="['number'].indexOf(chartType)>-1">
                <div class="oneParam">
                    <h5>显示的字段</h5>
                    <Select v-model="xString1" style="width:100%" @on-change="changeData">
                        <template v-for="item in columns">
                            <Option :value="item.key" :key="item.key" v-if="item.dataType=='NUMBER'">{{ item.key }}</Option>
                        </template>
                    </Select>
                </div>
            </template>
            <template v-else-if="['map'].indexOf(chartType)>-1">
                <div class="oneParam">
                    <h5>地图范围</h5>
                    <Select v-model="mapName" style="width:100%" @on-change="changeData">
                        <template v-for="item in [{label:'china',key:'china'},
                        {label:'湖北',key:'湖北'},{label:'河南',key:'河南'},
                        {label:'陕西',key:'陕西'},{label:'新疆',key:'新疆'},
                        {label:'北京',key:'北京'},{label:'上海',key:'上海'},
                        {label:'世界',key:'world'}
                        ]">
                            <Option :value="item.key" :key="item.key">{{ item.label }}</Option>
                        </template>
                    </Select>
                </div>
                <div class="oneParam">
                    <h5>地区名</h5>
                    <Select v-model="xString1" style="width:100%" @on-change="changeData">
                        <template v-for="item in columns">
                            <Option :value="item.key" :key="item.key">{{ item.key }}</Option>
                        </template>
                    </Select>
                </div>
                <!-- <Select v-model="xString2" style="width:100%">
                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
                <div class="oneParam">
                    <h5>值</h5>
                    <Select v-model="yString1" style="width:100%" @on-change="changeData">
                        <template v-for="item in columns">
                            <Option :value="item.key" :key="item.key" v-if="item.dataType=='NUMBER'">{{ item.key }}</Option>
                        </template>
                    </Select>
                </div>
            </template>
            <br>
            <p v-if="['number'].indexOf(chartType)>-1">
                <Button :disabled="!xString1" @click="modal10=true">保存视图</Button>
            </p>
            <p v-else>
                <Button :disabled="!xString1||!yString1" @click="modal10=true">保存视图</Button>
            </p>
            <!-- <Select v-model="yString2" style="width:100%">
                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select> -->
            <Modal
                title="保存视图"
                v-model="modal10"
                class-name="vertical-center-modal" :footer-hide="true">
                <FormDynamic :data="dynamic"
                 ref="dataFrom"
                 :label-width="100"></FormDynamic>
                 <div solt="footer" style="text-align:right">
                     <Button @click="saveChart" :loading="saveChartLoading" type="primary">确定</Button>
                 </div>
            </Modal>
        </div>
    </div>
</template>
<script>
import {
    FormDynamic,chartSvg
} from '@/components/index.js';
export default {
    components:{FormDynamic,chartSvg},
    props:{
        columns:{
            type:Array,
            default:function(){
                return []
            }
        },
        data:{
            type:Array,
            default:function(){
                return []
            }
        },
        tubiao:{
            type:Boolean,
            default:true
        },
        saveChartLoading:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            showtype:1,
            chartType:'',
            xString1:'',
            yString1:'',
            mapName:'china',
            modal10:false,
            dynamic:[
                [
                    {
                        name: 'name',
                        type: 'text',
                        span: 24,
                        label: '标题',
                        labelWidth: 100,
                        rules: {
                            required: true,
                        },
                    }, {
                        name: 'comments',
                        type: 'text',
                        span: 24,
                        label: '描述',
                        labelWidth: 100,
                    }
                ]
            ]
        }
    },
    methods:{
        changeData(){
            if(this.xString1&&(this.yString1||(!this.yString1&&['number'].indexOf(this.chartType)>-1))&&this.chartType){
                this.$emit('update:tubiao',false)
            }
            this.setChart()
        },
        setChart(){
            this.$emit('setChart',{
                    mapName:this.mapName,
                    chartType:this.chartType,
                    xString1:this.xString1,
                    yString1:this.yString1,
                })
        },
        saveChart(){
            this.$refs.dataFrom.submit(params=>{
                this.$emit('saveChart',{
                    cardAttribute:JSON.stringify({
                        mapName:this.mapName,
                        chartType:this.chartType,
                        xString1:this.xString1,
                        yString1:this.yString1,
                        comments:params.components
                    }),
                    name:params.name
                })
            })
        },
        saveSuccess(){
            this.modal10 = false
        }
    }
}
</script>
<style scoped>
    .icon-nomalbutton{
    color:#509ee3;
    font-weight: bold;
    text-align: center;
}
.nomalbutton{
    box-sizing: border-box;
    background-color: rgb(212, 231, 248);
    width:100%;
    border-radius: 10px;
    margin-bottom: 10px;
    color:#509ee3;
    padding-top:10px;
}
.nomalbutton:hover{
    background:#509ee3;
    color:#fff;
}
.checked{
    background-color: rgb(80, 158, 227);
    color: white;
}
.oneParam{
    padding:5px;
}
</style>