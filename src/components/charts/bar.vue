<template>
<div>
    <Base ref="base" :loading="loading" :text="text" :height="height" :disHover="disHover" :option="option">
    </Base>
</div>
</template>

<script>
import Base from './Base'
export default {
    name: 'ChartBar',
    props: {
        loading:{
            type:Boolean,
            default:false
        },
        value: {
            type:Array,
            default:function(){
                return []
            }
        },
        isTrueValue: {
            type: Boolean,
            default: false
        },
        text: {
            type: String,
            default: null
        },
        subtext: String,
        textColor:{
            type:String,
            default:'rgb(92, 107, 119)'
        },
        bgColor:{
            type:String,
            default:'transparent'
        },
        height: {
            type: [String, Number],
            default: '400px'
        },
        colorArray: {
            type: Array,
            default: function () {
                return []
            }
        },
        disHover: {
            type: Boolean,
            default: false
        },
        showLabel: {
            type: Boolean,
            default: true
        },
        theme:{
            type:String,
            default:'default'
        },
        xAxisColor:{
            type:String,
            default:''
        },
        xAxisSplitColor:{
            type:String,
            default:''
        },
        yAxisColor:{
            type:String,
            default:''
        },
        yAxisSplitColor:{
            type:String,
            default:'#DDD'
        }
    },
    data() {
        return {
            dom: null,
            option: {},
            noValue: false
        }
    },
    computed: {
        nheight() {
            if (this.height.indexOf('px') > -1)
                return this.height.split('px')[0]
            else return this.height
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.option = {}
            if (this.value.length<=0) {
                this.option = {
                    backgroundColor:this.bgColor,
                    color: ['#ddd'],
                    title: {
                      text: this.text,
                      subtext: this.subtext,
                      x: 'center',
                      textStyle:{
                        color:this.textColor,
                        fontSize:20
                    }
                    },
                    tooltip: {
                        // show: false,
                        trigger: 'none',
                        axisPointer: { // 坐标轴指示器，坐标轴触发有效
                            type: 'none', // 默认为直线，可选为：'line' | 'shadow'
                            z: -1
                        }
                    },
                    grid:{
                        left: '3%',
                        right: '4%',
                        bottom: 6,
                        top:50,
                        containLabel: true
                    },
                    xAxis: [{
                        type: 'category',
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        axisTick: {
                            alignWithLabel: false
                        }
                    }],
                    yAxis: [{
                        type: 'value'
                    }],
                    series: [{
                        name: '',
                        type: 'bar',
                        cursor:'default',
                        barWidth: '60%',
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        itemStyle:{
                            normal: { color: '#e6e6e6' },  //正常颜色
                            emphasis: { color: '#e6e6e6' }, //鼠标移入颜色
                        }
                    }]
                };
            } else {
                let xData = [],
                    dataLegend = [],
                    series = []
                if (this.value.length > 0) {
                    xData = Object.keys(this.value[0].data)
                }
                for (let i=0;i< this.value.length;i++) {
                    let a = this.value[i]
                    series.push({
                        name: a.name,
                        type: 'bar',
                        itemStyle:{
                            color: this.colorArray[i] ? this.colorArray[i] : '',
                        },
                        data: Object.values(a.data),
                    })
                    dataLegend.push(a.name)
                }
                // console.log(xAxisData)
                this.option = {
                    backgroundColor:this.bgColor,
                    title: {
                      text: this.text,
                      subtext: this.subtext,
                      x: 'center',
                      textStyle:{
                        color:this.textColor,
                        fontSize:20
                    }
                    },
                    grid:{
                        left: '3%',
                        right: '4%',
                        bottom: 6,
                        top:50,
                        containLabel: true
                    },
                    tooltip:{
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    toolbox: {
                        show: xData && xData.length > 10,
                        feature: {
                            // dataZoom: {
                            //     yAxisIndex: false
                            // },
                            // saveAsImage: {
                            //     pixelRatio: 2
                            // }
                        }
                    },
                    dataZoom: [{
                        type: 'inside'
                    }, {
                        type: 'slider'
                    }],
                    legend: {
                        // show: this.showLegend,
                        type:'plain',
                        data: dataLegend,
                        top: 30,
                        x: 'center',
                        // top:'12%',
                        // y:'35',
                        // icon: 'circle',
                        itemWidth: 10,
                        itemHeight: 10,
                        textStyle:{
                            color:this.textColor
                        },
                    },
                    xAxis: {type: 'category',
                        data: xData},
                    yAxis: [{
                        type: 'value',
                        axisLabel:{
                            color:this.yAxisColor
                        },
                        splitLine:{
                            lineStyle:{
                                color:this.yAxisSplitColor
                            }
                        }
                    }],
                    series
                }
            }
            this.$refs.base.init(this.theme)
        }
    },
    watch: {
        value: {
            handler() {
                this.init()
            },
            deep: true
        },
        theme(){
            this.init()
        }
    },
    components: {
        Base
    }
}
</script>
