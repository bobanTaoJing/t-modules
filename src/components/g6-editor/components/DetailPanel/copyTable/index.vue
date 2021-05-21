<template>
<div>
    <Modal title="批量导入字段" :footer-hide="true" v-model='close' :width='600' :styles="{top: '20px'}">
        <Row>
            <i-col :span="12">
                <div @click="checkedType=1" :style="checkedType==1?'background:#7979c3;color:#fff':''" style="text-align:center;padding:5px 0;background:#ddd">从元数据中选择</div>
            </i-col>
            <i-col :span="12">
                <div @click="checkedType=2" :style="checkedType==2?'background:#7979c3;color:#fff':''" style="text-align:center;padding:5px 0;background:#ddd">从其他节点选择</div>
            </i-col>
        </Row>
        <template v-if="close">
            <step0 :data="data" :projectId="projectId" :loading="loading" v-show="checkedType==1" @output="output" ref="step0"></step0>
            <step1 v-show="checkedType==2" :data="g6Data" @output="output"></step1>
        </template>
    </Modal>
    <Modal title="导入失败明细" :footer-hide="true" v-model='close2' :width='500' :styles="{top: '20px'}">
        <p style="margin-left:30px;font-size:14px">失败条数：<span style="color:red;">{{errorData.length}}</span></p>
        <div v-for="(item,index) in errorData" :key="index">
            <p style="width:30px;float:left">{{index+1}}. </p>
            <p style="width:calc(100% - 30px);float:left">
                <span>字段名称：<span style="color: rgb(20, 136, 20);font-size:14px">{{item.label}}</span></span><br>
                <span>错误日志：<span style="color:#e03838;font-size:14px">{{item.value}}</span></span>
            </p>
            <div style="clear:both"></div>
        </div>
    </Modal>
</div>
</template>

<script>
import step0 from './step0'
import step1 from './step1'
export default {
    props:['projectId','ip','headers'],
    data(){
        return{
            data:{},
            close:false,
            close2:false,
            count:0,
            errorCount:0,
            errorData:[],
            loading:false,
            checkedType:1,
            g6Data:null
        }
    },

    methods:{
        inCome(obj){
            console.log(obj)
            this.data = obj.data
            this.g6Data =obj.g6Data
            console.log(this.g6Data)
                this.close = true
             this.$nextTick(()=>{
                 this.$refs.step0.inCome(this.data)
             })
        },
        output(selection,type){
            console.log(selection)
            this.count = selection.length
            this.$emit('output',selection,type)
        },
        createProperty(obj){
            this.$http.apiPost(this.ip+'/resource/metadata/basic/property/create',obj,{
                headers:this.headers
            })
                .then(res=>{
                    this.count--
                    if(!res.success){
                        this.errorCount++
                        this.errorData.push({label:obj.name,value:res.message})
                    }
                    if(this.count==0){
                        this.loading = false
                        if(this.errorCount>0){
                            this.close2= true
                        }else{
                            this.$Message.success('导入成功!')
                        }
                    }
                })
                .catch((error)=>{
                    this.count--
                     this.errorCount++
                     this.errorData.push({label:obj.name,value:error})
                     if(this.count==0){
                         this.loading = false
                        if(this.errorCount>0){
                            this.close2= true
                        }else{
                            this.$Message.success('导入成功!')
                        }
                    }
                })
        }
    },

    components: {
        step0,step1
    }
}
</script>

<style scoped>
.autocreate-foot {
    text-align: center;
}
</style>
