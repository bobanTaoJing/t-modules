<style scoped>
.table-spin {
    position: absolute;
    left: 50%;
    top: 48%;
}

.required:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}

.inputWaring .ivu-input {
    border: 1px solid red !important;
}

/* table th{
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    background-color: #f8f8f9;
}
table td{
    min-width: 0;
    height: 48px;
    box-sizing: border-box;
    text-align: left;
    text-overflow: ellipsis;
    vertical-align: middle;
    border-bottom: 1px solid #e8eaec;
    background-color: #fff;
    transition: background-color 0.2s ease-in-out;
} */
</style><style>
.inputWaring .ivu-input {
    border: 1px solid red !important;
}

.required:before {
    content: '*';
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
}

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

.edit-table .ivu-table-wrapper {
    overflow: inherit;
}

.edit-table {
    padding: 10px 20px;
    background: #fff;
}

.edit-table td {
    user-select: inherit;
}
.edit-table table{
    transition: all .5s linear;
}
</style>
<template>
<div class="table-panel" :class="{'edit-table':!canCopy}">
    <div>
        <Table :data="tableData" :columns="hColumns" ref="table" @on-drag-drop="onDragDrop" :draggable="draggable" :size="tableSize" :class="{'table-loading': loading}" :max-height='height'></Table>
        <Button @click="addTableDataItem" type="primary" :disabled="disabledAdd||disabled">添加</Button>
    </div>
</div>
</template>

