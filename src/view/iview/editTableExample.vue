<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <EditTable :columns="columns" :deleteTip="deleteTip" :height="height" ref="editTable" style="padding:0;width:100%" :disabled="disabled" :showSerial="showSerial" :showTopd="showTopd">
                <template slot="button">
                    <Button style="margin-left:10px;">自定义按钮</Button>
                </template>
            </EditTable>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    EditTable
} from '@/components/index';
import {editTableData} from '../devTool/defaultData/index'
export default {
    name: 'editTableExample',
    components: {
        exampleLout,
        EditTable
    },
    data() {
        return {
            columns:[{
                    title: '类型',
                    key: 'type',
                    type: 'select',
                    // width: 100,
                    value: 'string',
                    data: [{
                            label: 'string',
                            value: 'string'
                        },
                        {
                            label: 'number',
                            value: 'number'
                        },
                        {
                            label: 'array',
                            value: 'array'
                        },
                        {
                            label: 'object',
                            value: 'object'
                        },
                        {
                            label: 'boolean',
                            value: 'boolean'
                        },
                        {
                            label: 'integer',
                            value: 'integer'
                        }
                    ]
                },
                {
                    title: '参数名称',
                    key: 'name',
                    required: true,
                    // width: 100,
                    value: '',
                    type: 'input',
                }
            ],
            deleteTip:false,
            height:400,
            disabled:false,
            showSerial:false,
            showTopd:false,
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${editTableData.data}\n return data})()`)
        this.columns = obj.columns
        this.deleteTip = obj.deleteTip
        this.height = obj.height,
        this.disabled = obj.disabled
        this.showSerial = obj.showSerial
        this.showTopd = obj.showTopd
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:editTableData.template,
            dataString:editTableData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.columns = obj.columns
                this.deleteTip = obj.deleteTip
                this.height = obj.height,
                this.disabled = obj.disabled
                this.showSerial = obj.showSerial
                this.showTopd = obj.showTopd
            },100)
        }
    },
}
</script>
