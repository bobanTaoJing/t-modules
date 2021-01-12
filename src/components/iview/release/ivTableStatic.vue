<template>
<div>
    <ivTable ref="ivTable" :columns="tableOption.columns" :tableData="tableData" :total="total" :loading="loading" @getData="getData" :searchParams="tableOption.searchParams" :showPage="tableOption.showPage"></ivTable>
</div>
</template>

<script>
//数据直接传入获取的表格
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
            tableData:{
                type:Array,
                default:()=>{
                    return[]
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
            showPage:{
                type:Boolean,
                default:false
            }
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
            if(!this.tableOption.tableData){
                this.tableOption.tableData = []
            }
            if(!this.tableOption.searchParams){
                this.tableOption.searchParams = []
            }
            if(!this.tableOption.handleData){
                this.tableOption.handleData = function(params,tableData){
                    return tableData
                }
            }
        },
        getData(params) {
            this.loading = true
            this.total = this.tableOption.tableData.length
            this.tableData = this.tableOption.handleData(params,this.tableOption.tableData)
            setTimeout(()=>{
                this.loading = false
            },10)
            
        },
        reflash(){
            this.$refs.ivTable.getData()
        },
        reflashOptioin(){
            this.setDefaultValue()
            this.$refs.ivTable.page = 1
            this.$refs.ivTable.getData()
        }
    },
}
</script>
