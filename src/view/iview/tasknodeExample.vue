<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <vsNode v-if="reflash" ref="vsnode" :sourceTable="sourceTable" :targetTable="targetTable" :lines="lines"></vsNode>
            <i-button @click="save">保存</i-button>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import vsNode from '@/components/tasknode/vueTaskNode/index';
import {vsNodeData} from '../devTool/defaultData/index'
export default {
    name: 'tasknodeExample',
    components: {
        exampleLout,
        vsNode
    },
    data() {
        return {
            sourceTable:{
                columns:[{
                        name:'源表字段',
                        key:'name',
                        width:120,
                    },{
                        name:'类型',
                        key:'type',
                        width:80
                    }
                ],
                data:[
                    {name:'uid',type:'BIGINT'},
                    {name:'uname',type:'STRING'},
                    {name:'upass',type:'STRING'},
                    {name:'width',type:'STRING'},
                    {name:'height',type:'STRING'},
                ]
            },
            targetTable:{
                columns:[{
                        name:'目标表字段',
                        key:'name',
                        width:120,
                    },{
                        name:'类型',
                        key:'type',
                        width:80
                    }
                ],
                data:[
                    {name:'uid',type:'BIGINT'},
                    {name:'pid',type:'STRING'},
                    {name:'upass',type:'STRING'},
                    {name:'adre',type:'STRING'},
                    {name:'uname',type:'STRING'},
                ]
            },
            lines:[],
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${vsNodeData.data}\n return data})()`)
        this.sourceTable = obj.sourceTable
        this.targetTable = obj.targetTable
        this.lines = obj.lines
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:vsNodeData.template,
            dataString:vsNodeData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.sourceTable = obj.sourceTable
                this.targetTable = obj.targetTable
                this.lines = obj.lines
            },100)
        },
        save(){
            this.$refs.vsnode.submit(params=>{
                console.log(params)
            })
        }
    },
}
</script>
