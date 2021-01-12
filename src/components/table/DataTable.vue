<style scoped>
.table-spin {
    position: absolute;
    left: 50%;
    top: 48%;
}
</style>

<style>
.table-panel .ivu-table-small th {
    height: 40px;
    font-size: 13px;
}

.table-panel .ivu-table-small td {
    height: 36px;
}

.table-panel .ivu-table-wrapper {
    border-color: #f4f4f4;
}

.table-panel .ivu-table:after {
    display: none;
    background-color: #f4f4f4;
}

.table-panel .ivu-table:before {
    background-color: #e9eaec;
    display: none;
}

.table-panel .ivu-table:before {
    background-color: #f8f8f9;
}

/* td {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  } */

.table-loading .ivu-table-body,
.table-loading .ivu-table-tip {
    opacity: 0.5
}

.table-panel ::-webkit-scrollbar-thumb {
    /* background-color: #f8f8f9; */
    background-color: #d4cece;
}

.table-panel .ivu-table-wrapper {
    border: none;
}

.table-panel .t-collapse-buttons-f{
  position: relative;
  display:inline-block;
  height:24px;
}
.table-panel .t-collapse-buttons{
     /* height:0px; */
     display: none;
     /* overflow: hidden; */
     /* padding:0 5px; */
    position: fixed;
    /* top: 0; */
    width: 60px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background: #fff;
    border-radius: 4px;
    -webkit-box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
    /* top: 25px;
    left: 0px; */
    z-index: 1;
    transition: all .1s linear;
}
.table-panel .t-collapse-buttons> span:hover{
    background:#ddd;
}
.more-buttons-icon .ivu-icon-ios-arrow-forward{
  transition: all .1s linear;
}
.t-collapse-buttons-f:hover .ivu-icon-ios-arrow-forward{
  transform: rotate(90deg)
}
.table-switch,.table-switch:after{
    /* cursor: default !important; */
    opacity: 1 !important;
}
</style>

<template>
<div class="table-panel">

    <div style="display: inline-block;width: 100%">
        <div style="float: left">
            <slot name="toolbar"></slot>
        </div>
        <div style="float: right;padding-top: 8px" v-if="showSettingToolbar">
            <Button ghost type='primary' style="margin:0 5px" size="small" @click="queryData" icon="ios-refresh"></Button>
            <Poptip placement="bottom-end" width="200">
                <Button size="small" ghost type='primary' icon="ios-funnel"></Button>
                <div slot="content" style="margin: 5px 0">
                    <div v-for="col in columns">
                        <Checkbox @on-change="columnsChange" :true-value="false" :false-value="true" v-if="col.title" v-model="col.hidden" :label="col.title">
                            {{col.title}}
                        </Checkbox>
                    </div>
                    <div></div>
                </div>
            </Poptip>
        </div>
    </div>
    <div>
        <Table :data="tableData" :columns="mColumns" ref="table" @on-row-click="rowClick" @on-row-dblclick="rowDblclick" @on-selection-change="selectionChange" @on-sort-change="onSortChange" :size="tableSize" :class="{'table-loading': loading}" :height="height" highlight-row>
            <template slot="footer" v-if="showFooter">
                <slot name="footer"></slot>
            </template>
        </Table>
        <spin v-if="loading" size="large" class="table-spin"></spin>
    </div>
    <div v-if="showPage" style="margin: 10px;overflow: hidden">
        <div :style="'text-align: '+this.pageAlign">
            <Page :total="total" :page-size="pageParam.pageSize" placement="top" :current="pageParam.page" @on-change="changePage" @on-page-size-change="changePageSize" :size="tableSize" show-total show-sizer show-elevator>
            </Page>
        </div>
    </div>

</div>
</template>

