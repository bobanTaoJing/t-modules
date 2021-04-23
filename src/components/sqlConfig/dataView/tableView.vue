<template>
<div>
    <h3>按血缘关系关联表<Button @click="expand" :disabled="enodes.length<=0" :title="enodes.length<=0?'没有更多关联了':''">向外延申一层</Button></h3>
    <div ref="dom" :style="'width:1000px;height:'+height+'px'"></div>
    <p style="text-align:right">
        <span style="color:#a0a640">请选择图中表节点,关联字段会按血缘关系中定义的</span>
        <span>包含起始表，共选中<span>{{checkedNodes.length}}</span>张表</span>
        <Button @click="outSql">确定</Button>
    </p>
</div>
</template>

<script>
import echarts from 'echarts'
export default {
    props: ['checkedTable','close','ipMenhu','ipWuhan'],
    data() {
        return {
            height: window.innerHeight - 200,
            data: [],
            links: [],
            mychart: null,
            enodes:[],
            checkedNodes:[],
            isGetChart:false,
            info:''
        }
    },
    mounted() {
    },
    methods: {
        getChart() {
            let option = {
                title: {
                    text: ''
                },
                tooltip: {},
                animationDurationUpdate: 1500,
                animationEasingUpdate: 'quinticInOut',
                label: {
                    normal: {
                        show: true,
                        textStyle: {
                            fontSize: 12
                        },
                    }
                },
                legend: {
                    x: "center",
                    show: false,
                    data: ["1", "2", '3']
                },
                series: [

                    {
                        type: 'graph',
                        layout: 'force',
                        symbolSize: 45,
                        focusNodeAdjacency: false,
                        roam: true,
                        categories: [{
                            name: '1',
                            itemStyle: {
                                normal: {
                                    color: "#009800",
                                }
                            }
                        }, {
                            name: '2',
                            itemStyle: {
                                normal: {
                                    color: "#4592FF",
                                }
                            }
                        }, {
                            name: '3',
                            itemStyle: {
                                normal: {
                                    color: "#3592F",
                                }
                            }
                        }],
                        label: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 12
                                },
                            }
                        },
                        force: {
                            repulsion: 8000
                        },
                        tooltip: {
                            formatter: function (node) { // 区分连线和节点，节点上额外显示其他数字
                                if (!node.value) {
                                    return `<p>数据源：${node.data.dataSource}</p><p>模式：${node.data.schema}</p><p>表名：${node.data.name}</p>`;
                                } else {
                                    return `<span>${node.data.sourceName}<span>.${node.data.scolumns}</span></span><span> -> </span><span>${node.data.targetName}<span>.${node.data.ecolumns}</span></span>`
                                }
                            },
                        },
                        edgeSymbolSize: [4, 50],
                        edgeLabel: {
                            normal: {
                                show: true,
                                textStyle: {
                                    fontSize: 10
                                },
                                formatter: "{c}"
                            }
                        },
                        data: [],
                        links: [],
                        lineStyle: {
                            normal: {
                                opacity: 0.9,
                                width: 1,
                                curveness: 0
                            }
                        }
                    }
                ]
            };
            this.mychart = echarts.init(this.$refs.dom)
            this.mychart.setOption(option)
            this.mychart.on('click', (params)=> {
                console.log(params);
                if(params.dataType=='node'){
                    this.checkNode(params.data)
                }
            })
        },
        getEdges(tableId) {
            this.$http.apiGet(this.ipWuhan + '/dataAssetsService/dataRelation/getEdges?tableId=' + tableId)
                .then(res => {
                    if (res.code == 1) {
                        let nodes = res.data[0].nodes
                        let edges = res.data[0].edges
                        let name = ''
                        for (let a of nodes) {
                            let has = false
                            for (let b of this.data) {
                                if (a.id == b.id) {
                                    has = true
                                }
                            }
                            if (!has) {
                                a.name = a.label
                                a.blabel = a.label
                                a.label = a.schema+'.'+a.label
                                a.symbolSize = 50
                                a.itemStyle = {
                                    color:'#6F90A5'
                                    // color:'#2F4554'
                                }
                                if (a.id == this.checkedTable.id) {
                                    a.symbolSize = 80
                                    a.itemStyle = {
                                        color:'#2F4554'
                                    }
                                    name = a.name
                                }else{
                                    this.enodes.push(a)
                                }
                                a.category = 1
                                a.draggable = false
                                this.data.push(a)
                            }
                        }
                        for (let a of edges) {
                            let has = false
                            for (let b of this.links) {
                                if (b.bsource == a.source && b.btarget == a.target) {
                                    has = true
                                }
                            }
                            if (!has) {
                                a.value = a.scolumns + '-' + a.ecolumns
                                for (let i = 0; i < this.data.length; i++) {
                                    if (this.data[i].id == a.source) {
                                        a.bsource = a.source
                                        a.source = i
                                        a.sourceName = this.data[i].name
                                    }
                                    if (this.data[i].id == a.target) {
                                        a.btarget = a.target
                                        a.target = i
                                        a.targetName = this.data[i].name
                                    }
                                }
                                this.links.push(a)
                            }
                        }
                        console.log('init')
                        this.mychart.setOption({
                            categories: [{
                                name,
                                itemStyle: {
                                    normal: {
                                        color: "#009800",
                                    }
                                }
                            }],
                            series: [{
                                data: this.data,
                                links: this.links
                            }]
                        })
                    }
                })
        },
        expand(){
            for(let a of this.enodes){
                this.getEdges(a.id)
            }
            this.enodes = []
        },
        checkNode(data){
            if(data.id == this.checkedTable.id) return
            if(data.dataSourceId!=this.checkedTable.dataSourceId){
                this.judgeNodeDatasouce(data)
            }else{
                let has = false
                for(let i=0;i< this.checkedNodes.length;i++){
                    if(this.checkedNodes[i].id == data.id){
                        this.checkedNodes.splice(i,1)
    
                        this.reflashData()
                        has = true
                        return
                    }
                }
                if(!has){
                    this.judgeNode(data,true)
                }
            }
        },
        //判断节点数据源是否一致
        judgeNodeDatasouce(data){
            if(!this.info){
                this.$http.apiPost(this.ipMenhu+'/resource/dataSource/configure/list',{
                    id:this.checkedTable.dataSourceId
                })
                .then(res=>{
                    if(res.success){
                        this.info = res.data.rows[0].info
                        this.$http.apiPost(this.ipMenhu+'/resource/dataSource/configure/list',{
                            id:data.dataSourceId
                        })
                        .then(res=>{
                            if(res.success){
                                if(this.info == res.data.rows[0].info){
                                    let has = false
                                    for(let i=0;i< this.checkedNodes.length;i++){
                                        if(this.checkedNodes[i].id == data.id){
                                            this.checkedNodes.splice(i,1)

                                            this.reflashData()
                                            has = true
                                            return
                                        }
                                    }
                                    if(!has){
                                        this.judgeNode(data,true)
                                    }
                                }else{
                                    this.$Message.warning('该表与源端表数据源不同')
                                }
                            }
                        })
                    }
                })
            }else{
                this.$http.apiPost(this.ipMenhu+'/resource/dataSource/configure/list',{
                            id:data.dataSourceId
                        })
                        .then(res=>{
                            if(res.success){
                                if(this.info == res.data.rows[0].info){
                                    let has = false
                                    for(let i=0;i< this.checkedNodes.length;i++){
                                        if(this.checkedNodes[i].id == data.id){
                                            this.checkedNodes.splice(i,1)

                                            this.reflashData()
                                            has = true
                                            return
                                        }
                                    }
                                    if(!has){
                                        this.judgeNode(data,true)
                                    }
                                }else{
                                    this.$Message.warning('该表与源端表数据源不同')
                                }
                            }
                        })
            }
        },
        judgeNode(data,reflash){
            let can = false
            for(let a of this.checkedNodes){
                for(let b of this.links){
                    if(
                        (b.bsource==a.id&&b.btarget==data.id)||
                        (b.btarget==a.id&&b.bsource==data.id)
                    ){
                        can = true
                        if(reflash){
                            this.checkedNodes.push(data)
                            for(let c of this.data){
                                if(c.id == data.id){
                                    this.$set(c,'itemStyle',{
                                        color:'#2F4554'
                                    })
                                    this.mychart.setOption({
                                        series: [{
                                            data: this.data,
                                        }]
                                    })
                                    return
                                }
                            }
                        }
                        return true
                    }
                }
            }
            if(!can){
                if(reflash){
                    for(let c of this.data){
                        if(c.id == data.id){
                            this.$set(c,'itemStyle',{
                                color:'#6F90A5'
                            })
                            
                            this.mychart.setOption({
                                series: [{
                                    data: this.data,
                                }]
                            })
                            this.$Message.warning('该表未与已选中的任何表关联，请重新选择')
                            return
                        }
                    }
                }
                return false
            }
        },
        reflashData(){
            let checkedNodes= this.checkedNodes.slice()
            let nodesId = []
            this.checkedNodes = []
            for(let a of checkedNodes){
                if(this.judgeNode(a)||a.id==this.checkedTable.id){
                    this.checkedNodes.push(a)
                    nodesId.push(a.id)
                }
            }
            for(let a of this.data){
                if(nodesId.indexOf(a.id)>-1||a.id==this.checkedTable.id){
                    this.$set(a,'itemStyle',{
                        color:'#2F4554'
                    })
                }else{
                    this.$set(a,'itemStyle',{
                        color:'#6F90A5'
                    })
                }
            }
            console.log(this.data)
            this.mychart.setOption({
                series: [{
                    data: this.data,
                }]
            })
        },
        getSql(){
            let params = [],names=''
            console.log(this.links)
            let links = []
            for(let a of this.links){
                if(a.scolumns.indexOf(',')>-1){
                    for(let i=0;i< a.scolumns.split(',').length;i++){
                        let ecolumns = a.ecolumns.split(','),b = a.scolumns.split(',')[i]
                        links.push({
                            ecolumns: ecolumns[i],
                            isSure: 0,
                            scolumns: b,
                            sourceName: a.sourceName,
                            targetName: a.targetName,
                            bsource: a.bsource,
                            btarget: a.btarget,
                        })
                    }
                }else{
                    links.push(a)
                }
            }
            for(let a of links){
                let name='',name2='',tableName='',tableName2='',count=0
                for(let b of this.checkedNodes){
                    if(a.bsource==b.id){
                        name = b.label+'.'+a.scolumns
                        tableName = b.label
                        count++
                    }
                    if(a.btarget==b.id){
                        name2 = b.label+'.'+a.ecolumns
                        tableName2 = b.label
                        count++
                    }
                }
                if(count>=2)
                    params.push({
                        name,name2,tableName,tableName2
                    })
            }
            let joinLabels = []
            for(let i=0;i< this.checkedNodes.length;i++){
                let a = this.checkedNodes[i]
                joinLabels.push(a.label)
                if(i==0){
                    names+=a.label
                }else{
                    names+='\n join '+a.label
                    let count = 0
                    for(let b of params){
                        if(!b.isAdd){
                            if(
                                (b.tableName==a.label&&joinLabels.indexOf(b.tableName2)>-1)
                                ||b.tableName2==a.label&&joinLabels.indexOf(b.tableName)>-1){
                                    if(count==0){
                                        names+= ` on ${b.name}=${b.name2}`
                                    }else{
                                        names+= ` and ${b.name}=${b.name2}`
                                    }
                                    b.isAdd = true
                                    count++
                            }
                        }
                    }
                }
            }
            console.log(names)
            console.log(params)
            let sql = 'select * from '+names
            // if(params.length>0) sql+=' where '
            // for(let i=0;i<params.length;i++){
            //     if(i==0){
            //         sql+=(params[i].name+'='+params[i].name2)
            //     }else{
            //         sql+=(' and '+params[i].name+'='+params[i].name2)
            //     }
            // }
            return sql
        },
        outSql(){
            let sql = this.getSql()
            this.$emit('outSql',sql,true)
            
        }
    },
    watch:{
        checkedTable:{
            handler(oldvalue,newvalue){
                console.log(oldvalue)
                this.data=[]
                this.links=[]
                this.enodes=[]
                let checkedTable = {
                    id:this.checkedTable.id,
                    name:this.checkedTable.name,
                    blabel:this.checkedTable.label,
                    label:this.checkedTable.schema+'.'+this.checkedTable.label,
                    schema:this.checkedTable.schema,
                    dataSourceId:this.checkedTable.dataSourceId,
                    dataSourceName:this.checkedTable.dataSourceName
                }
                this.checkedNodes = [checkedTable]
                if(this.mychart){
                    this.mychart.clear()
                    this.mychart.off('click')
                    this.mychart = null
                }
                this.getChart()
                this.getEdges(this.checkedTable.id)
            },
            deep:true
        },
    }
}
</script>
