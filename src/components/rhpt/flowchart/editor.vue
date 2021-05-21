<template>
    <div>
        <core ref="core" :nodes="nodes" :nodeTypes="nodeTypes" @showDetail="getForm" :drawerWidth="800">
            <template slot="actions">
                <Button @click="showSave">保存</Button>
            </template>
            <template slot="nodeDetail">
                <nodeDetail ref="nodeDetail" @setDetail="setDetail"></nodeDetail>
            </template>
        </core>
        <Modal
            v-model="modal1"
            :title="!isAdd?'修改流程':'保存流程'">
            <FormDynamic ref="savedata" :data="dynamic" :label-width="50"></FormDynamic>
            <p slot="footer">
                <Button @click="save">确定</Button>
            </p>
        </Modal>
    </div>
</template>
<script>
import core from './components/core'
import nodeDetail from './nodeDetail'
import {jobStreamCreate,jobStreamUpdate} from '../../api/flowchart'
import {
    FormDynamic
} from '../../components/';
export default {
    components:{core,nodeDetail,FormDynamic},
    props:{
        checked:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        isAdd:{
            type:Boolean,
            default:true
        },
        showEditor:{
            type:Boolean,
            default:false
        },
        ip:{

        }
    },
    data(){
        return{
            nodes:[],
            nodeTypes:[],
            checkedNode:{},
            modal1:false,
            dynamic:[
                [
                    {
                        type:'text',
                        label:'名称',
                        name:'name',
                        rules:{
                            required:true
                        }
                    }
                ]
            ]
        }
    },
    mounted(){
        this.getNodes()
    },
    methods:{
        getNodes(){
            this.$http.apiGet(this.ip+'/job/stream/node/detail/list')
            .then(res=>{
                if(res.success){
                    this.nodes = res.data.nodes
                    for(let a of this.nodes){
                        if(this.nodeTypes.indexOf(a.type)<=-1) this.nodeTypes.push(a.type)
                        a.name = a.key
                        a.okey = a.key
                        delete a.key
                        // a.size = [40, 40]
                        a.img = "static/assets/img/file.png"
                    }
                    this.$nextTick(()=>{
                        this.$refs.core.init()
                    })
                }
            })
        },
        getForm(data){
            console.log(data)
            this.checkedNode = data
            this.$refs.nodeDetail.getForm(data)
        },
        setDetail(){
            this.$refs.nodeDetail.submit((params,params2)=>{
                console.log(params)
                this.$refs.core.submit((value)=>{
                    let nodeDataArray = [],obj = JSON.parse(value)
                    for(let a of obj.nodeDataArray){
                        if(a.key == this.checkedNode.key){
                            a.properties = JSON.stringify(params)
                            a.schema = JSON.stringify(params2)
                        }
                    }
                    this.$refs.core.diagramJson = obj
                    this.$nextTick(()=>{
                        this.$refs.core.load()
                    })
                })
            })
        },
        showSave(){
            this.modal1=true
            this.$nextTick(()=>{
                this.$refs.savedata.setFormData(this.checked)
            })
        },
        save(){
            this.$refs.savedata.submit(params=>{
                console.log(params)
                this.$refs.core.submit((value)=>{
                    console.log(JSON.parse(value))
                    let obj =JSON.parse(value),nodes=[],edges=[]
                    for(let a of obj.nodeDataArray){
                        let b = {}
                        b.id = a.key
                        b.type = a.type
                        b.key = a.okey
                        b.properties = JSON.parse(a.properties)
                        b.schema = JSON.parse(a.schema)
                        b.nodeInfo = JSON.stringify(a)
                        nodes.push(b)
                    }
                    for(let a of obj.linkDataArray){
                        let b = {}
                        b.source = a.from
                        b.target = a.to
                        edges.push(b)
                    }
                    console.log(nodes)
                    console.log(edges)
                    let query = Object.assign({},params)
                    query.nodes = nodes
                    query.edges = edges
                    console.log(query)
                    if(!this.isAdd){
                        query.id =  this.checked.id
                        jobStreamUpdate(query)
                        .then(res=>{
                            if(res.success){
                                this.$Message.success('修改成功！')
                                this.modal1 = false
                                this.checked.name = query.name
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                    }
                    else
                    jobStreamCreate(query)
                    .then(res=>{
                            if(res.success){
                                this.$Message.success('添加成功！')
                                this.modal1 = false
                            }else{
                                this.$Message.error(res.message)
                            }
                        })
                })
            })
        },
        load(diagramJson){
            this.$refs.core.diagramJson = diagramJson
            this.$nextTick(()=>{
                this.$refs.core.load()
            })
        }
    }
}
</script>