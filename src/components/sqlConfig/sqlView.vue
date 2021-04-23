<style>
.hidden-form-bottom{
        width: calc(100% - 100px);
    display: inline-block;
    vertical-align: middle;

}
    .hidden-form-bottom .ivu-form-item{
        margin-bottom: 0;
    }
</style>
<template>
<div>
    <Row :gutter="5">
        <i-col :span="24" v-show="!runSelfSql">
            <h2 style="height:33px">{{runSelfSql?'sql':('sql预览-(对应数据源:'+(checkedTable.dataSourceName?checkedTable.dataSourceName:'')+')')}}</h2>
                    <FormDynamic ref="dynamic1" :data="dynamic" :label-width="0">
                    <template slot="append">
                    </template>
                </FormDynamic>
                <!-- <p style="text-align:center"> -->
                    <!-- <Button @click="run">运行sql</Button> -->
                    <!-- <Button @click="save">将sql填入表单</Button> -->
                <!-- </p> -->
        </i-col>
        <i-col :span="24" v-show="runSelfSql">
            <h2>
                <span>自定义sql</span>
                <FormDynamic class="hidden-form-bottom" ref="dynamic3" :data="dynamic3" :label-width="50">
                    <template slot="append">
                    </template>
                </FormDynamic>
            </h2>
            <FormDynamic ref="dynamic2" :data="dynamic2" @formDataChange="formDataChange"  :label-width="0">
                <template slot="append">
                </template>
            </FormDynamic>
            <div v-if="queryData.length>0" style="white-space: nowrap;overflow: auto;">
                <span style="font-weight:bold">变量：</span>
                <div style="display:inline-block" v-for="(item,index) in queryData" :key="index">
                    <span>{{item.name}}:</span>
                    <Input v-model="item.value" size="small" style="width:50px"></Input>
                </div>
                <div style="clear:both"></div>
            </div>
            <p style="text-align:center">
                    <Button @click="run" >运行sql</Button>
                </p>
        </i-col>
    </Row>
    <Modal v-model="modal2" width="360">
        <p slot="header" style="text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>填写确认</span>
        </p>
        <div style="text-align:center">
            <p>将覆盖原表单中的sql.</p>
            <p>是否确定?</p>
        </div>
        <div slot="footer">
            <Button size="large" long @click="$emit('saveSql');modal2=false">确定</Button>
        </div>
    </Modal>
</div>
</template>

<script>
import {
    FormDynamic
} from '../index';
export default {
    props:['checkedTable','runSelfSql','ipMenhu','ipWuhan'],
    components:{FormDynamic},
    data() {
        return {
            dynamic: [
                [
                    {
                        name: 'definition',
                        type: 'codeEditor',
                        height: this.runSelfSql?'200px':'100px',
                        span: 24,
                        label: '',
                        readOnly:true

                    }
                ]
            ],
            dynamic2: [
                [
                    {
                        name: 'definition',
                        type: 'codeEditor',
                        height: this.runSelfSql?'200px':'100px',
                        span: 24,
                        label: ''

                    }
                ]
            ],
            dynamic3:[
                [
                    { //回显不能正常运行的解决办法：https://juejin.im/entry/5964a1c15188250d8b65ef5f
                            name: 'dbId',
                            type: 'select',
                            span: 12,
                            label: '数据源',
                            dataUrl: this.ipMenhu+'/dg/datasource/list',
                            textField: 'name',
                            valField: 'id',
                            multiple: false,
                            placeholder: '请选择'
                        },
                ]
            ],
            modal2:false,
            datasourceId:'',
            queryData:[]
        }
    },
    methods:{
        formDataChange(formData){
            this.queryData = this.eSql(formData.definition)
        },
        eSql(sql) {
            let reg = new RegExp("\#\{.+?\}", "gi")
                ,qeuryData = []
            if(sql){
                let querys = sql.match(reg),arr=[]
                if (querys) {
                    for (let a of querys) {
                        let name = a.replace(/\#/, '')
                        name = name.replace(/\{/, '')
                        name = name.replace(/\}/, '')
                        if(arr.indexOf(name)<=-1){
                            qeuryData.push({
                                name,
                                type: 'string'
                            })
                            arr.push(name)
                        }
                    }
                }
            }
            return qeuryData
        },
        run(){
            let datasourceId = this.$refs.dynamic3.fromData.dbId
            if(!datasourceId){
                this.$Message.warning('数据源不能为空')
                return
            }
            let sql = this.$refs.dynamic2.fromData.definition
            if(!sql){
                this.$Message.warning('sql不能为空')
                return
            }
            if(this.queryData.length>0){
                for(let a of this.queryData){
                    sql = sql.replace('#{'+a.name+'}',a.value)
                }
            }
            this.$emit('outSelfSql',datasourceId,sql)
        },
        save(){
            let sql = this.$refs.dynamic1.fromData.definition
            if(!sql){
                this.$Message.warning('sql不能为空')
                return
            }
            this.modal2 = true
        }
    }
}
</script>