<script>
export default {
    props: {
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
        columns: {
            default: []
        },
        showTopd:{//是否显示上移 下移按钮
            default:true
        },
        dataUrl: {},
        dataUrlType: {
            type: String,
            default: 'POST'
        },
        param: {},
        height: {
            default: 600
        },
        disabledAdd:{
            default:false
        },
        showSerial:{//显示序号
            default:true
        },
        draggable:{//是否可移动
            default:true
        },
        autoName:{//
            default:false
        },
        canCopy:{
            default:false
        },
        deleteTip:{//是否需要删除提示
            default:true
        },
        disabled:{
            type:Boolean,
            default:false
        }
    },
    data() {
        return {
            tableData: [],
            loading: false,
        }
    },
    computed: {
        hColumns() {
            let arr = []
            if(this.showSerial)
                arr.push({
                    title: '序号',
                    width: 70,
                    render: (h, params) => {
                        return h('div', [
                        h('span',params.index+1)
                        ]);
                    }
                })
            if(this.autoName)
                arr.push({
                    title: '变量名',
                    width: 90,
                    render: (h, params) => {
                        return h('div', [
                        h('span','params['+params.index+"]")
                        ]);
                    }
                })
            for (let a of this.columns) {
                let obj = {
                    title: a.title,
                    width: a.width,
                    render: this.renderType(a)
                }
                if (a.required) {
                    obj.renderHeader = (h, params) => {
                        return h('div', {
                            class: {
                                required: true
                            }
                        }, a.title)
                    }
                }
                arr.push(obj)
            }
            arr.push({
                title: '操作',
                width: this.showTopd?200:80,
                render: (h, params) => {
                    return h('div', [
                        h('Poptip',{
                            attrs:{
                                confirm:true,
                                title:'您确认删除选中的内容吗？',
                                placement:'bottom-start',
                                transfer:true,
                                disabled:this.disabled
                            },
                            on:{
                                'on-ok':()=>{
                                    console.log('on-ok')
                                    this.tableData.splice(params.index, 1)
                                }
                            }
                        },[
                            h('Button',{
                                props: {
                                type: 'error',
                                size: 'small'
                            }
                            },'删除')
                        ]),
                        // h('Button', {
                        //     props: {
                        //         type: 'error',
                        //         size: 'small'
                        //     },
                        //     attrs:{
                        //         disabled:this.disabled
                        //     },
                        //     on: {
                        //         click: () => {
                        //             // console.log(params)
                        //             if(this.deleteTip)
                        //                 this.$Modal.confirm({
                        //                     title: '确认提示',
                        //                     content: '<p>确定删除？</p>',
                        //                     onOk: () => {
                        //                         this.tableData.splice(params.index, 1)
                        //                         // this.$Message.success('删除成功!')
                        //                     },
                        //                     onCancel: () => {
                        //                         // this.$Message.info('删除取消!')
                        //                     }
                        //                 })
                        //             else this.tableData.splice(params.index, 1)
                        //         }
                        //     }
                        // }, '删除'),
                        h('Button', {
                            props: {
                                // type: 'error',
                                size: 'small'
                            },
                            style: {
                                margin: '0 5px',
                                display:this.showTopd?'inline-block':'none'
                            },
                            attrs:{
                                disabled:this.disabled
                            },
                            on: {
                                click: (e) => {
                                    // console.log(e)
                                    this.moveUp(params.index)
                                }
                            }
                        }, '上移'),
                        h('Button', {
                            props: {
                                // type: 'error',
                                size: 'small'
                            },
                            attrs:{
                                disabled:this.disabled
                            },
                            style:{
                                display:this.showTopd?'inline-block':'none'
                            },
                            on: {
                                click: () => {
                                    // console.log(params)
                                    this.moveDown(params.index)
                                }
                            }
                        }, '下移'),
                    ]);
                }
            })
            return arr
        },
        tableDataItem() {
            let obj = {}
            for (let a of this.columns) {
                if (a.type == 'checkbox') {
                    obj[a.key] = a.value === undefined ? false : a.value
                } else {
                    obj[a.key] = a.value ? a.value : ''
                }
            }
            return obj
        },
        requireds() {
            let arr = []
            for (let a of this.columns) {
                if (a.required) arr.push(a.key)
            }
            return arr
        }
    },
    created() {

    },
    methods: {
        renderType(item) {
            if (item.type == 'input') {
                return (h, params) => {
                    return h('div', [
                        h('Poptip', {
                            class:"edit-table-poptip",
                            props: {
                                trigger: 'hover',
                                content: item.title + '不能为空',
                                disabled: !(item.required && params.row[item.key] == '')
                            }
                        }, [
                            h('Input', {
                                class: {
                                    inputWaring: item.required && params.row[item.key] == '',
                                },
                                style:"width:100%",
                                props: {
                                    type: 'text',
                                    size: 'small'
                                },
                                attrs: {
                                    value: params.row[item.key],
                                    disabled:this.disabled
                                },
                                on: {
                                    'on-change': (event) => {
                                        this.tableData[params.index][item.key] = event.target.value
                                    }
                                }
                            }),
                        ])
                    ]);
                }
            } else if (item.type == 'select') {
                return (h, params) => {
                    let options = []
                    if (item.data) {
                        for (let a of item.data) {
                            options.push(
                                h('Option', {
                                    attrs: {
                                        value: a.value,
                                        disabled:this.disabled
                                    },
                                }, a.label),
                            )
                        }
                    }
                    return h('div', [
                        h('Select', {
                            props: {
                                type: 'text',
                                size: 'small'
                            },
                            attrs: {
                                value: params.row[item.key],
                                disabled:this.disabled
                            },
                            on: {
                                'on-change': (value) => {
                                    // console.log(value)
                                    this.tableData[params.index][item.key] = value
                                }
                            }
                        }, options),
                    ]);
                }
            } else if (item.type == 'checkbox') {
                return (h, params) => {
                    return h('div', [
                        h('Checkbox', {
                            props: {

                            },
                            attrs: {
                                value: params.row[item.key],
                                disabled:this.disabled
                            },
                            on: {
                                'on-change': (value) => {
                                    this.tableData[params.index][item.key] = value
                                }
                            }
                        }),
                    ]);
                }
            }else if(item.type == 'icon'){
                return (h, params)=>{
                    return h('div',[
                        h('Icon', {
                                props: {
                                    type: item.iconType,
                                },
                                attrs:{
                                    title:item.title,
                                },
                                style:{
                                    cursor:'pointer',
                                    fontSize:'18px',
                                    display:item.dependencies?(item.dependencies.values.indexOf(params.row[item.dependencies.key])>-1?'inline-block':'none'):'inline-block'
                                },
                                on: {
                                    click: () => {
                                        if(item.click&&!this.disabled)
                                       return item.click(params)
                                    }
                                }
                            })
                    ]
                        )
                }
            }
        },
        addTableDataItem() {
            let tableDataItem = Object.assign({}, this.tableDataItem)
            this.tableData.push(tableDataItem)
        },
        submit(success, error) {
            let data = this.tableData
            for (let a of this.tableData) {
                for (let b in a) {
                    if (a[b] === '' && this.requireds.indexOf(b) > -1) {
                        this.$Message.error('请填写正确再提交!');
                        if (error != null) {
                            error(data)
                        }
                        return
                    }
                }
            }
            for(let i in data){
                data[i].index=parseInt(i) + 1
            }
            success(data)
        },
        //上移
        moveUp(index){
            if(index<=0) return
            let item = this.tableData[index]
            this.$set(this.tableData,index,this.tableData[index-1])
            this.$set(this.tableData,index-1,item)
        },
        //下移
        moveDown(index){
            if(index>=this.tableData.length-1) return
            let item = this.tableData[index]
            this.$set(this.tableData,index,this.tableData[index+1])
            this.$set(this.tableData,index+1,item)
        },
        onDragDrop(index1,index2){
            let item = this.tableData[index1]
            this.$set(this.tableData,index1,this.tableData[index2])
            this.$set(this.tableData,index2,item)
        },
        //清空表格数据
        clearTableData(){
            this.tableData = []
        }
    },
    watch: {
        tableData: {
            handler() {
                // console.log(this.tableData)
            },
            deep: true
        }
    }
}
</script>
<style>
    .edit-table-poptip,.edit-table-poptip .ivu-poptip-rel{
        width:100%;
    }
</style>