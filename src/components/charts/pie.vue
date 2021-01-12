<template>
<Base ref="base" :loading="loading" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
//饼图
import Base from './Base'
export default {
    name: 'ChartPie',
    props: {
        loading:{
            type:Boolean,
            default:false
        },
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
            default: function(){
                return []
            }
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
            // console.log(this.value)
            if (!this.value||Object.keys(this.value).length <= 0) {
                this.option = {
                    series: [{
                        name: '',
                        type: 'pie',
                        radius: ['50%', '90%'],
                        center: ['50%', '50%'],
                        cursor: 'default',
                        selectedOffset: 0,
                        hoverOffset: 0,
                        legendHoverLink: false,
                        data: [{
                                value: 10,
                                name: '1',
                                itemStyle: {
                                    normal: {
                                        color: '#e6e6e6'
                                    }, //正常颜色
                                    emphasis: {
                                        color: '#e6e6e6'
                                    }, //鼠标移入颜色
                                }
                            },
                            {
                                value: 10,
                                name: '2',
                                itemStyle: {
                                    normal: {
                                        color: '#ddd'
                                    }, //正常颜色
                                    emphasis: {
                                        color: '#ddd'
                                    }, //鼠标移入颜色
                                }
                            },
                            {
                                value: 10,
                                name: '3',
                                itemStyle: {
                                    normal: {
                                        color: '#e6e6e6'
                                    }, //正常颜色
                                    emphasis: {
                                        color: '#e6e6e6'
                                    }, //鼠标移入颜色
                                }
                            },
                            {
                                value: 10,
                                name: '4',
                                itemStyle: {
                                    normal: {
                                        color: '#ddd'
                                    }, //正常颜色
                                    emphasis: {
                                        color: '#ddd'
                                    }, //鼠标移入颜色
                                }
                            },
                        ],
                        // label: {
                        //     show: false
                        // }
                    }]
                }
            } else {
                let legend = [],
                    value = []
                for (let a of this.value) {
                    legend.push(a.name)
                    value.push({
                        name: a.name,
                        value: a.value,
                        // color:this.value[i].color?this.value[i].color:'#ddd'
                    })
                }
                let that = this
                this.option = {
                    title: {
                        // show:!!this.title,
                        text: this.title,
                        x: 'left',
                        textStyle: {
                            color: 'rgb(92, 107, 119)',
                            fontSize: 20
                        }
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'right',
                        show: this.showLegend,
                        data: legend
                    },
                    series: [{
                        type: 'pie',
                        radius: ['50%','90%'],
                        center: ['50%', '50%'],
                        data: value,
                        itemStyle:{
                            normal:{
                                label : {
                                    show : legend.length>10?false:true
                                },
                                labelLine : {
                                    show : legend.length>10?false:true
                                }
                            },
                            emphasis:{
                                label : {
                                    show : legend.length>10?false:true
                                },
                                labelLine : {
                                    show : legend.length>10?false:true
                                }
                            }
                        },
                        // itemStyle: {
                        //     normal: {
                        //         show: true,
                        //         color: function (params) {
                        //             let num = that.colorArray.length;
                        //             if (num <= 0) return ''
                        //             return that.colorArray[params.dataIndex % num]
                        //         },
                        //         // barBorderRadius: 70,
                        //         // borderWidth: 0,
                        //         // borderColor: '#333',
                        //     },
                        //     emphasis: {
                        //         shadowBlur: 10,
                        //         shadowOffsetX: 0,
                        //         shadowColor: 'rgba(0, 0, 0, 0.5)'
                        //     }
                        // }
                    }]
                }
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
