<style>
    .streamLog .ivu-modal-body{
        padding:0;
    }
</style>
<template>
    <div>
        <Modal class="streamLog" :title="item.jobName+'：'+item.startTime+'-'+item.endTime" v-model='close' :width='width' :footer-hide="true" :styles="{top: '20px'}">
            <div v-if="showView" style="width:100%;height:calc(100vh - 100px);min-height:600px">
                <template>
                    <editor v-if="showEditor" style="height:100% !important" :ip="ip" :headers="headers" ref="editor" :jobItem="context" :checked="checked" :isAdd="false" :runTime="true"></editor>
                    <div style="clear:both"></div>
                </template>
            </div>
            <template v-else>
                <AceEditor ref="ErrorMsgjson" :height="height+'px'" :readOnly="true" :showAction="false" :showMenu="false" :codes="errorMsgjson" :language="'yaml'" />
            </template>
        </Modal>
    </div>
</template>
<script>
import editor from '../../../components/g6-editor/App.vue'
import AceEditor from '../../../components/editor/AceEditor.vue';
export default {
    components:{editor,AceEditor},
    props:{
        ip:{

        },
        headers:{}
    },
    data(){
        return{
            item:{},
            close:false,
            width:(window.innerWidth - 20)>1300?1300:window.innerWidth - 20,
            height:(window.innerHeight - 200)>600?600:window.innerHeight - 200,
            checked:{},
            showEditor:false,
            context:{},
            showView:true,
            errorMsgjson:''
        }
    },
    methods:{
        init(item){
            this.showEditor = false
            this.item = item
            this.context = JSON.parse(this.item.context)
            this.showView = true
            if(!this.context.jobId){
                this.errorMsgjson = this.item.errors[0]
                this.showView = false
            }
            let start = new Date(item.startTime).getTime()/1000
            let end = new Date().getTime()/1000
            if(item.endTime)
                end = new Date(item.endTime).getTime()/1000
            this.handleTime(start,end)
            this.close = true
            this.getStreamList()
        },
        handleTime(startb,endb){
            let lineXdata = []
            let lineXdata2 = []
            let lineValue = []
            let start = startb-60
            let end = ((endb+60 - start)>3600)?(startb+3660):(endb+60)
            let sstart = start
            for(;sstart<=end;sstart++){
                let date = new Date(sstart*1000)
                lineXdata.push(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds())
                lineXdata2.push(sstart)
                lineValue.push('')
            }
            this.context.lineXdata = lineXdata
            this.context.lineXdata2 = lineXdata2
            this.context.lineValue = lineValue
            this.context.start = start
            this.context.end = end
        },
        getStreamList(){
            this.$http.apiPost(this.ip+'/job/stream/node/config/list',{
                id:this.context.streamConfigId
            },{
                headers:this.headers
            })
            .then(res=>{
                if(res.success){
                    let row = res.data.rows[0]
                    this.checked = row
                    let nodeDataArray = [],linkDataArray=[]
                    for(let a of this.checked.nodes){
                        nodeDataArray.push(JSON.parse(a.nodeInfo))
                    }
                    for(let a of this.checked.edges){
                        linkDataArray.push({
                            from:a.source,
                            to:a.target
                        })
                    }
                    this.showEditor = true
                }
            })
        }
    }
}
</script>