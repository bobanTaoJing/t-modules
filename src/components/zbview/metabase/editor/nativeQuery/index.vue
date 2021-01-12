<template>
<div style="height:100%;padding:5px 5px 0;border:1px solid rgb(221, 221, 221)">
    <AceEditor
        v-model="allSql"
        height="100%"
        :showTimeRun="false"
        :showAction="true"
        :showMenu="true"
        :hiddenSelfAction="true"
        @runResult="RunResult"
        :language="'mysql'">
        <template slot="action">
            <label>
                <span style="font-size:12px;font-weight:500">选择数据源：</span>
                <Select v-model="datasourceId" @on-change="$emit('changeDatasourceId')" size="small" style="width:100px">
                    <Option v-for="item in baseData" :value="item.id" :key="item.id">
                        <Icon type="logo-buffer"/>{{ item.name }}</Option>
                </Select>
            </label>
            <Icon @click="RunResult" type="md-arrow-dropright-circle" title="执行SQL"/>
            <Icon type="md-albums" @click="$emit('update:showGl',!showGl)" title="了解数据集"/>
        </template>    
    </AceEditor>
</div>
</template>

<script>
import AceEditor from '@/components/editor/AceEditor.vue'
export default {
    props:{
        baseData:{
            type:Array,
            default:()=>{
                return[]
            }
        },
        showGl:{
            type:Boolean
        },
        showSt:{
            type:Boolean
        }
    },
    components: {
        AceEditor
    },
    data() {
        return {
            allSql:'',
            sql: '',
            datasourceId:''
        }
    },
    methods:{
        RunResult(value){
            if(!this.datasourceId){
                this.$Message.warning('请选择数据源！')
                return
            }
            if(value)
                this.sql = value
            else
                this.sql = this.allSql
            this.$emit('getObject',false,2)
        }
    }
}
</script>
