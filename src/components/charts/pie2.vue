<template>
    <Base ref="base" :text="text" :height="height" :disHover="disHover" :option="option" />
</template>

<script>
//饼图 两层
import Base from './Base'
export default {
    name: 'ChartPie2',
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
        disHover:{
            type:Boolean,
            default:false
        },
        showLegend:{
            type:Boolean,
            default:true
        },
        title:{
            type:String,
            default:null
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
            let that = this
            this.option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    show:false,
                    orient: 'vertical',
                    left: 10,
                    data: ['标签一', '标签二', '标签三', '数据源1', '数据源2', '数据源3', '数据源4', '数据源5', '数据源6', '数据源7','数据源8']
                },
                series: [
                    {
                        name: '数据源',
                        type: 'pie',
                        selectedMode: 'single',
                        radius: [0, '60%'],
                        left:'right',
                        label: {
                            position: 'inner'
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                            {value: 335, name: '标签一', selected: true},
                            {value: 679, name: '标签二'},
                            {value: 1548, name: '标签三'}
                        ]
                    },
                    {
                        name: '数据源',
                        type: 'pie',
                        radius: ['70%', '95%'],
                        left:'right',
                        label: {
                            show:false,
                            formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
                            backgroundColor: '#eee',
                            borderColor: '#aaa',
                            borderWidth: 1,
                            borderRadius: 4,
                            // shadowBlur:3,
                            // shadowOffsetX: 2,
                            // shadowOffsetY: 2,
                            // shadowColor: '#999',
                            // padding: [0, 7],
                            rich: {
                                a: {
                                    color: '#999',
                                    lineHeight: 22,
                                    align: 'center'
                                },
                                // abg: {
                                //     backgroundColor: '#333',
                                //     width: '100%',
                                //     align: 'right',
                                //     height: 22,
                                //     borderRadius: [4, 4, 0, 0]
                                // },
                                hr: {
                                    borderColor: '#aaa',
                                    width: '100%',
                                    borderWidth: 0.5,
                                    height: 0
                                },
                                b: {
                                    fontSize: 16,
                                    lineHeight: 33
                                },
                                per: {
                                    color: '#eee',
                                    backgroundColor: '#334455',
                                    padding: [2, 4],
                                    borderRadius: 2
                                }
                            }
                        },
                        data: [
                            {value: 335, name: '数据源1'},
                            {value: 310, name: '数据源2'},
                            {value: 234, name: '数据源3'},
                            {value: 135, name: '数据源4'},
                            {value: 1048, name: '数据源5'},
                            {value: 251, name: '数据源6'},
                            {value: 147, name: '数据源7'},
                            {value: 102, name: '数据源8'}
                        ]
                    }
                ]
            };
            this.$refs.base.init()
        }
    },
    watch:{
      value:{
        handler(){
          this.init()
        },
        deep:true
      }
    },
    components: {
        Base
    }
}
</script>
