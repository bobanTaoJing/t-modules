<style>
    .colseHover:hover{
        color:#eebaba;
    }
</style>
<template>
    <div class="dataView">
        <div style="height:33px;line-height:33px;" v-show="!runSelfSql">
            <!-- <span style="color:rgb(160, 166, 64)">仅展示前10条数据</span> -->
            <div style="margin:0 5px" @click="glButton(1)" class="guolvbutton" :class="{checked2:filterType==1&&showGl}">
            <svg class="Icon Icon-filter Icon-cxuQhR kTAgZA" style="    vertical-align: middle;" viewBox="0 0 32 32" width="14" height="14" fill="currentcolor"><path d="M3.556 4h24.888a3.556 3.556 0 1 1 0 7.111H3.556a3.556 3.556 0 1 1 0-7.111zm4 11.556h16.888a2.222 2.222 0 1 1 0 4.444H7.556a2.222 2.222 0 0 1 0-4.444zM12 24.444h8a2.222 2.222 0 0 1 0 4.445h-8a2.222 2.222 0 0 1 0-4.445z"></path></svg>
            过滤器</div>
        <div @click="glButton(2)" class="juhebutton" :class="{checked3:filterType==2&&showGl}">
            <svg class="Icon Icon-insight Icon-cxuQhR kTAgZA" style="    vertical-align: middle;" viewBox="0 0 32 32" width="14" height="14" fill="currentcolor"><path d="M12.6325203 19.3674797 0 16 12.6325203 12.6325203 16 0 19.3674797 12.6325203 32 16 19.3674797 19.3674797 16 32z"></path></svg>
            聚合</div>
            <p v-show="!runSelfSql" style="text-align:center;float:right">
                    <Button class="add" size="small" :disabled="!checkedTable.id||loading" @click="close=true" style="height: 30px;
                        vertical-align: top;
                        margin-right: 5px;
                        color: #28A2C5!important;
                        background: #28a2c542!important;">
                        <svg style="vertical-align: middle;" t="1606981751409" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2962" width="16" height="16"><path d="M523.73504 319.29344h-204.8c-16.896 0-30.72-13.824-30.72-30.72s13.824-30.72 30.72-30.72h204.8c16.896 0 30.72 13.824 30.72 30.72s-13.824 30.72-30.72 30.72zM605.65504 452.41344h-286.72c-16.896 0-30.72-13.824-30.72-30.72s13.824-30.72 30.72-30.72h286.72c16.896 0 30.72 13.824 30.72 30.72s-13.824 30.72-30.72 30.72z" fill="#FFFFFF" p-id="2963"></path><path d="M512 512m-389.12 0a389.12 389.12 0 1 0 778.24 0 389.12 389.12 0 1 0-778.24 0Z" fill="#3889FF" p-id="2964"></path><path d="M550.83008 365.01504a27.19744 27.19744 0 0 1 38.42048 0l69.7344 69.7344a27.19744 27.19744 0 0 1 0 38.42048l-58.75712 58.75712 34.1504 34.1504 58.75712-58.75712c29.42976-29.42976 29.41952-77.312 0-106.73152l-69.7344-69.7344c-29.41952-29.41952-77.30176-29.42976-106.73152 0l-58.75712 58.75712 34.1504 34.1504 58.76736-58.74688zM473.16992 658.98496a27.19744 27.19744 0 0 1-38.42048 0l-69.7344-69.7344a27.19744 27.19744 0 0 1 0-38.42048l58.75712-58.75712-34.1504-34.1504-58.75712 58.75712c-29.42976 29.42976-29.41952 77.312 0 106.73152l69.7344 69.7344c29.41952 29.41952 77.30176 29.42976 106.73152 0l58.75712-58.75712-34.1504-34.1504-58.76736 58.74688z" fill="#FFFFFF" p-id="2965"></path><path d="M528.32256 529.82784l11.38688-11.38688 34.1504-34.1504 23.99232-23.99232a24.2176 24.2176 0 0 0 0-34.1504 24.2176 24.2176 0 0 0-34.1504 0l-23.99232 23.99232-34.1504 34.1504-11.38688 11.38688 34.1504 34.1504zM494.17216 495.67744l-9.8816 9.8816-34.1504 34.1504-23.99232 23.99232a24.2176 24.2176 0 0 0 0 34.1504 24.2176 24.2176 0 0 0 34.1504 0l23.99232-23.99232 34.1504-34.1504 9.8816-9.8816-34.1504-34.1504z" fill="#FFFFFF" p-id="2966"></path></svg>
                        关联其它表</Button>
                </p>
            <Select v-model="limit" @on-change="queryData(datasourceId,sql)" size="small" style="width:200px;float:right;margin-right:10px">
                <Option v-for="item in [30,100,200,500,1000]" :value="item" :key="item">{{ item }}</Option>
            </Select>
            <Button @click="$emit('update:runSelfSql',true)" size="small">编写自定义sql</Button>
            <div style="clear:both"></div>
        </div>
        <div style="height:33px;line-height:33px;" v-show="runSelfSql">
            <Button @click="$emit('update:runSelfSql',false)" size="small">返回</Button>
            <Select v-model="limit2" @on-change="queryData2(datasourceId2,sql2)" size="small" style="width:200px;float:right;margin-right:10px">
                <Option v-for="item in [100,200,500,1000]" :value="item" :key="item">{{ item }}</Option>
            </Select>
        </div>
        
        <div style="height:calc(100% - 30px)">
            <div :style="showGl&&!runSelfSql?'width:calc(100% - 200px);float:left':''">
                 <transition name="fade" mode="out-in">
                    <div v-if="!runSelfSql" :style="'height:'+(fheight - 260)+'px;position:relative;background:rgb(247 247 247);'+(columns1.length<=0?'border:1px solid #ddd':'')">
                        <Spin size="large" fix v-if="loading"></Spin>
                        <div v-if="columns1.length<=0" style="position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
                        height: 30px;
                        width: 100px;">{{checkedTable.id?'暂无数据':runSelfSql?'请运行sql':'请选择表'}}</div>
                        <div style="height:40px;overflow:hidden;">
                            <div @scroll="tableSroll2" ref="tableHeader" style="white-space: nowrap;overflow-x:auto;overflow-y:hidden;font-weight:bold">
                                <div v-for="(item,index) in columns1" 
                                :style="'width:'+(newWidths[index]?newWidths[index]:item.minWidth)+'px;padding-left:3px; display:inline-block;position:relative;height:40px;line-height:40px;overflow:hidden;border-right:1px solid #6f707085;border-top:1px solid #6f707085;border-bottom:1px solid #6f707085;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index">
                                    <p>
                                        {{alias[item.title]?alias[item.title]:item.title}}
                                    </p>
                                    <div class="right" @mousedown="moveIndex=index;honmousedown($event)" @mouseup="hmouseup"></div>
                                </div>
                                <div v-if="(data1.length*30)>(fheight - 300)" style="display:inline-block;width:8px;height:40px;line-height:40px;;background:#E0E2E2;vertical-align: bottom;opacity:0"></div>
                            </div>
                        </div>
                        <div @scroll="tableSroll" class="tableBody" ref="tableBody" :style="'height:'+(fheight - 300)+'px;overflow:auto;'">
                            <div style="white-space: nowrap;" :style="data1&&data1.length>0?'':'opacity:0'">
                                <div v-for="(item,index) in columns1"
                                    :style="'width:'+(newWidths[index]?newWidths[index]:item.minWidth)+'px;display:inline-block;border-right:1px solid #6f707085;border-bottom:1px solid #6f707085;overflow:hidden;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index">
                                    <div v-for="(itemf,indexf) in data1" :key="indexf+'-'+index" style="height: 30px;border-bottom:1px solid #6f707085;">
                                        <p style="padding-left:3px;line-height: 30px;">{{itemf[item.key]}}</p>
                                    </div>
                                </div>
                            </div>
                            <!-- <div v-for="(itemf,indexf) in data1" :key="indexf" style="white-space: nowrap;height: 30px;">
                                <div v-for="(item,index) in columns1"
                                :style="'width:'+(newWidths[index]?newWidths[index]:item.minWidth)+'px;display:inline-block;height:30px;line-height:30px;border-right:1px solid #6f707085;border-bottom:1px solid #6f707085;overflow:hidden;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index+'-'+indexf">
                                    <p>{{itemf[item.key]}}</p>
                                </div>
                            </div> -->
                        </div>
                    </div>
                 </transition>
                <!-- 自定义sql -->
                <transition name="fade" mode="out-in">
                    <div v-if="runSelfSql">
                        <div :style="'height:'+(fheight - 260)+'px;position:relative;background:rgb(247 247 247);'+(columns3.length<=0?'border:1px solid #ddd':'')">
                            <Spin size="large" fix v-if="loading2"></Spin>
                            <div v-if="columns3.length<=0" style="position: absolute;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            margin: auto;
                            height: 30px;
                            width: 100px;">{{'暂无数据'}}</div>
                            <div style="height:40px;overflow:hidden;user-select: none;">
                                <div @scroll="tableSroll4" ref="tableHeader2" style="white-space: nowrap;overflow-x:auto;overflow-y:hidden;font-weight:bold">
                                    <div v-for="(item,index) in columns3" 
                                    :style="'width:'+(newWidths2[index]?newWidths2[index]:item.minWidth)+'px;padding-left:3px; display:inline-block;position:relative;height:40px;line-height:40px;overflow:hidden;border-right:1px solid #6f707085;border-top:1px solid #6f707085;border-bottom:1px solid #6f707085;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index">
                                        <p>
                                            {{item.title}}
                                        </p>
                                        <div class="right" @mousedown="moveIndex=index;honmousedown($event,2)" @mouseup="hmouseup"></div>
                                    </div>
                                    <div v-if="(data3.length*30)>(60)" style="display:inline-block;width:8px;height:40px;line-height:40px;;background:#E0E2E2;vertical-align: bottom;opacity:0"></div>
                                </div>
                            </div>
                            <div @scroll="tableSroll3" class="tableBody" ref="tableBody2" :style="'height:'+(fheight - 300)+'px;overflow:auto;'">
                                <div style="white-space: nowrap;" :style="data1&&data1.length>0?'':'opacity:0'">
                                    <div v-for="(item,index) in columns3"
                                        :style="'width:'+(newWidths2[index]?newWidths2[index]:item.minWidth)+'px;display:inline-block;border-right:1px solid #6f707085;border-bottom:1px solid #6f707085;overflow:hidden;'+(index==0?'border-left:1px solid #6f707085;':'')" :key="index">
                                        <div v-for="(itemf,indexf) in data3" :key="indexf+'-'+index" style="height: 30px;border-bottom:1px solid #6f707085;">
                                            <p style="padding-left:3px;line-height: 30px;">{{itemf[item.key]}}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <h3 style="height:30px;line-height:30px;text-align:center">自定义sql运行结果
                            <Select v-model="limit2" @on-change="queryData2(datasourceId2,sql2)" size="small" style="width:200px;float:right;margin-right:10px">
                                <Option v-for="item in [100,200,500,1000]" :value="item" :key="item">{{ item }}</Option>
                            </Select>
                            <Button size="small" @click="showSelfSqlResult= false">关闭</Button></h3> -->
                    </div>
                </transition>
                <div style="clear:both"></div>
                <slot name="sqlView"></slot>
            </div>
            <div v-show="showGl&&!runSelfSql" style="width:200px;height:calc(100% - 0px);float:left;border:1px solid #f9f6f7;">
                <div style="height:100%" v-show="filterType==1">
                    <tFilter ref="tFilter" @reflashGetObject="reflashGetObject" :aggregation="aggregation" :groupBy="groupBy" :ffilter="filter" :showGl.sync="showGl" :data="columns2"></tFilter>
                </div>
                <div style="height:100%" v-show="filterType==2">
                    <tGroup ref='tGroup' @reflashGetObject="reflashGetObject" :filter="filter" :showGl.sync="showGl" :data="columns2"></tGroup>
                    
                </div>
            </div>
        </div>
        <Modal :title="'关联其它表'" v-model='close' width='1200' :styles="{top: '20px'}">
            <tableView ref='tableView' :ipMenhu="ipMenhu" :ipWuhan="ipWuhan" @outSql="outSql" :close="close" :checkedTable="checkedTable"/>
            <p slot="footer">
            </p>
        </Modal>
    </div>
