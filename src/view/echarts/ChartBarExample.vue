<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <ChartBar v-if="reflash" ref='ChartBar' :loading="loading" :height="height"
                :value="value" :text="text" :textColor="textColor" :bgColor="bgColor" :disHover="disHover">
            </ChartBar>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    ChartBar
} from '@/components/index';
import {chartBarData} from '../devTool/defaultData/index'
export default {
    name: 'ChartBarExample',
    components: {
        exampleLout,
        ChartBar
    },
    data() {
        return {
            text:'标题',
            loading: false,
            height:400,
            value:{
                '周一':12,
                '周二':28,
                '周三':12,
                '周四':28,
                '周五':12,
                '周六':28,
                '周日':28,
            },
            textColor:'#000',
            bgColor:'#ddd',
            disHover:false,
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${chartBarData.data}\n return data})()`)
        this.text = obj.text
        this.loading =  obj.loading
        this.height = obj.height
        this.value = obj.value
        this.textColor = obj.textColor
        this.bgColor = obj.bgColor
        this.disHover = obj.disHover
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:chartBarData.template,
            dataString:chartBarData.data
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
                this.textColor = obj.textColor
                this.bgColor = obj.bgColor
                this.disHover = obj.disHover
            },100)
        }
    },
}
</script>
