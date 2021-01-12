<template>
    <div>
        <ChartBar v-if="chartType.toLowerCase()=='bar'" :loading="loading" :text="text" :showLabel="showLabel" :isTrueValue="isTrueValue" :value="chartValue" :height="height+'px'" :disHover="disHover"></ChartBar>
        <ChartLine v-else-if="chartType.toLowerCase()=='line'" :loading="loading" :text="text" :xData="chartValue.xData" :value="chartValue.value" :height="height+'px'" :disHover="disHover"></ChartLine>
        <ChartPie v-else-if="chartType.toLowerCase()=='pie'" :loading="loading" :text="text" :value="chartValue.value" :height="height+'px'" :disHover="disHover" :showLegend="false"></ChartPie>
        <chartNumb v-else-if="chartType.toLowerCase()=='number'" :loading="loading" :text="text" :value="chartValue.value" :style="'text-align:center;padding-top:'+0+'px'" :height="height+'px'" :disHover="disHover" countSize="40px" :trueValue="numTrueValue" :showLegend="false"></chartNumb>
        <ChartMap v-else-if="chartType.toLowerCase()=='map'" :loading="loading" :text="text" :value="chartValue.value" :mapName="mapName" :height="height+'px'" :disHover="disHover" countSize="40px" :trueValue="numTrueValue" :showLegend="false"></ChartMap>
        <span v-else>未知类型</span>
    </div>
</template>
<script>
import {ChartBar,ChartLine,ChartPie,chartNumb,ChartMap
} from '@/components/index.js';
export default {
    components:{ChartBar,ChartLine,ChartPie,chartNumb,ChartMap},
    props:{
        chartType:{
            type:String,
            default:'bar'
        },
        text:{
            type:String,
            default:''
        },
        height:{
            type:Number,
            default:100
        },
        chartValue:{
            type:[Array,Object]
        },
        disHover:{
            type:Boolean,
            default:true
        },
        isTrueValue:{
            type:Boolean,
            default:true
        },
        showLabel:{
            type:Boolean,
            default:false
        },
        loading:{
            type:Boolean,
            default:false
        },
        numTrueValue:{
            type:Boolean,
            default:false
        },
        mapName:{
            type:String,
            default:'china'
        }
    }
}
</script>