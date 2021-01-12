<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <CrudView v-if="reflash" ref='crudView' :tableOptions='tableOptions'>
                <!-- 数据源连接 -->
                <template slot="toolbar">
                    <i-button ghost type='primary' shape="circle">自定义按钮</i-button>
                </template>
            </CrudView>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    CrudView
} from '@/components/index';
import {crudViewData} from '../devTool/defaultData/index'
export default {
    name: 'crudViewExample',
    components: {
        exampleLout,
        CrudView
    },
    data() {
        return {
            tableOptions: {},
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${crudViewData.data}\n return data})()`)
        this.tableOptions = obj.tableOptions
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:crudViewData.template,
            dataString:crudViewData.data
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