<script>
import {
    resolve,
    reject
} from 'q';
export default {

    props: {
        data:{},
        pageAlign: {
            default: 'center'
        },
        tableSize: {
            default: 'small'
        },
        pageSize: {
            default: 10
        },
        showSettingToolbar: {
            type: Boolean,
            default: true
        },
        showFooter: {
            type: Boolean,
            default: false
        },
        showPage: {
            type: Boolean,
            default: true
        },
        lazy: {
            type: Boolean,
            default: false
        },
        columns: {},
        dataUrl: {},
        dataUrlType: {
            type: String,
            default: 'POST'
        },
        param: {},
        headers: {},
        height: {
            default: window.innerHeight - 230
        }
    },
    data() {
        return {
            total: 0,
            loading: false,
            searchTimer: null,
            // mColumns: [],
            selection: [],
            pageParam: {
                page: 1,
                pageSize: 10,
                sortField: 'id',
                sortOrder: 'id'
            },
            tableData: []
        };
    },
    computed: {
        isSingle() {
            return !(this.selection !== null && this.selection.length === 1);
        },
        isMultiple() {
            return !(this.selection != null && this.selection.length > 0);
        },
        mColumns() {
            let list = [],
                arr = this.columns.slice()
            for (let col of arr) {
                //补充 click事件
                if (col.title == '操作') {
                    col.key = "action"
                    col.fixed = 'right'
                    col.width = col.width ? col.width : '330'
                    col.render = (h, params) => {
                            return h('div', this.handleCols(h, params, col.columns))
                    }

                } else if (col.click != null) {
                    col.render = (h, params) => {
                        return h('a', {
                            style:{
                                color:'rgb(45, 140, 240)'
                            },
                            on: {
                                click: () => {
                                    return col.click(params)
                                }
                            }
                        }, params.row[col.key])
                    }
                }
                //type:switch 的处理
                if(col.type=='switch'){
                    col.render = (h, params) => {
                        return h('i-switch', {
                            attrs:{
                                size:'large',
                                disabled:true,
                                'true-value':col.trueData.value,
                                'false-value':col.falseData.value,
                                value:params.row[col.key]
                            },
                            class:{
                                'table-switch':true
                            },
                        },[
                            h('span',{
                                slot:'open'
                            },col.trueData.label),
                            h('span',{
                                slot:'close'
                            },col.falseData.label)
                        ])
                    }
                }
                //表格字段绑定数据
                if (col.enum) {
                    col.render = (h, params) => {
                        const row = params.row;
                        for (let i = 0; i < col.enum.length; i++) {
                            if (typeof col.enum[i] === 'string' && i === row[col.key]) {
                                return h('span', col.enum[i]);
                            } else if (row[col.key] == col.enum[i].id) {
                                let html = col.enum[i].el || 'span';
                                return h(html, col.enum[i].name);
                            }
                        }
                        return null;
                    };
                }
                //过滤 是否选择显示对应列
                if (!col.hidden) list.push(col)
            }
            return list
        }
    },
    methods: {
        /**
         * 获取数据
         */
        queryData() {
            // console.log("dataTable::fresh");
            this.selection = null;
            this.$emit('on-selection-change', null);
            if(this.data){
                this.total = this.data.length
                this.tableData = this.data.slice((this.pageParam.page-1)*this.pageParam.pageSize,this.pageParam.page*this.pageParam.pageSize)
                return
            }
            if (this.dataUrl == null || this.loading === true) {
                return;
            }
            this.loading = true;
            let param = Object.assign(JSON.parse(JSON.stringify(this.pageParam)), this.param);
            let headers = this.headers
            console.log(param)
            // console.log("datatable.vue:" + this.dataUrl+":::this.param:"+JSON.stringify(param));
            if (this.dataUrlType.toLocaleLowerCase() == 'get') {
                this.$http.apiGet(this.dataUrl, {
                    params: param,headers
                }).then((res) => {
                    this.loading = false;
                    if (!res.success) {
                        this.$http.handleError(res);
                    } else {
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                    }
                });
            } else {
                // console.log(param,this.param)
                this.$http.apiPost(this.dataUrl, param,{headers}).then((res) => {
                    this.loading = false;
                    if (!res.success) {
                        this.$http.handleError(res);
                    } else {
                        this.total = res.data.total;
                        this.tableData = res.data.rows;
                    }
                });
            }
        },
        //获取数据来源id与name的对应关系
        getEnum(query) {
            return new Promise((resolve, reject) => {
                let arr = []
                let headers = this.headers
                console.log(headers)
                this.$http.apiPost(query.url, query.param,{headers}).then((res) => {
                        if (res.success == true) {
                            for (let b of res.data.rows) {
                                arr.push({
                                    id: b[query.valField?query.valField:'id'],
                                    name: b[query.textField?query.textField:'name']
                                })
                            }
                        }
                    })
                    .finally(() => {
                        resolve(arr)
                    })
            })
        },
        changePage(page) {
            this.pageParam.page = page;
            this.queryData();
        },
        changePageSize(pageSize) {
            this.pageParam.pageSize = pageSize;
            this.queryData();
        },
        selectionChange(selection) {
            this.selection = selection;
            this.$emit('on-selection-change', this.selection);
        },
        rowDblclick(data, index) {
            this.$emit('on-row-dblclick', data, index);
        },
        rowClick(data, index) {
            this.$refs.table.selectAll(false);
            this.$refs.table.toggleSelect(index);
            this.$emit('on-row-click', data, index);
        },
        clearCurrentRow() {
            this.$refs['table'].clearCurrentRow();
        },
        onSortChange(data) {
            this.pageParam.sortField = data.key;
            this.pageParam.sortOrder = data.order;
            this.queryData();
        },
        columnsChange() {
            // let list = [];
            // for (let key = 0; key < this.columns.length; key++) {
            //   if (this.columns[key] instanceof Object && (this.columns[key].hidden == null || !this.columns[key].hidden)) {
            //     list.push(this.columns[key]);
            //   }
            // }
            // this.mColumns = list;
            // this.$nextTick(() => {
            //   this.mColumns = list;
            // });
        },
        //处理操作按钮是否显示
        handleCols(h, params, columns = []) {
            let arr = [],
                columns1 = [],
                columns2 = []
            for (let a of columns) {
                if(a.colorDatas){
                    let canClick = false
                    // 或
                    for(let b of a.colorDatas){
                        if(params.row[b.key]==b.value){
                            canClick = true
                        }
                    }
                    //且
                    for(let b of a.colorDatas){
                        if(b.essential){
                            if(params.row[b.key]==b.value){
                                // canClick = true
                            }else{
                                canClick = false
                            }
                        }
                    }
                    a.scolor= canClick
                }else{
                    a.scolor = a.colorData?params.row[a.colorData.key]==a.colorData.value?true:false:true
                }
                a.sdisplay = a.showData?params.row[a.showData.key]==a.showData.value?'inline-block':'none':'inline-block'
                a.scursor = a.scolor?'pointer':'default'
                if (a.collapse) columns2.push(a)
                else columns1.push(a)
            }
            for (let a of columns1) {
                let scursor = a.scursor
                if(a.name=='删除'){
                    arr.push( h('Poptip',{
                                attrs:{
                                    confirm:true,
                                    title:'您确认删除选中的内容吗？',
                                    placement:'bottom-start',
                                    transfer:true,
                                    disabled:scursor=='default'
                                },
                                on:{
                                    'on-ok':()=>{
                                         if(scursor=='default') return
                                            a.click(params)
                                        // this.tableData.splice(params.index, 1)
                                    }
                                }
                            },[
                                h('span',{
                                    props: {
                                type: a.color ? a.color : 'primary',
                                size: 'small'
                            },
                            attrs: {
                                ghost: true
                            },
                            class:{
                                tableClick:a.scolor,tableNoClick:!a.scolor
                            },
                            style: {
                                marginRight: '5px',
                                border:'none',
                                cursor:a.scursor,
                                display:a.sdisplay
                            }
                                },'删除')
                            ]))
                }else{
                    arr.push(
                        h('span', {
                            props: {
                                type: a.color ? a.color : 'primary',
                                size: 'small'
                            },
                            attrs: {
                                ghost: true
                            },
                            class:{
                                tableClick:a.scolor,tableNoClick:!a.scolor
                            },
                            style: {
                                marginRight: '5px',
                                border:'none',
                                cursor:a.scursor,
                                display:a.sdisplay
                            },
                            on: {
                                click: () => {
                                    if(scursor=='default') return
                                    a.click(params)
                                }
                            }
                        }, a.name)
                    )
                }
            }
            if (columns2.length > 0) {
                let arr2 = [
                  h('div',{
                    style:{
                      border:"5px solid #ddd",
                          border: '5px solid transparent',
                          width: '5px',
                          height: '5px',
                          'border-bottom': '5px solid #2d8cf0',
                          position: 'absolute',
                          right: '23px',
                          top: '-6px',

                    }
                  }),
                  h('div',{
                    style:{
                      width: '100%',
                      height: '5px',
                      position: 'absolute',
                      right: '0',
                      top: '-5px',

                    }
                  }),
                  h('div',{
                    style:{
                      width: '100%',
                      height: '5px',
                      position: 'absolute',
                      right: '0',
                      bottom: '-5px',
                    }
                  })
                ]
                for (let a of columns2) { //收起的按钮
                let scursor = a.scursor
                if(a.name=='删除'){
                    arr2.push( h('Poptip',{
                                attrs:{
                                    confirm:true,
                                    title:'您确认删除选中的内容吗？',
                                    placement:'bottom-start',
                                    transfer:true,
                                    disabled:scursor=='default'
                                },
                                on:{
                                    'on-ok':(e)=>{
                                         e.stopPropagation()
                                  if(scursor=='default') return
                                      a.click(params)
                                        // this.tableData.splice(params.index, 1)
                                    }
                                }
                            },[
                                h('span',{
                                   props: {
                                type: a.color ? a.color : 'primary',
                                size: 'small'
                            },
                            attrs: {
                                ghost: true,
                            },
                            class:{
                                tableClick:a.scolor,tableNoClick:!a.scolor
                            },
                            style: {
                                padding: '5px',
                                border:'none',
                                overflow:"hidden",
                                'text-align':'center',
                                width:'100%',
                                cursor:a.scursor,
                                display:a.sdisplay
                            }
                                },'删除')
                            ]))
                }else{
                    arr2.push(
                        h('span', {
                            props: {
                                type: a.color ? a.color : 'primary',
                                size: 'small'
                            },
                            attrs: {
                                ghost: true,
                            },
                            class:{
                                tableClick:a.scolor,tableNoClick:!a.scolor
                            },
                            style: {
                                padding: '5px',
                                border:'none',
                                overflow:"hidden",
                                'text-align':'center',
                                width:'100%',
                                cursor:a.scursor,
                                display:a.sdisplay
                            },
                            on: {
                                 click: (e) => {
                                  e.stopPropagation()
                                  if(scursor=='default') return
                                      a.click(params)
                                },
                                dblclick:(e)=>{
                                  e.stopPropagation()
                                }
                            }
                        }, a.name)
                    )
                }
                }
                arr.push(
                    h('div', {
                        class:{
                          't-collapse-buttons-f':true
                        },
                        on: {
                                mouseenter: (e) => {
                                //   console.log(e,params)
                                    let x = 0, y = 0,target = e.target,boxdom=e.target.lastElementChild
                                    // do {
                                    //   x+=target.offsetLeft
                                    //   y+=target.offsetTop
                                    //   target = target.offsetParent
                                    //   console.log(target)
                                    // } while (target.localName!='body')
                                    boxdom.style.top = ""
                                    boxdom.style.bottom = ""
                                    boxdom.style.left = ""
                                    y = e.clientY-e.offsetY
                                    x = e.clientX-e.offsetX
                                    let height = Math.ceil((arr2.length-3) / 2)
                                    if(y>window.innerHeight-height*35){
                                      boxdom.firstChild.style.top=''
                                      boxdom.firstChild.style.bottom='-10px'
                                      boxdom.firstChild.style.borderBottom='5px solid transparent'
                                      boxdom.firstChild.style.borderTop='5px solid #2d8cf0'
                                      
                                      boxdom.style.bottom = window.innerHeight-y+5+'px'
                                    }
                                    else{
                                       boxdom.firstChild.style.top='-10px'
                                      boxdom.firstChild.style.bottom=''
                                      boxdom.firstChild.style.borderTop='5px solid transparent'
                                      boxdom.firstChild.style.borderBottom='5px solid #2d8cf0'
                                      
                                      boxdom.style.top = y+28+'px'
                                    }
                                    
                                    boxdom.style.left = x-18+'px'
                                    boxdom.style.display = 'block'
                                  // }
                                    // params
                                },
                                mouseleave:(e)=>{
                                  // if(e.target.nodeName == 'SPAN'){
                                  //   e.target.parentElement.nextElementSibling.style.display = 'none'
                                  // }else{
                                    e.target.lastElementChild.style.display = 'none'
                                  // }
                                }
                            }
                    }, [
                        h('Button', {
                            props: {
                                type: 'primary',
                                size: 'small',
                                icon:"ios-arrow-forward"
                            },
                            class:{
                              'more-buttons-icon':true
                            },
                            attrs: {
                                ghost: true
                            },
                            style:{
                              cursor:'default',
                              border:'none'
                            }
                        }),
                        h('div', {
                          class:{
                            't-collapse-buttons':true
                          },
                        }, arr2)
                    ])
                )
            }
            return arr
        },
        async hdAwait() {
            let arrUrl = [],
                arrEnum = []
            for (let a of this.columns) {
                if (a.queryEnum) {
                    if (arrUrl.indexOf(a.queryEnum.url) > -1) {
                        this.$set(a,'enum',arrEnum[arrUrl.indexOf(a.queryEnum.url)])
                    } else {
                        // console.log('hdAwait')
                        await this.getEnum(a.queryEnum).then(res => {
                            arrUrl.push(a.queryEnum.url)
                            arrEnum.push(res)
                            this.$set(a,'enum',res)
                        })
                    }
                }
            }
        }
    },
    created() {
        // this.mColumns = this.columns;
        // console.log('test  ----',this.mColumns)
        this.hdAwait()
        if (this.pageSize != null) {
            this.pageParam.pageSize = this.pageSize;
        }
        if (!this.lazy) {
            this.queryData();
        }
        if (!this.showPage) {
            this.pageParam.pageSize = 1000;
        }
    },
    watch: {
        param: {
            handler(curVal, oldVal) {
                this.queryData();
            },
            deep: true
        },
        columns: {
            handler(curVal, oldVal) {
                // this.mColumns = curVal;
            },
            deep: true
        }
    },
    components: {}
};
</script>
