<style>
    .chart_card .ivu-card-body{
        padding:0 !important;
    }
</style>
<template>
<Card class="chart_card" :bordered='false' :dis-hover="disHover" style="box-sizing:border-box;">
    <div>
        <!-- <div class="chart-title" v-if="text">{{text}}</div> -->
        <div :style="'height:'+hheight" style="position:relative">
            <Spin size="large" fix v-if="loading"></Spin>
            <div ref="dom" :style="'height:'+hheight">
        </div>
        </div>
        <!-- <slot name="novalue" v-if="noValue"></slot> -->
    </div>
</Card>
</template>

<script>
import echarts from 'echarts/lib/echarts'

import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/pie'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/tooltip'
// import tdTheme from './theme.json'
import {
    on,
    off,
    baseOption
} from './tools'
// echarts.registerTheme('tdTheme', tdTheme)

export default {
    name: 'baseChart',
    props: {
        option: {
            type: Object,
            default: function () {
                return {}
            }
        },
        height: {
            type: [String, Number],
            default: '400px'
        },
        text: {
            type: String,
            default: null
        },
        disHover: {
            type: Boolean,
            default: false
        },
        noValue:{
            type:Boolean,
            default:false
        },
        loading:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            dom: null,
            fcolor1:'',
            fcolor2:''
        }
    },
    computed: {
        hheight() {
            if (typeof this.height!='number'&&this.height.indexOf('px') > -1)
                return this.height
            else return this.height + 'px'
        }
    },
    methods: {
        resize() {
            this.dom.resize()
        },
        init() {
            this.fcolor1 = this.getColor()[0]
            this.fcolor2 = this.getColor()[1]
            this.$nextTick(() => {
                let option = Object.assign({},this.option)
                // option.grid ={
                //         left: '3%',
                //         right: '4%',
                //         bottom: 6,
                //         top:10,
                //         containLabel: true
                //     }
                // option.tooltip={
                //         trigger: 'axis',
                //         axisPointer: {
                //             type: 'cross',
                //             label: {
                //                 backgroundColor: '#6a7985'
                //             }
                //         }
                //     }
                this.dom = echarts.init(this.$refs.dom)
                this.dom.setOption(option)
                this.resize()
                off(window, 'resize', this.resize)
                on(window, 'resize', this.resize)
            })
        },
        getColor(color){
            let base = ['#FF6F91','#1F99C4','#9C4FF3','#F58750','#FC718D','#1FACAE','#A7B623','#B5A646','#06ABA2','#06ABA2']
            let base2 = ['#FB7E77','#4ACAC7','#7769FD','#F9B52C','#FD7F74','#1FACAEe3','#A7B623e3','#B5A646e3','#06ABA2e3','#06ABA2e3']
            // let base = '5678956789defdef'//深色
            let index = parseInt(Math.random()*10)
            return [base[index],base2[index]]
        }
    },
    beforeDestroy() {
        off(window, 'resize', this.resize)
    }
}
</script>

