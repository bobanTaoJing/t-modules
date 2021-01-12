<template>
<div>
    <ivTable ref="ivTable" :columns="tableOption.columns" :height="tableOption.height" :tableData="tableData" :total="total" :loading="loading" @getData="getData" :searchParams="tableOption.searchParams" :showPage="tableOption.showPage"></ivTable>
</div>
</template>

<script>
//数据从接口获取的表格
import ivTable from '@/components/iview/combination/ivTable'
export default {
    props: {
        tableOption:{
            columns: {
                type: Array,
                default: () => {
                    return [
                        // {
                        //     type:'selection',
                        //     width:60
                        // },
                        {
                            type: 'index',
                            width: 60,
                            title: '序号',
                        },
                        {
                            key: 'sbc_curve_date',
                            title: '出清时间',
                        },
                        {
                            key: 'name',
                            title: '市场成员',
                        },
                        {
                            key: 'number2',
                            title: '计划电量',
                        },
                        {
                            key: 'number1',
                            title: '出清电量',
                        },
                        {
                            key: 'confirmed',
                            title: '用户确认',
                            render: (h, params) => {
                                return h('div', {
                                    style: {
                                        color: params.row.confirmed === 1 ? 'green' : 'gray'
                                    }
                                }, params.row.confirmed === 1 ? '已确认' : '未确认')
                            },
                        },
                        {
                            key: 'verified',
                            title: '是否审核',
                            render: (h, params) => {
                                return h('div', {
                                    style: {
                                        color: params.row.verified === 1 ? 'green' : 'gray'
                                    }
                                }, params.row.verified === 1 ? '通过' : '待审核')
                            },
                        }
                    ]
                }
            },
            searchParams: {
                type: Array,
                default: () => {
                    return [{
                            type: 'input_text',
                            value: '',
                            span: 4,
                            key: 'name'
                        },
                        {
                            type: 'DatePicker',
                            type2: 'daterange',
                            value: '',
                            span: 4,
                            key: 'date'
                        },
                    ]
                }
            },
            //处理请求参数
            handleParams: {
                type: Function,
                default: (params) => {
                    params.currentPage = params.current
                    params.sdate = params.date[0]
                    params.edate = params.date[1]
                    delete params.current
                    delete params.date
                    return params
                }
            },
            //处理返回数据
            handleData: {
                type: Function,
                default: (res) => {
                    return {
                        success: res.data.resultMsg == 'success',
                        total: res.data.totalSize,
                        tableData: res.data.results,
                    }
                }
            },
            url: {
                type: String,
                default: '/dataservice/query/V1/getClear'
            },
            queryType: {
                type: String,
                default: 'get'
            },
            showPage:{
                type:Boolean,
                default:false
            },
            height:{
                type:[String,Number],
                default:400
            },
        }
    },
    components: {
        ivTable
    },
    data() {
        return {
            tableData: [],
            total: 0,
            loading: false
        }
    },
    created(){
        this.setDefaultValue()
    },
    methods: {
        //设置默认值
        setDefaultValue(){
            if(!this.tableOption.columns){
                this.tableOption.columns = []
            }
            if(!this.tableOption.searchParams){
                this.tableOption.searchParams = []
            }
            if(!this.tableOption.handleParams){
                this.tableOption.handleParams =  function(params){
                    return params
                }
            }
            if(!this.tableOption.handleData){
                this.tableOption.handleData = function(res){
                    return {
                        success: res.data.resultMsg == 'success',
                        total: res.data.totalSize,
                        tableData: res.data.results,
                    }
                }
            }
            if(!this.tableOption.queryType){
                this.tableOption.queryType = 'get'
            }
            if(!this.tableOption.height){
                this.tableOption.height = 400
            }
        },
        getData(params) {
            params = this.tableOption.handleParams(params)
            this.loading = true
            let obj = {}
            if (this.tableOption.queryType == 'get') {
                obj = {
                    params
                }
            } else if (this.tableOption.queryType == 'post') {
                obj = params
            }
            this.$http[this.tableOption.queryType](this.tableOption.url, obj)
                .then(res => {
                    this.loading = false
                    let obj = this.tableOption.handleData(res)
                    if (obj.success) {
                        this.total = obj.total
                        this.tableData = obj.tableData
                    }
                })
                .finally(() => {
                    this.loading = false
                })
        },
        reflash(){
            this.$refs.ivTable.getData()
        },
        reflashColumns(){
            this.$refs.ivTable.handleColumns()
        },
        reflashOption(){
            this.setDefaultValue()
            this.$refs.ivTable.page = 1
            this.$refs.ivTable.getData()
        }
    },
}
</script>
