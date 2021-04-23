<template>
<div style="padding:0 5px">
    <div v-for="(item,index) in data" :key="index">
        <p @dragstart="setText($event,item.title)" :draggable="true" class="treeItem tree1" :class="{'treeChecked':checkedKey==index}" @click="item.expand=!item.expand;checkedKey=index;item.isGet?'':getListByProject(item)">
            <span style="margin-right:5px;" :class="{'ivu-tree-arrow-open':item.expand}" class="ivu-tree-arrow">
                <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
            </span>
            <span style="display: inline-block;
                                    max-width: calc(100% - 30px);
                                    height: 18px;
                                    vertical-align: middle;
                                    overflow: hidden;white-space: nowrap;" :title="item.title">{{item.title}}</span>
        </p>
        <template v-if="(item.children&&item.children.length>0)&&item.expand">
            <div v-for="(item2,index2) in item.children" :key="index+'-'+index2">
                <p @dragstart="setText($event,item2.title)" :draggable="true" @click="item2.expand=!item2.expand;checkedKey=index+'-'+index2;item2.isGet?'':getKu(item2)" :class="{'treeChecked':checkedKey==index+'-'+index2}" class="treeItem tree2">
                    <span style="margin-right:5px;" :class="{'ivu-tree-arrow-open':item2.expand}" class="ivu-tree-arrow">
                        <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                    </span>
                    <span style="display: inline-block;
                                    max-width: calc(100% - 30px);
                                    height: 18px;
                                    vertical-align: middle;
                                    overflow: hidden;white-space: nowrap;" :title="item2.title">{{item2.title}}</span>
                </p>
                <template v-if="(item2.children&&item2.children.length>0)&&item2.expand">
                    <div v-for="(item3,index3) in item2.children" :key="index+'-'+index2+'-'+index3">
                        <p @dragstart="setText($event,item3.title)" :draggable="true" @click="item3.expand=!item3.expand;checkedKey=index+'-'+index2+'-'+index3;item3.isGet?'':getSchema(item3)" :class="{'treeChecked':checkedKey==index+'-'+index2+'-'+index3}" class="treeItem tree3">
                            <span style="margin-right:5px;" :class="{'ivu-tree-arrow-open':item3.expand}" class="ivu-tree-arrow">
                                <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                            </span>
                            <Icon type="logo-buffer" />
                            <span style="display: inline-block;
                                max-width: calc(100% - 30px);
                                height: 18px;
                                vertical-align: middle;
                                overflow: hidden;white-space: nowrap;" :title="item3.title">{{item3.title}}</span>
                        </p>
                        <template v-if="(item3.children&&item3.children.length>0)&&item3.expand">
                            <div v-for="(item4,index4) in item3.children" :key="index+'-'+index2+'-'+index3+'-'+index4">
                                <p @dragstart="setText($event,item4.title)" :draggable="true" @click="item4.expand=!item4.expand;checkedKey=index+'-'+index2+'-'+index3+'-'+index4;getTable(item4)" :class="{'treeChecked':checkedKey==index+'-'+index2+'-'+index3+'-'+index4}" class="treeItem tree4">
                                    <span style="margin-right:5px;" :class="{'ivu-tree-arrow-open':item4.expand}" class="ivu-tree-arrow">
                                        <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                                    </span>
                                    <Icon type="md-albums"/>
                                    <span style="display: inline-block;
                                    max-width: calc(100% - 30px);
                                    height: 18px;
                                    vertical-align: middle;
                                    overflow: hidden;white-space: nowrap;" :title="item4.title">{{item4.title}}</span>
                                </p>
                                <template v-if="(item4.children&&item4.children.length>0)&&item4.expand">
                                    <div v-for="(item5,index5) in item4.children" :key="index+'-'+index2+'-'+index3+'-'+index4+'-'+index5">
                                        <p @dragstart="setText($event,item4.title+'.'+item5.title)" :draggable="true" @click="checkedKey=index+'-'+index2+'-'+index3+'-'+index4+'-'+index5;outSql(item3,item4,item5)" class="tree5">
                                            
                                            <span :class="{'treeChecked':checkedKey==index+'-'+index2+'-'+index3+'-'+index4+'-'+index5}" class="treeItem" style="display: inline-block;
                                            height: 28px;
                                            padding:5px;
                                            vertical-align: middle;
                                            overflow: hidden;white-space: nowrap;" :title="item5.title"><Icon type="md-card" style="margin-right:5px;"/>{{item5.title}}</span>
                                        </p>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </div>
                </template>
            </div>
        </template>
    </div>
</div>
</template>

<script>
export default {
    props:['ipMenhu','ipWuhan'],
    data() {
        return {
            data:[],
            checkedKey: -1
        }
    },
    mounted(){
        this.getProject()
    },
    methods:{
        getProject(){
            this.$http.apiPost(this.ipMenhu+ '/admin/api/sys/project/list')
            .then(res=>{
                if(res.success){
                    for(let a of res.data.rows){
                        a.title = a.name
                        a.expand = false
                    }
                    this.data = res.data.rows
                }
            })
        },
        getListByProject(row){
            row.isGet = true
            this.$http.apiGet(this.ipMenhu+ '/resource/subsystem/configure/listByProject',{
                params:{
                    projectId:row.id
                }
            })
            .then(res=>{
                if(res.success){
                    for(let a of res.data.rows){
                        a.title = a.subsystemName
                        a.expand = false
                    }
                    this.$set(row,'children',res.data.rows)
                }
            })
        },
        getKu(row){
            row.isGet = true
            this.$http.apiGet(this.ipMenhu+'/resource/metadata/tree',{
                params:{
                    parentId:row.subsystemId
                }
            })
            .then(res=>{
                if(res.success){
                    for(let a of res.data.rows){
                        a.expand = false
                    }
                    this.$set(row,'children',res.data.rows)
                }
            })
        },
        getSchema(row){
            row.isGet = true
            this.$http.apiGet(this.ipMenhu+row.treeUrl)
            .then(res=>{
                if(res.success){
                    for(let a of res.data.rows){
                        a.expand = false
                    }
                    this.$set(row,'children',res.data.rows)
                }
            })
        },
        getTable(row){
            row.isGet = true
            this.$http.apiGet(this.ipMenhu+row.treeUrl)
            .then(res=>{
                if(res.success){
                    for(let a of res.data.rows){
                        a.expand = false
                    }
                    this.$set(row,'children',res.data.rows)
                }
            })
        },
        setText(e,text){
            e.dataTransfer.setData("Text",text);
        },
        outSql(item3,item4,item5){
            let tableId = item5.id
            let sql = 'select * from '+item4.title+'.'+item5.title
            let datasourceId = item3.id
            this.$emit('outSql',datasourceId,sql,{
                id:tableId,
                name:item5.title,
                label:item5.title,
                schema:item4.title,
                dataSourceId:datasourceId,
                dataSourceName:item3.title
            })
        }
    }
}
</script>

<style scoped>
.treeItem {
    padding: 5px 0;
    cursor: pointer;
}
.treeItem:hover{
    background:#b3aee6;
    color:#fff;
}
.treeChecked{
    background:#938DD3;
    color:#fff;
}
.treeChecked:hover{
    background:#938DD3;
    color:#fff;
}

.tree1 {
    padding-left: 0;
}

.tree2 {
    padding-left: 10px;
}

.tree3 {
    padding-left: 15px;
}
.tree4 {
    padding-left: 20px;
}
.tree5 {
    padding-left: 40px;
}
</style>
