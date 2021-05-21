<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <Flowchart v-if="reflash" :ip="data.ip" :headers="data.headers">
            </Flowchart>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import Flowchart from '@/components/rhpt/flowchart/newIndex';
import {flowchartData} from '../devTool/defaultData/index'
export default {
    name: 'flowchartExample',
    components: {
        exampleLout,
        Flowchart
    },
    data() {
        return {
            data: {},
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${flowchartData.data}\n return data})()`)
        this.data = obj
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:flowchartData.template,
            dataString:flowchartData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.data = obj
                this.reflash = true
            },100)
        }
    },
}
</script>
