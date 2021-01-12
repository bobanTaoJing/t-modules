<template>
<Base ref="base" :loading="loading" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
import echarts from 'echarts/lib/echarts'
import 'echarts/lib/chart/map'
import Base from './Base'

export default {
    name: 'ChartMap',
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
        mapName: {
            type: String,
            default: 'china'
        }
    },
    data() {
        return {
            dom: null,
            option: {}
        }
    },
    computed: {
        hheight() {
            let heightNum = 400
            if (this.height.indexOf('px') > -1) {
                heightNum = this.height.split('px')[0]
            }
            if (heightNum < 400) {
                return '400px'
            } else {
                return heightNum
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            // var data = [{
            //         name: "北京",
            //         value: 199
            //     }
            // ];
            var oridata = this.value.slice()
            var data = this.value.slice()

            var geoCoordMap = {};

            /*获取地图数据*/
            var mapFeatures = echarts.getMap(this.mapName).geoJson.features;
            mapFeatures.forEach(function (v) {
                // 地区名称
                // console.log(v)
                var name = v.properties.name;
                // 地区经纬度
                geoCoordMap[name] = v.properties.cp;
                let has = false
                for(let a of data){
                    if(a.name==name) has = true
                }
                if(!has){
                    data.push({
                        name,
                        value:0
                    })
                }

            });

            // console.log(data)
            var max = 480,
                min = 9; // todo 
            var maxSize4Pin = 100,
                minSize4Pin = 20;

            var convertData = function (data) {
                var res = [];
                for (var i = 0; i < data.length; i++) {
                    var geoCoord = geoCoordMap[data[i].name];
                    if (geoCoord) {
                        res.push({
                            name: data[i].name,
                            value: geoCoord.concat(data[i].value)
                        });
                    }
                }
                return res;
            };

            this.option = {
                // backgroundColor: {
                //     type: 'linear',
                //     x: 0,
                //     y: 0,
                //     x2: 1,
                //     y2: 1,
                //     colorStops: [{
                //         offset: 0,
                //         color: '#fff' // 0% 处的颜色
                //     }, {
                //         offset: 1,
                //         color: '#fff' // 100% 处的颜色
                //     }],
                //     globalCoord: false // 缺省为 false
                // },
                title: {
                    top: 20,
                    text: this.mapName,
                    subtext: '',
                    x: 'center',
                    textStyle: {
                        color: '#ccc'
                    }
                },

                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        if (typeof (params.value)[2] == "undefined") {
                            return oridata.length<=0?params.name:params.name + ' : ' + params.value;
                        } else {
                            return oridata.length<=0?params.name:params.name + ' : ' + params.value[2];
                        }
                    }
                },
                /*   legend: {
                       orient: 'vertical',
                       y: 'bottom',
                       x: 'right',
                        data:['pm2.5'],
                       textStyle: {
                           color: '#fff'
                       }
                   },*/
                legend: {
                    orient: 'vertical',
                    y: 'bottom',
                    x: 'right',
                    data: ['pm2.5'],
                    textStyle: {
                        color: '#fff'
                    }
                },
                visualMap: {
                    show: false,
                    min: 0,
                    max: 500,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'], // 文本，默认为数值文本
                    calculable: true,
                    seriesIndex: [1],
                    inRange: {

                    }
                },
                geo: {
                    map: this.mapName,
                    show: true,
                    roam: true,
                    label: {
                        normal: {
                            show: false
                        },
                        emphasis: {
                            show: false,
                        }
                    },
                    itemStyle: {
                        normal: {
                            areaColor: oridata.length<=0?'#fff':'#3a7fd5',
                            borderColor: '#0a53e9', //线
                            shadowColor: '#092f8f', //外发光
                            shadowBlur: 20
                        },
                        emphasis: {
                            areaColor: oridata.length<=0?'#fff':'#0a2dae', //悬浮区背景
                        }
                    }
                },
                series: [{

                        symbolSize: 0,
                        label: {
                            normal: {
                                formatter: '{b}',
                                position: 'right',
                                show: false
                            },
                            emphasis: {
                                show: false
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#fff'
                            }
                        },
                        name: 'light',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        data: convertData(data),

                    },
                    {
                        type: 'map',
                        map: 'china',
                        geoIndex: 0,
                        aspectScale: 0.75, //长宽比
                        showLegendSymbol: false, // 存在legend时显示
                        label: {
                            normal: {
                                show: false
                            },
                            emphasis: {
                                show: false,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        },
                        roam: true,
                        itemStyle: {
                            normal: {
                                areaColor: '#031525',
                                borderColor: '#FFFFFF',
                            },
                            emphasis: {
                                areaColor: '#2B91B7'
                            }
                        },
                        animation: false,
                        data: data
                    },
                    {
                        name: 'Top 5',
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        symbol: 'pin',
                        symbolSize: [50, 50],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 9,
                                },
                                formatter(value) {
                                    return value.data.value[2]
                                }
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '#D8BC37', //标志颜色
                            }
                        },
                        data: convertData(oridata),
                        showEffectOn: 'render',
                        rippleEffect: {
                            brushType: 'stroke'
                        },
                        hoverAnimation: true,
                        zlevel: 1
                    },

                ]
            };
            this.$refs.base.init()
        }
    },
    watch: {
        mapName(){
            this.init()
        },
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
