<template>
<Base ref="base" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
import Base from './Base'
export default {
    name: 'ChartTree',
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
            let legend = [],
                value = []
            for (let i in this.value) {
                legend.push(i)
                value.push({
                    name: i,
                    value: this.value[i]
                })
            }
            var data = {
                "name": "long_time_test",
                "children": [{
                        "name": "定时任务",
                        "children": [{
                            "name": "job1",
                            "value": 4116
                        }]
                    },
                    {
                        "name": "数据源",
                        "children": [{
                                "name": "IScaleMap",
                                "value": 2105
                            },
                            {
                                "name": "LinearScale",
                                "value": 1316
                            },
                            {
                                "name": "LogScale",
                                "value": 3151
                            },
                            {
                                "name": "OrdinalScale",
                                "value": 3770
                            },
                            {
                                "name": "QuantileScale",
                                "value": 2435
                            },
                            {
                                "name": "QuantitativeScale",
                                "value": 4839
                            },
                            {
                                "name": "RootScale",
                                "value": 1756
                            },
                            {
                                "name": "Scale",
                                "value": 4268
                            },
                            {
                                "name": "ScaleType",
                                "value": 1821
                            },
                            {
                                "name": "TimeScale",
                                "value": 5833
                            }
                        ]
                    },
                ]
            };
            let that = this
            this.option = {
                tooltip: {
                    trigger: 'item',
                    triggerOn: 'mousemove'
                },
                legend: {
                    show:false,
                    top: '2%',
                    left: '3%',
                    orient: 'vertical',
                    data: [{
                            name: 'tree1',
                            icon: 'rectangle'
                        },
                        {
                            name: 'tree2',
                            icon: 'rectangle'
                        }
                    ],
                    borderColor: '#c23531'
                },
                series: [{
                    type: 'tree',

                    name: 'tree1',

                    data: [data],

                    // top: '5%',
                    // left: '7%',
                    // bottom: '2%',
                    // right: '60%',

                    symbolSize: 7,

                    label: {
                        position: 'left',
                        verticalAlign: 'middle',
                        align: 'right'
                    },

                    leaves: {
                        label: {
                            position: 'right',
                            verticalAlign: 'middle',
                            align: 'left'
                        }
                    },

                    expandAndCollapse: true,

                    animationDuration: 550,
                    animationDurationUpdate: 750

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