</template>
<script>
import tFilter from './dataView/tFilter'
import tGroup from './dataView//tGroup'
import tableView from './dataView/tableView'
import axios from 'axios'
export default {
    props:['checkedTable','fheight','runSelfSql','ipMenhu','ipWuhan'],
    components:{tFilter,tGroup,tableView},
    data(){
        return{
            datasourceId:'',
            sql:'',
            columns1:[],
            columns2:[],
            data1:[],
            close:false,
            filterType:'',
            showGl:false,
            aggregation:[],
            filter:[],
            groupBy:{},
            loading:false,
            alias:{},
            limit:100,
            moveIndex:-1,
            newWidths:{},
            newWidths2:{},
            columns3:[],
            data3:[],
            limit2:100,
            loading2:false,
            showSelfSqlResult:false,
            datasourceId2:'',
            sql2:''
        }
    },
    computed:{
        hColumn(){
            let arr = [],names=[]
            for(let a of this.columns1){
                if(!a.hidden){
                    arr.push(a)
                }
            }
            return arr
        },
    },
    mounted(){
        document.onmouseup = (ev)=> {
            this.moveIndex = -1
            document.onmousemove = null;

        }
    },
    methods:{
        queryData(datasourceId,sql,reflash){
            this.datasourceId = datasourceId
            this.sql = sql
            // let queryAttribute = JSON.stringify({
            //     datasourceId:this.datasourceId,
            //     sql:this.sql +' limit 10',
            //     constraints:{maxResults:100}
            // })
            this.loading = true
            // this.$http.apiPost(window.IPS.ipMenhu+'/resource/statistic/query/result',{
            //     queryAttribute
            // })
            // .then(res=>{
            //     this.loading = false
            //     if(res.success){
            //         this.data1 = res.data.result
            //         for(let a of res.data.column){
            //             if(sql.indexOf(' join ')>-1){
            //                 a.minWidth = (a.table+'.'+a.key).length*12
            //                 a.title = a.table+'.'+a.key
            //             }else{
            //                 a.minWidth = a.key.length*12
            //                 a.title = a.key
            //             }
            //             a.tooltip = true
            //             a.renderHeader = (h,{column,index})=>{
            //                 return h('div',this.alias[a.title]?this.alias[a.key]:a.title)
            //             }
            //         }
            //         this.columns1 = res.data.column.slice()
            //         if(reflash)
            //         this.columns2 = res.data.column.slice()
            //     }
            // })
            axios.post(this.ipWuhan+'/dataServiceService/sql/execute',{
                dataSourceId:this.datasourceId,
                sql:this.sql,
                limit:this.limit
            },{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>{
                this.loading = false
                res = res.data
                if(res.code==1){
                    this.data1 = res.data[0].result
                    for(let a of res.data[0].data){
                        a.key = a.columnName
                        a.title = a.columnName
                        a.dataType = a.columnTypeName=='DATETIME'?'date':
                                        a.columnTypeName=='INT'||a.columnTypeName=='BIGINT'||a.columnTypeName=='SMALLINT'?'number':'string'
                        a.table = a.tableName
                        if(sql.indexOf(' join ')>-1){
                            a.minWidth = (a.schemaName+'.'+a.table+'.'+a.key).length*8
                            a.title = a.schemaName+'.'+a.table+'.'+a.key
                        }else{
                            a.minWidth = a.key.length*12
                            a.title = a.key
                        }
                        a.tooltip = true
                        a.renderHeader = (h,{column,index})=>{
                            return h('div',this.alias[a.title]?this.alias[a.title]:a.title)
                        }
                    }
                    this.columns1 = res.data[0].data.slice()
                    if(reflash||this.columns2.length<=0)
                    this.columns2 = res.data[0].data.slice()
                }else{
                    this.columns1 = []
                    // this.columns2 = []
                    this.data1 = []
                    this.$Message.error('查询失败！')
                }
            })
        },
        queryData2(dataSourceId,sql,reflash){
            this.datasourceId2 = dataSourceId
            this.sql2 = sql
            this.showSelfSqlResult = true
            this.loading2 = true
            axios.post(this.ipWuhan+'/dataServiceService/sql/execute',{
                dataSourceId,
                sql,
                limit:this.limit2
            },{
                headers:{
                    'Content-Type':'application/json'
                }
            })
            .then(res=>{
                this.loading2 = false
                res = res.data
                if(res.code==1){
                    this.data3 = res.data[0].result
                    for(let a of res.data[0].data){
                        a.key = a.columnName
                        a.title = a.columnName
                        a.dataType = a.columnTypeName=='DATETIME'?'date':
                                        a.columnTypeName=='INT'||a.columnTypeName=='BIGINT'||a.columnTypeName=='SMALLINT'?'number':'string'
                        a.table = a.tableName
                        if(sql.indexOf(' join ')>-1){
                            a.minWidth = (a.schemaName+'.'+a.table+'.'+a.key).length*8
                            a.title = a.schemaName+'.'+a.table+'.'+a.key
                        }else{
                            a.minWidth = a.key.length*12
                            a.title = a.key
                        }
                        a.tooltip = true
                    }
                    this.columns3 = res.data[0].data.slice()
                }else{
                    this.$Message.error('查询失败！')
                }
            })
        },
        glButton(type){
            if(this.showGl){
                if(this.filterType==type){
                    this.showGl = false
                }else{
                    this.filterType = type
                }
            }else{
                this.showGl = true
                this.filterType = type
            }
        },
        reflashGetObject(filter=[],aggregation=[],groupBy={}){
            this.filter = filter
            this.aggregation = aggregation
            this.groupBy = groupBy
            this.alias = this.$refs.tGroup.alias
            let sql = this.$refs.tableView.getSql()
            if(this.filter.length>0){
                if(sql.indexOf(' where ')<=-1){
                    sql += '\n where '
                }else{
                    sql += ' and '
                }
                for(let i=0;i< this.filter.length;i++){
                    let a = this.filter[i]
                    if(i>0){
                        sql += (' and ')
                    }
                    if(a.type==1){
                        sql += (a.column+" = '"+a.value+"'")
                    }else if(a.type==2){
                        sql += (a.column+" != '"+a.value+"'")
                    }else if(a.type==3){
                        sql += (a.column+" like '%"+a.value+"%'")
                    }else if(a.type==4){
                        sql += (a.column+" not like '%"+a.value+"%'")
                    }else if(a.type==5){
                        sql += (a.column+" is null")
                    }else if(a.type==6){
                        sql += (a.column+" is not null")
                    }else if(a.type==7){
                        sql += (a.column+" not like '"+a.value+"%'")
                    }else if(a.type==8){
                        sql += (a.column+" not like '%"+a.value+"'")
                    }else if(a.type==9){
                        sql += (a.column+" > '"+a.value+"'")
                    }else if(a.type==10){
                        sql += (a.column+" < '"+a.value+"'")
                    }else if(a.type==12){
                        sql += (a.column+" >= '"+a.value+"'")
                    }else if(a.type==13){
                        sql += (a.column+" <= '"+a.value+"'")
                    }
                }
            }
            if(this.groupBy.length){
                sql = sql.split('select *')[1]
                let st = 'select '
                for(let i=0;i< this.groupBy.length;i++){
                    if(i>0) st+=','
                    if(this.alias[this.groupBy[i].column])
                        st+=this.groupBy[i].column+' as '+this.alias[this.groupBy[i].column]
                    else
                        st+=this.groupBy[i].column
                }
                sql = st + sql
            }
            if(this.aggregation.length){
                if(this.groupBy.length){
                    sql = sql.split('select ')[1]
                }else{
                    sql = sql.split('select *')[1]
                }
                let st = 'select '
                for(let i=0;i< this.aggregation.length;i++){
                    let a = aggregation[i]
                    if(i>0) st+=','
                    if(a.type==1){
                        st+='count(*)'
                    }else if(a.type==2){
                        st+='sum('+a.column+')'
                    }else if(a.type==4){
                        st+=`Distinct count(${a.column})`
                    }else if(a.type==8){
                        st+=`min(${a.column})`
                    }else if(a.type==9){
                        st+=`max(${a.column})`
                    }
                }
                sql = st + sql
            }
            this.$emit('outSql',sql)
        },
        getProperty(objectId){
            this.$http.apiPost(this.ipMenhu+ '/resource/metadata/basic/property/list',{
                objectId
            })
            .then(res=>{
                if(res.success){
                    
                }
            })
        },
        init(){
           this.filter = []
            this.aggregation = []
            this.groupBy = []
             this.$refs.tGroup.init()
            this.$refs.tFilter.init() 
        },
        outSql(sql){
            this.close = false
            this.init()
            this.$emit('outSql',sql,true)
        },
        tableSroll(){
            this.$refs.tableHeader.scrollLeft = this.$refs.tableBody.scrollLeft
        },
        tableSroll2(){
            this.$refs.tableBody.scrollLeft = this.$refs.tableHeader.scrollLeft
        },
        tableSroll3(){
            this.$refs.tableHeader2.scrollLeft = this.$refs.tableBody2.scrollLeft
        },
        tableSroll4(){
            this.$refs.tableBody2.scrollLeft = this.$refs.tableHeader2.scrollLeft
        },
        honmousedown(e,type=1){
                this.$nextTick(()=>{
                    if(['right'].indexOf(e.target.className)>-1&&this.moveIndex>-1){
                        //event的兼容性
                        let hisWidth = this.newWidths[this.moveIndex]?this.newWidths[this.moveIndex]:this.columns1[this.moveIndex].minWidth
                        if(type==2)
                            hisWidth = this.newWidths2[this.moveIndex]?this.newWidths2[this.moveIndex]:this.columns3[this.moveIndex].minWidth
                        //获取鼠标按下的坐标
                        var x1 = e.clientX;
                        var y1 = e.clientY;
                        var lt = 0;
                        var ls = 0;
                        //给可视区域添加鼠标的移动事件
                        document.onmousemove = (ev)=> {
                            //event的兼容性
                            var ev = ev;
    
                            //获取鼠标移动时的坐标
                            var x2 = ev.clientX;
                            var y2 = ev.clientY;
    
                            //计算出鼠标的移动距离
                            var x = x2 - x1;
                            var y = y2 - y1;
    
                            //移动的数值与元素的left，top相加，得出元素的移动的距离
                            lt = y;
                            ls = x;
                            if(e.target.className == 'right'){
                                // tsvg.style.left = x + hisLeft
                                if(type==1)
                                    this.$set(this.newWidths,this.moveIndex,(hisWidth + x)<30?30:(hisWidth + x))
                                else if(type==2){
                                    this.$set(this.newWidths2,this.moveIndex,(hisWidth + x)<30?30:(hisWidth + x))

                                }
                                // this.newWidths[this.moveIndex] = (hisWidth + x)<30?30:(hisWidth + x)
                                // this.columns1[this.moveIndex].minWidth = (hisWidth + x)<30?30:(hisWidth + x)
    
                            }
                        }
                    }
                })
        },
        hmouseup(){
            this.moveIndex = -1
            document.onmousemove = null;
        },
    },
}
</script>
<style scoped>
.checked{
    background-color: rgb(80, 158, 227);
    color: white;
}
.checked2{
    background-color: #7172AD !important;
    color: white !important;
}
.checked3{
    background-color: #88BF4D !important;
    color: white !important;
}
.spread-host {
    width: 100%;
    height: calc(100% - 30px);
}
.guolvbutton{
    float:right;
    height: 30px;
    line-height: 30px;
    width:75px;
    text-align: center;
    display: inline-block;
    background-color: rgba(113, 114, 173, 0.2);
    color: rgb(113, 114, 173);
    cursor: pointer;
    border-radius: 5px;
}
.juhebutton{
    float:right;
    height: 30px;
    line-height: 30px;
    width:75px;
    text-align: center;
    display: inline-block;
    background-color: rgba(136, 191, 77, 0.2);
    color: rgb(136, 191, 77);
    cursor: pointer;
    border-radius: 5px;
}
.right{
    position:absolute;
        width:10px;
        height:100%;
        top:0;
        right:-5px;
        cursor: e-resize;
    }
</style>
<style>
    .dataView .ivu-table th{
    border:1px solid #6f707085;
}
.dataView .ivu-table-tbody td{
    border:1px solid #e1e1e187;
    height:30px;
}
.dataView .ivu-table-cell{
    padding:0 0 0 2px;
    text-align:left;
    width:100%;
}
.dataView .tableBody::-webkit-scrollbar{
    height:10px;
}
.dataView .tableBody2::-webkit-scrollbar{
    height:10px;
}
</style>