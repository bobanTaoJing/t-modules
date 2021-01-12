<template>
<Base ref="base" :loading="loading" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
import Base from './Base'

export default {
    name: 'ChartDoubleLine',
    props: {
        loading: {
            type: Boolean,
            default: false
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
                    title: {
                        show:false,
                        text: '动态数据',
                        subtext: '纯属虚构'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: 6,
                        top: 10,
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis',
                        show:false,
                    },
                    legend: {
                        data: ['线一', '线二']
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataView: {
                                readOnly: false
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    // dataZoom: {
                    //     show: false,
                    //     start: 0,
                    //     end: 100
                    // },
                    xAxis: [{
                            type: 'category',
                            boundaryGap: true,
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        },
                        {
                            type: 'category',
                            boundaryGap: true,
                            show: false,
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                        }
                    ],
                    yAxis: [{
                            type: 'value',
                            scale: true,
                            name: '线一',
                            boundaryGap: [0.2, 0.2],
                            itemStyle: {
                                color: '#ddd'
                            }
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: '线二',
                            boundaryGap: [0.2, 0.2],
                            itemStyle: {
                                color: '#ddd'
                            }
                        }
                    ],
                    series: [{
                            name: '线一',
                            type: 'line',
                            xAxisIndex: 1,
                            yAxisIndex: 1,
                            data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                            itemStyle: {
                                color: '#ddd'
                            }
                        },
                        {
                            name: '线二',
                            type: 'line',
                            data: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                            itemStyle: {
                                color: '#ddd'
                            }
                        }
                    ]
                };

            } else {
                let xData = this.xData,
                    dataLegend = [],
                    series = []
                // if (this.value.length > 0) {
                //     xData = Object.keys(this.value[0].value)
                // }
                for (let i in this.value.slice(0,2)) {
                    let a = this.value[i]
                    let obj ={
                        name: a.name,
                        type: 'line',
                        itemStyle: {
                            color: a.color ? a.color : '#baf1a1',
                        },
                        data: a.value,
                        // data: Object.values(a.value),
                    }
                    if(i==0){
                        // obj.data = [1,2,3,4]
                    }else if(i==1){
                        obj.xAxisIndex=1
                        obj.yAxisIndex=1
                    }
                    series.push(obj)
                    dataLegend.push(a.name)
                }
                this.option = {
                    title: {
                        show:false,
                        text: '动态数据',
                        subtext: '纯属虚构'
                    },
                    tooltip: {
                        trigger: 'axis',
                        formatter:'{b}<br/>{a}：{c}<br/>{a1}：{c1}'
                    },
                    legend: {
                        data:dataLegend
                    },
                    toolbox: {
                        show: false,
                        feature: {
                            dataView: {
                                readOnly: false
                            },
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    dataZoom: {
                        show: false,
                        start: 0,
                        end: 100
                    },
                    xAxis: [{
                            type: 'category',
                            boundaryGap: true,
                            data: xData
                        },
                        {
                            type: 'category',
                            boundaryGap: true,
                            show: false,
                            data: xData
                        }
                    ],
                    yAxis: [{
                            type: 'value',
                            scale: true,
                            name: dataLegend[0],
                            // boundaryGap: [0.2, 0.2]
                        },
                        {
                            type: 'value',
                            scale: true,
                            name: dataLegend[1],
                            // boundaryGap: [0.2, 0.2]
                        }
                    ],
                    series:series
                };

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
