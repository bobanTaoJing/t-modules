<template>
<Base ref="base" :loading="loading" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
import Base from './Base'

export default {
    name: 'ChartLine',
    props: {
        loading:{
            type:Boolean,
            default:false
        },
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
        xData: {
            type: Array,
            default: function () {
                return []
            }
        },
        text: {
            type: String,
            default: null
        },
        textColor:{
            type:String,
            default:'rgb(92, 107, 119)'
        },
        bgColor:{
            type:String,
            default:'transparent'
        },
        subtext: '',
        showLegend: true,
        maxValue: null,
        disHover: {
            type: Boolean,
            default: false
        },
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
    methods: {
        init() {
            // console.log('line init')
            // console.log(this.value)
            if (this.value.length <= 0) {
                this.option = {
                    backgroundColor:this.bgColor,
                    title: {
                        show:true,
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
                    xAxis: {
                        type: 'category',
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        // axisLine: {
                        //     lineStyle: {
                        //         color: '#ddd'
                        //     }
                        // }
                    },
                    yAxis: {
                        type: 'value',
                        // axisLine: {
                        //     lineStyle: {
                        //         color: '#ddd'
                        //     }
                        // }
                    },
                    series: [{
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                        type: 'line',
                        itemStyle: {
                            color: '#ddd'
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
                for (let a of this.value) {
                    series.push({
                        name: a.name,
                        type: 'line',
                        itemStyle:{
                            color: a.color ? a.color : '#baf1a1',
                        },
                        data: Object.values(a.data),
                    })
                    dataLegend.push(a.name)
                }
                this.option = {
                    backgroundColor:this.bgColor,
                    title: {
                        show:true,
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
                        // textStyle:{
                        //     color:'#1bb4f6'
                        // },
                    },
                    xAxis: [{
                        type: 'category',
                        boundaryGap: false,
                        data: xData
                    }],
                    yAxis: [{
                        type: 'value',
                        // max:this.maxValue
                    }],
                    series: series
                }

            }
            if(this.xData.length>10){
                this.option.dataZoom= [{
                        type: 'inside'
                    }, {
                        type: 'slider'
                    }]
            }
            this.$refs.base.init()
        }
    },
    watch: {
        value: {
            handler() {
                this.init()
            },
            deep: true
        }
    },
    components: {
        Base
    }
}
</script>
