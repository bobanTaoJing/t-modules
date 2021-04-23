<template>
    <div style="margin-top:5px;">
        <div :style="'height:'+height+'px;'">
            <div style="width:200px;height:100%;float:left;">
                <h2 style="height:33px;line-height:33px">选择表</h2>
                <stree :ipMenhu="ipMenhu" :ipWuhan="ipWuhan" @outSql="outSql" style="width:200px;height:calc(100% - 33px);overflow:auto;border:1px solid rgb(249, 246, 247)"/>
            </div>
            <dataView ref="dataView" :ipMenhu="ipMenhu" :ipWuhan="ipWuhan" :runSelfSql.sync="runSelfSql" :sql="sql" :fheight="height" @outSql="outSql2" :checkedTable="checkedTable" style="width:calc(100% - 200px);;height:100%;float:left">
                <template slot="sqlView">
                    <sqlView ref="sqlView" :ipMenhu="ipMenhu" :ipWuhan="ipWuhan" :runSelfSql="runSelfSql" @outSql="outSql2" @outSelfSql="outSelfSql" @saveSql="saveSql" :checkedTable="checkedTable"/>

                </template>
            </dataView>
        </div>
    </div>
</template>
<script>
import stree from './stree'
import dataView from './dataView'
import sqlView from './sqlView'
import axios from '../../utils/http'
export default {
    name:'SqlConfig',
    props:['ipMenhu','ipWuhan','Authorization'],
    components:{stree,dataView,sqlView},
    data(){
        return{
            datasourceId:'',
            sql:'',
            checkedTable:'',
            height:(window.innerHeight - 80)>500?window.innerHeight - 80:500,
            runSelfSql:false
        }
    },
    created(){
        axios.defaults.headers['Authorization'] = this.Authorization
    },
    mounted(){
        window.addEventListener('resize',this.getHeight)
    },
    beforeDestroy(){
        window.removeEventListener('resize',this.getHeight)
    },
    methods:{
        getHeight(){
            this.height = (window.innerHeight - 80)>500?window.innerHeight - 80:500
        },
        outSql(datasourceId,sql,checkedTable){
            if(this.runSelfSql) return
            this.datasourceId = datasourceId
            this.sql = sql
            this.checkedTable = checkedTable
            this.$refs.dataView.init()
            this.$refs.dataView.queryData(datasourceId,sql,true)
            this.$refs.sqlView.$refs.dynamic1.setFormData({definition:sql})
        },
        outSql2(sql,reflash){
            if(this.runSelfSql) return
            this.sql = sql
            this.$refs.dataView.queryData(this.datasourceId,sql,reflash)
            this.$refs.sqlView.$refs.dynamic1.setFormData({definition:sql})
        },
        saveSql(){
            this.$emit('saveSql',this.datasourceId,this.sql)
        },
        outSelfSql(datasourceId,sql){
            this.$refs.dataView.queryData2(datasourceId,sql)
        }
    }
}
</script>