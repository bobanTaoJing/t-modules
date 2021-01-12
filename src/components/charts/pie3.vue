<template>
<Base ref="base" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
//饼图 百分比
import Base from './Base'
// import echarts from 'echarts'
export default {
    name: 'ChartPie3',
    props: {
        value: Object,
        text: {
            type: String,
            default: null
        },
        subtext: String,
        height: {
            type: [String, Number],
            default: '400px'
        },
        colorArray: {
            type: Array,
            default: []
        },
        disHover: {
            type: Boolean,
            default: false
        },
        showLegend: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            default: null
        },
        name:{
            type:String,
            default:''
        }
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
            // let legend = [],
            //     value = []
            // for (let i in this.value) {
            //     legend.push(i)
            //     value.push({
            //         name: i,
            //         value: this.value[i]
            //     })
            // }
            let that = this
            var value = 83

            var axislineColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                    offset: 0,
                    color: '#25ABAA'
                },
                {
                    offset: 0.5,
                    color: '#25ABAA'
                },

                {
                    offset: 1,
                    color: '#F63332'
                }
            ]);
            this.option = {
                tooltip: {
                    formatter: "{a} <br/>{b} : {c}%"
                },
                toolbox: {
                    show:false,
                    feature: {
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [{
                        name: '业务指标',
                        type: 'gauge',
                        detail: {
                            formatter: '{value}%',
                            color: '#2378f7',
                            offsetCenter: [0, '5%']
                        },
                        title: {
                            // fontWeight: 'bold',
                            offsetCenter: [0, '140%'],
                        },
                        data: [{
                            value: 50,
                            name: this.name,

                        }],
                        itemStyle: {
                            opacity: 1
                        },
                        radius: "55%",
                        axisTick: {
                            show: false
                        },
                        splitLine: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                width: 36,
                                color: [
                                    [1, '#F4F4F4']
                                ]
                            }
                        },
                        // axisLine: {    
                        //     show: false,// 坐标轴线
                        //     lineStyle: {       // 属性lineStyle控制线条样式
                        //         width: 10,
                        //         opacity: 0,
                        //     }
                        // },      
                        axisLabel: {
                            formatter: function (v) {
                                switch (v + '') {
                                    case '0':
                                        return '70';
                                    case '1':
                                        return '';
                                    case '100':
                                        return '100';
                                }
                            },
                            distance: -80,
                        },

                        pointer: {
                            show: false,
                            length: "60%"
                        }
                    },
                    {
                        zlevel: 1,
                        type: 'pie',
                        radius: ["80%", "82%"],
                        data: [{
                                value: 3,
                                itemStyle: {
                                    normal: {
                                        borderWidth: 12,
                                        borderColor: axislineColor
                                    }
                                }
                            },
                            {
                                value: 1,
                                itemStyle: {
                                    opacity: 0
                                }
                            }
                        ],
                        tooltip: {
                            show: false
                        },
                        startAngle: 225,
                        hoverAnimation: false,
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }

                    }
                ]
            };
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
