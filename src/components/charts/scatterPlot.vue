<template>
    <Base ref="base" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
import Base from './Base'

export default {
    name: 'scatterPlotChart',
    props: {
        height: {
            type: [String, Number],
            default: '400px'
        },
        value: {
            type: Array,
            default: function () {
                return []
            }
        },
        text: {
            type: String,
            default: null
        },
        subtext: '',
        showLegend: true,
        disHover:{
            type:Boolean,
            default:false
        },
        xName:'',
        yName:''
    },
    data() {
        return {
            dom: null,
            option: {}
        }
    },
    mounted() {
        this.init()
    },
    methods:{
        init(){
            let series = []
            this.value.map((value,index)=>{
                series.push({
                    symbol:index==0?'pin':'circle',
                    symbolSize: index==0?30:10,
                    data: value,
                    type: 'scatter',
                })
                return value
            })
            this.option = {
                xAxis: {
                    name:this.xName
                },
                yAxis: {
                    name:this.yName
                },
                tooltip: {
                    // formatter: 'feature_no {a},{b},{c},{d},{e}',
                    formatter: function (param) {
                        return param.data[2]+' : ('+param.data[0]+','+param.data[1]+')';
                    },
                    axisPointer: {
                        show: true,
                        type: 'cross',
                        lineStyle: {
                            type: 'dashed',
                            width: 1
                        },
                    }
                },
                series
            };
            this.$refs.base.init()
        }
    },
    watch:{
        value:{
            handler(){
                // console.log('change value')
                this.init()
            },
            deep:true
        }
    },
    components:{Base}
}
</script>
