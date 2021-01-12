<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <ChartLine v-if="reflash" ref='ChartLine' :loading="loading" :height="height"
                :value="value" :xData="xData" :text="text" :textColor="textColor" :bgColor="bgColor" :disHover="disHover">
            </ChartLine>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    ChartLine
} from '@/components/index';
import {chartLineData} from '../devTool/defaultData/index'
export default {
    name: 'ChartLineExample',
    components: {
        exampleLout,
        ChartLine
    },
    data() {
        return {
            text:'标题',
            loading: false,
            height:400,
            value:[],
            xData:[],
            textColor:'#000',
            bgColor:'#ddd',
            disHover:false,
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${chartLineData.data}\n return data})()`)
        this.text = obj.text
        this.loading =  obj.loading
        this.height = obj.height
        this.value = obj.value
        this.xData = obj.xData
        this.textColor = obj.textColor
        this.bgColor = obj.bgColor
        this.disHover = obj.disHover
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:chartLineData.template,
            dataString:chartLineData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.text = obj.text
                this.loading =  obj.loading
                this.height = obj.height
                this.value = obj.value
                this.xData = obj.xData
                this.textColor = obj.textColor
                this.bgColor = obj.bgColor
                this.disHover = obj.disHover
            },100)
        }
    },
}
</script>
