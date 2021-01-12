<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right" v-if="reflash">
            <NumberUp :startVal="startVal" :endVal="endVal" :color="color" :decimals="decimals" :countSize="countSize" :countWeight="countWeight">
            </NumberUp>
            <!-- <NumberUd :endVal="100" :countSize="50" :size="30" color="green" title="title" rightText="rightText"/> -->
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    NumberUp,NumberUd
} from '@/components/index';
import {numberUpData} from '../devTool/defaultData/index'
export default {
    name: 'numberUpExample',
    components: {
        exampleLout,
        NumberUp,
        NumberUd
    },
    data() {
        return {
            startVal: 0,
            endVal: 100,
            color:'#ddd',
            decimals: 2,
            countSize: 50,
            countWeight: 700,
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${numberUpData.data}\n return data})()`)
        this.startVal = obj.startVal
        this.endVal = obj.endVal
        this.color = obj.color
        this.decimals = obj.decimals
        this.countSize = obj.countSize
        this.countWeight = obj.countWeight
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:numberUpData.template,
            dataString:numberUpData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.startVal = obj.startVal
                this.endVal = obj.endVal
                this.color = obj.color
                this.decimals = obj.decimals
                this.countSize = obj.countSize
                this.countWeight = obj.countWeight
            },100)
        }
    },
}
</script>
