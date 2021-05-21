<style scoped>
    .title{
        background: #EBEEF2;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-size:16px !important;
    }
    .actionBox{
         position: absolute;
    bottom: 142px;
    height: 34px;
    line-height: 34px;
    width: 100%;
    text-align: center;
    box-shadow: 0px -1px 5px 0px #ddd;
    }
</style>
<template>
<div>
    <p class="title">{{checkedNode.name?checkedNode.name:'画布'}}</p>
    <FormDynamic ref="nodeDetail" :data="dynamic" :label-width="50"></FormDynamic>
    <p>schema</p>
    <EditTable :columns="editoTableColums" ref="editTable" style="padding:0;width:100%" :disabled="false" :showSerial="false" :showTopd="false"></EditTable>
    <p class="actionBox">
        <Button @click="$emit('setDetail')"  type="primary">保存</Button>
    </p>
</div>
</template>

<script>
import {
    FormDynamic
} from '../../components/';
import EditTable from '@/components/table/EditTable'
import {getForm} from '@/api/common'
export default {
    components: {
        FormDynamic,EditTable
    },
    data() {
        return {
            dynamic:[[]],
            editoTableColums: [{
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
            checkedNode:{}
        }
    },
    methods:{
        getForm(data){
            console.log(data)
            this.checkedNode = data
            let schema = (typeof data.schema)=='string'?JSON.parse(data.schema):[]
            this.$refs.editTable.tableData =schema
            getForm('stream-node_'+data.okey,window.IPS.ip)
            .then(res=>{
                if(res.success){
                    this.dynamic = [res.data.rows]
                    this.$nextTick(()=>{
                        let properties = data.properties?JSON.parse(data.properties):{}
                        this.$refs.nodeDetail.setFormData(properties)
                    })
                }
            })
        },
        submit(success){
            if(this.dynamic[0].length>0){
                this.$refs.nodeDetail.submit((params)=>{
                    console.log(params)
                    this.$refs['editTable'].submit(params2=>{
                        if(params2.length<=0&&this.checkedNode.type!='sink'){
                            this.$Message.warning('请正确填写schema!')
                        }else{
                            success(params,params2)
                        }
                    })
                    
                })
            }else{
                this.$refs['editTable'].submit(params2=>{
                        if(params2.length<=0&&this.checkedNode.type!='sink'){
                            this.$Message.warning('请正确填写schema!')
                        }else{
                            success({},params2)
                        }
                    })
            }
        },
    }
}
</script>
