<style>
.project_box{
    padding:5px 10px;
    position: relative;
    height:calc(100% - 50px);
    overflow:auto;
}
    .project_box .project{
               height: 30px;
    line-height: 30px;
    background: #c0c8de;
    padding: 0 10px;
    color: #2f6992;
    margin: 5px 0;
    border-radius: 5px;
    cursor: pointer;
    overflow: hidden;
    }
    .project_box .project:hover{
            background: #3b5899;
        color: #fff;
        box-shadow: 1px 1px 1px 1px #d0cfb0;
    }
</style>
<template>
    <div class="project">
        <Row>
            <i-col :span="12">
                <h4 style="margin-bottom:5px;">
                    <span>项目</span>
                    <Select v-model="projectId" style="width:calc(100% - 50px)">
                        <Option v-for="item in projectData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </h4>
            </i-col>
            <i-col :span="12">
                <h4 style="margin-bottom:5px;">
                    <span>目录</span>
                    <Select v-model="fenleiId" style="width:calc(100% - 50px)">
                        <Option v-for="item in fenleiData" :value="item.id" :key="item.id">{{ item.name }}</Option>
                    </Select>
                </h4>
            </i-col>
        </Row>
    </div>
</template>
<script>
export default {
    data(){
        return{
            projectData:[],
            projectName:'',
            loading:false,
            projectId:'',
            fenleiData:[],
            fenleiId:''
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            this.getProject()
        },
        getProject(){
            this.$http.apiPost('/admin/api/sys/project/list',{sortField:'id',sortOrder:'asc'})
                .then(res=>{
                    if(res.success){
                        this.projectData = res.data.rows
                        if(this.projectData.length>0){
                            this.projectId = this.projectData[0].id
                        }
                    }else{
                        this.$Message.error(res.message)
                    }
                })
        },
        // 获取目录
        getConfigure(){
            this.fenleiData = []
            this.loading = true
            this.$http.get('/resource/subsystem/configure/listByProject',{
                params:{
                    projectId:this.projectId
                }
            })
            .then(res=>{
                this.loading = false
                if(res.data.success){
                    this.fenleiData = res.data.data.rows
                    for(let a of this.fenleiData){
                            a.id = a.subsystemId
                            a.name = a.subsystemName
                        }
                        this.$nextTick(()=>{
                            if(this.fenleiData.length>0){
                                    this.fenleiId = this.fenleiData[0].subsystemId
                                }else{
                                    this.fenleiId = ''
                                }
                        })
                }else{
                    this.$Message.error(res.data.message)
                }
            })
            .finally(()=>{
                    this.loading = false
                })
        },
    },
    watch:{
        projectId(){
            this.getConfigure()
        },
        fenleiId(){
            let item = {}
            this.$nextTick(()=>{
                for(let a of this.fenleiData){
                    if(a.id==this.fenleiId){
                        item = a
                    }
                }
                this.$emit('output',item)
            })
        }
    }
}
</script>