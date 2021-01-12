<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <FormDynamic ref='formDynamic' style="padding:10px" :data="dynamic" :label-width="100">
                <template slot="append">
                </template>
            </FormDynamic>
            <p>
                <Button @click="purin">在控制台中打印表单数据</Button>
            </p>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    FormDynamic
} from '@/components/index';
import {formDynamicData} from '../devTool/defaultData/index'
export default {
    name: 'formDynamicExample',
    components: {
        exampleLout,
        FormDynamic
    },
    data() {
        return {
            tableOptions: {},
            reflash:true,
            dynamic:[
                [{
                    name: 'datasourceId',
                    type: 'select',
                    span: 24,
                    label: '数据源',
                    textField: 'title',
                    valField: 'id',
                    clearable: false,
                    data: [],
                    rules: {
                        required: true
                    }
                }]
            ]
        }
    },
    created() {
        let obj = eval(`(()=>{${formDynamicData.data}\n return data})()`)
        this.dynamic = obj.dynamic
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:formDynamicData.template,
            dataString:formDynamicData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.dynamic = obj.dynamic
            },100)
        },
        purin(){
            console.log(this.$refs.formDynamic.fromData)
        }
    },
}
</script>
