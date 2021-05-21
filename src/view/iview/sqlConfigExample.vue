<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <sqlConfig :ipMenhu="'http://data-platform-demo.bobandata.com'" :ipWuhan="'http://data-platform-demo.bobandata.com'" :Authorization="'7466a7a478fd89afdc79b13cf875500a'">
            </sqlConfig>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import sqlConfig from '@/components/sqlConfig/index';
import {sqlConfigData} from '../devTool/defaultData/index'
export default {
    name: 'sqlConfigExample',
    components: {
        exampleLout,
        sqlConfig
    },
    data() {
        return {
            tableOptions: {},
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${sqlConfigData.data}\n return data})()`)
        this.tableOptions = obj.tableOptions
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:sqlConfigData.template,
            dataString:sqlConfigData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.tableOptions = obj.tableOptions
            },100)
        }
    },
}
</script>
