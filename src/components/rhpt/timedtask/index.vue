<template>
<div>
    <CrudView v-if="showView" ref='crudView' :tableOptions='tableOptions'>
        <template slot='toolbar'>
        </template>
    </CrudView>
    <Modal title="编辑" v-model='close' :width='800' :styles="{top: '20px'}">
        <FormDynamic ref="dynamicOne" :appendIndex="[0,0]" :data="dynamicOne" :label-width="100">
            <template slot="appendIndex">
                <FormDynamic v-if="reflashDynamicOnem" ref="dynamicOnem" :data="dynamicOnem" :label-width="100">
                    <template slot="append">
                    </template>
                </FormDynamic>
            </template>
        </FormDynamic>
        <FormDynamic ref="dynamicTwo" :data="dynamicTwo" :label-width="100">
            <template slot="append">
            </template>
        </FormDynamic>
        <div slot="footer">
            <Button @click="updateJob">确定</Button>
        </div>
    </Modal>
    <Modal :title="cronName+'-日志'" v-model='close2' :width='1000' :styles="{top: '20px'}">
        <Row :gutter="5">
            <i-col v-if="close3" style="min-height:334px">
                <Spin size="large" fix v-if="loading"></Spin>
                <Tabs v-else value="name1">
                    <TabPane label="详情" name="name1">
                        <ChartDoubleLine :xData="lineXdata" :value="[{name:'写入条数',value:lineValue,color:'#C41A16'},{name:'速度',value:lineValue2,color:'#4FB8FE'}]" height="250px"></ChartDoubleLine>
                    </TabPane>
                    <TabPane label="报错信息" name="name3" v-if="erroclose">
                        <AceEditor ref="ErrorMsgjson" height="250px" :readOnly="true" :showAction="false" :showMenu="false" :codes="errorMsgjson" :language="'yaml'" />
                    </TabPane>
                    <TabPane label="基础信息" name="name2">
                        <AceEditor ref="ErrorMsg" height="250px" :readOnly="true" :showAction="false" :showMenu="false" :codes="errorMsg" :language="'yaml'" />
                    </TabPane>

                </Tabs>
            </i-col>
            <i-col :span="6">
                <DatePicker v-model="date" type="daterange" placement="bottom-end" placeholder="时间" format="yyyy-MM-dd"></DatePicker>
            </i-col>
            <i-col :span="6">
                <i-button ghost type='primary' icon="ios-search" @click="searchCrud2">查询</i-button>
            </i-col>
        </Row>
        <CrudView ref='crudView2' v-if="close2" :tableOptions='tableOptions2' :full="false">
            <template slot='toolbar'>
            </template>
        </CrudView>
        <div slot="footer">
            <Button @click="close2=false">确定</Button>
        </div>
        <Modal title="重试任务日志" v-model='close4' width='1000' :styles="{top: '20px'}" @on-visible-change="onVchange">
            <CrudView ref='crudView3' v-if="close4" :tableOptions='tableOptions3' :full="false">
                <template slot='toolbar'>
                </template>
            </CrudView>
            <div slot="footer">
                <Button @click="close4=false" type="primary">确定</Button>
            </div>
        </Modal>
    </Modal>
    <!-- 数据流程（stream）日志详情 -->
    <streamLog ref="streamLog" :ip="ip" :headers="headers" />
</div>
</template>

<script>
import {
    CrudView,
    DataTree,
    FormDynamic,
    ChartDoubleLine
} from '../../../components/';
import AceEditor from '../../../components/editor/AceEditor.vue';
import ChartLine from '../../../components/charts/line.vue';
import streamLog from './streamLog'

export default {
    props:{
        topicId:{
            type:[String,Number],
            default:''
        },
        group:{
            type:String,
            default:''
        },
        ip:{

        },
        headers:{}
    },
    data() {
        return {
            showView: true,
            tableOptions: {},
            close: false,
            dynamicOne: [
                [{
                    name: 'projectId',
                    type: 'select',
                    span: 24,
                    label: '所属项目',
                    clearable: false,
                    disabled: true,
                    valField: 'id',
                    textField: 'name',
                    dataUrl: this.ip+'/admin/api/sys/project/list',
                    headers:this.headers,
                    param: {
                        sortField: 'id',
                        sortOrder: 'asc'
                    },
                    rules: {
                        required: true,
                        type: 'number'
                    }
                }, {
                    name: 'name',
                    type: 'text',
                    span: 24,
                    label: '任务名称',
                    disabled: true,
                    labelWidth: 100,
                    rules: {
                        required: true,
                    },
                }, {
                    name: 'group',
                    type: 'select',
                    span: 24,
                    label: '任务组',
                    disabled: true,
                    labelWidth: 100,
                    data: [],
                    rules: {
                        required: true,
                    },
                }, {
                    name: 'jobType',
                    type: 'select',
                    span: 24,
                    label: '任务类型',
                    labelWidth: 100,
                    data: [{
                            label: '定时任务',
                            value: 0
                        },
                        {
                            label: '常驻任务',
                            value: 1
                        },
                    ],
                    rules: {
                        required: true,
                        type: 'number'
                    },
                    value: 0
                }, {
                    name: 'cronExpression',
                    type: 'cron',
                    span: 24,
                    label: 'cron表达式',
                    labelWidth: 100,
                    rules: {
                        required: true,
                    },
                    linkage: true,
                    relys: [{
                            essential: false,
                            relyKey: 'jobType',
                            relyValue: 0
                        },
                        {
                            essential: false,
                            relyKey: 'group',
                            relyValue: 'SYSTEM'
                        },
                    ]

                }, {
                    name: 'retry',
                    type: 'text',
                    span: 24,
                    label: '重试次数',
                    labelWidth: 100,
                }]
            ],
            dynamicOnem: [
                [{
                    name: '_parameter_topic',
                    type: 'select',
                    span: 24,
                    label: '主题名称',
                    labelWidth: 100,
                    clearable: false,
                    textField: 'name',
                    valField: 'id',
                    dataUrl: this.ip+'/resource/metadata/basic/topic/list',
                    headers:this.headers,
                    param: {
                        projectId: 1
                    },
                    rules: {
                        required: true,
                        type: 'number'
                    }
                }]
            ],
            reflashDynamicOnem: true,
            dynamicTwo: [
                [{
                        name: 'topic',
                        type: 'text',
                        disabled: true,
                        span: 24,
                        label: '主题',
                    },
                    {
                        name: 'sql',
                        type: 'codeEditor',
                        span: 24,
                        label: 'SQL语句',
                        showAction: true,
                        height: '300px',
                        rules: {
                            required: true,
                        },
                    }
                ]
            ],
            editorId: '',
            close2: false,
            tableOptions2: {},
            tableOptions3: {},
            cronName: '',
            jobId: '',
            close3: false,
            close4: false,
            errorMsg: '',
            errorMsgjson: '',
            erroclose: false, //错误信息显示
            dynamicThree: [
                [{
                    name: 'date',
                    type: 'datetimerange',
                    span: 24,
                    placeholder: '时间',
                    noLabel: true,
                    format: 'yyyy-MM-dd'
                }]
            ],
            date: [],
            lineXdata: [],
            lineValue: [],
            lineValue2: [],
            loading: false,
            loading3: false,
            updateItem: {}

        }
    },
    created() {
        this.tableOptions = {
            selection: [],
            pageSize: 20,
            labelWidth: 70,
            title: '定时任务',
            permsPrefix: 'scheduler:job',
            // editOptions: tableEditOptions,
            dataUrl: this.ip + '/job-schedule/scheduler/job/list',
            // dataUrlType: 'get',
            // createUrl: '/dg/serviceConfig/create',
            deleteUrl: this.ip + '/job-schedule/scheduler/job/delete',
            // updateUrl: '/dg/serviceConfig/update',
            hiddenEdit: true,
            showAction: false,
            headers:this.headers,
            param: {topicId:this.topicId,group:this.group},
            columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    key: 'projectId',
                    title: '所属项目',
                    align: 'center',
                    queryEnum: {
                        url: this.ip+'/admin/api/sys/project/list'
                    },
                    minWidth: 110
                },
                {
                    key: 'topicName',
                    title: '所属主题',
                    align: 'center',
                    minWidth: 110
                },
                {
                    key: 'group',
                    title: '任务组',
                    align: 'left',
                    render: (h, params) => {
                        // <Icon type="ios-alert-outline" />
                        if (params.row.group == 'JDBC') {
                            return h('Poptip', {
                                style: {
                                    cursor: 'default',
                                },
                                attrs: {
                                    trigger: 'hover',
                                    placement: 'right'
                                }
                            }, [
                                h('span', params.row.group),
                                h('Icon', {
                                    attrs: {
                                        type: 'ios-alert-outline'
                                    }
                                }),
                                h('div', {
                                    style: 'max-width:800px;overflow:auto',
                                    on: {
                                        slot: 'content'
                                    },
                                    slot: 'content'
                                }, [h('span', 'topic: '), h('span', {
                                        style: {
                                            color: 'rgb(20, 136, 20)'
                                        }
                                    }, params.row.propertiesMap._parameter_topic), h('br'),
                                    h('span', 'sql: '), h('span', {
                                        style: {
                                            color: 'rgb(20, 136, 20)'
                                        }
                                    }, params.row.propertiesMap._parameter_sql)
                                ])
                            ]);
                        } else {
                            return h('span', params.row.group)
                        }
                    },
                    minWidth:110
                },
                {
                    key: 'name',
                    title: '任务名称',
                    align: 'left',
                    minWidth:110,
                    tooltip:true
                },
                {
                    key: 'cronExpression',
                    title: '执行表达式',
                    align: 'left',
                    minWidth:120
                },
                {
                    key: 'cronExpressionChinese',
                    title: '执行表达式中文',
                    align: 'left',
                    minWidth:150,
                    tooltip:true
                },
                {
                    key: 'jobTypeName',
                    title: '任务类型',
                    align: 'left',
                    minWidth:110,
                },
                {
                    key: 'stage',
                    title: '任务状态',
                    align: 'left',
                    minWidth:110,
                    render: (h, params) => {
                        let title = params.row.stage == 'NORMAL' ? '运行' : params.row.stage == 'PAUSED' ? '暂停' : params.row.stage == 'ERROR' ? '错误' : '未知状态'
                        let color = params.row.stage == 'NORMAL' ? '#19BE6B' : params.row.stage == 'PAUSED' ? '#FF9900' : params.row.stage == 'ERROR' ? '#ED4014' : '#C8C8C8'
                        return h('div', {
                            style: {
                                color
                            }
                        }, title);
                    }
                },
                // {
                //     key: 'retry',
                //     title: '重试次数',
                //     align: 'left',
                // },
                // {
                //     key: 'topic',
                //     title: '主题名称',
                //     align: 'left',
                // },
                // {
                //     key: 'sql',
                //     title: 'sql语句',
                //     align: 'left',
                // },
                { //没有该字段 显示所有默认按钮
                    title: '操作',
                    width: '180',
                    columns: [{
                            name: '编辑',
                            collapse: true,
                            click: (params) => {
                                console.log('编辑')
                                if (params.row.group == 'SYSTEM') {
                                    this.$set(this.dynamicOne[0][3], 'disabled', true)
                                } else {
                                    this.$set(this.dynamicOne[0][3], 'disabled', false)
                                    this.$set(this.dynamicOnem[0][0], 'param', {
                                        projectId: params.row.projectId
                                    })
                                }
                                if(params.row.group == 'JDBC'){
                                    let topic = params.row.propertiesMap._parameter_topic ? parseInt(params.row.propertiesMap._parameter_topic) : ''
                                    this.$set(this.dynamicOnem[0][0], 'value', topic)
                                    this.reflashDynamicOnem = false
                                    setTimeout(() => {
                                        this.reflashDynamicOnem = true
                                    }, 10)
                                }else{
                                    this.reflashDynamicOnem = false
                                }
                                this.close = true
                                this.editorId = params.row.id
                                this.updateItem = params.row
                                this.getForm(params.row.id, params.row.propertiesMap)
                                this.$nextTick(() => {
                                    if (!params.row.jobType)
                                        params.row.jobType = 0
                                    this.$refs.dynamicOne.setFormData(params.row)
                                })
                            }
                        }, {
                            name: '日志',
                            collapse: true,
                            colorData: {},
                            click: (params) => {
                                console.log('日志')
                                this.jobId = params.row.id
                                this.date = []
                                this.$set(this.tableOptions2, 'param', {
                                    jobId: params.row.id
                                })
                                this.cronName = params.row.name
                                this.$nextTick(() => {
                                    this.close2 = true
                                    this.close3 = false
                                })
                            }
                        },
                        {
                            name: '触发',
                            // colorData:OperatorUtils.getPermsData().contains('scheduler:job:trigger')?{}:{key:'nokey',value:'nono'},
                            // showData:{key:'serviceStatus',value:1},//对应key值和value值相等才显示该按钮 (新增 2019-11-14)
                            // colorData:{key:'serviceStatus',value:1},//对应key值和value值相等 按钮颜色为可点击 (新增 2019-11-14)
                            colorDatas: [{
                                    key: 'stage',
                                    value: 'NORMAL'
                                },
                                {
                                    key: 'stage',
                                    value: 'PAUSED'
                                },
                                {
                                    key: 'stage',
                                    value: 'ERROR'
                                },
                                {
                                    key: 'jobType',
                                    value: 0,
                                    essential: true
                                }
                            ],
                            click: (params) => {
                                this.trigger(params.row.id)
                            }
                        },
                        {
                            name: '暂停',
                            // collapse:true,//为true时 该按钮会在下拉菜单里(新增 2019-11-07)
                            colorDatas: [{
                                key: 'stage',
                                value: 'NORMAL'
                            }],
                            click: (params) => {
                                this.reStop(params.row.id)
                            }
                        }, {
                            name: '重新开始',
                            // collapse:true,
                            colorDatas: [{
                                    key: 'stage',
                                    value: 'PAUSED'
                                },
                                {
                                    key: 'stage',
                                    value: 'ERROR'
                                },
                            ],
                            click: (params) => {
                                this.reStart(params.row.id)
                            }
                        }
                    ],
                }
            ],
            showSearch:this.topicId===''?true:false,
            searchDynamic: [
                [{
                        name: 'projectId',
                        type: 'select',
                        span: 6,
                        label: '所属项目',
                        valField: 'id',
                        textField: 'name',
                        dataUrl: this.ip+'/admin/api/sys/project/list',
                        headers:this.headers,
                        param: {
                            sortField: 'id',
                            sortOrder: 'asc'
                        }
                    }, {
                        name: 'name',
                        type: 'text',
                        span: 6,
                        label: '任务名称'
                    },
                    {
                        name: 'group',
                        label: '任务组',
                        span: 6,
                        type: 'text',
                    }
                ]
            ]
        }
        this.tableOptions2 = {
            selection: [],
            pageSize: 20,
            labelWidth: 70,
            title: '日志',
            permsPrefix: 'role',
            // editOptions: tableEditOptions,
            dataUrl: this.ip + '/job-schedule/scheduler/logs/summary',
            dataUrlType: 'get',
            // createUrl: '/dg/serviceConfig/create',
            // deleteUrl: this.ip+'/job-schedule/scheduler/job/delete',
            // updateUrl: '/dg/serviceConfig/update',
            hiddenEdit: true,
            showAction: false,
            height: 600,
            param: {
                jobId: 'SYSTEM_i_d_TTLScheduleLogs'
            },
            headers:this.headers,
            columns: [
                // {
                //     type: 'selection',
                //     width: 50,
                //     align: 'center'
                // },
                {
                    key: 'jobGroup',
                    title: '任务组',
                    align: 'left',
                },
                {
                    key: 'jobName',
                    title: '任务名称',
                    align: 'left',
                },
                {
                    key: 'startTime',
                    width: 200,
                    title: '开始时间',
                    align: 'left',
                },
                {
                    key: 'endTime',
                    width: 200,
                    title: '结束时间',
                    align: 'left',
                },
                {
                    key: 'state',
                    title: '任务状态',
                    align: 'left',
                    render: (h, params) => {
                        let title = params.row.state == 1 ? '处理中' :
                            params.row.state == 2 ? '成功' :
                            params.row.state == 3 ? '更新状态失败' :
                            params.row.state == 4 ? '失败' :
                            params.row.state == 5 ? '取消' :
                            params.row.state == 7 ? '重试失败' :
                            '未知状态'
                        let color = params.row.state == 1 ? '#587C0C' :
                            params.row.state == 2 ? '#19BE6B' :
                            params.row.state == 3 ? '#ED4014' :
                            params.row.state == 4 ? '#ED4014' :
                            params.row.state == 5 ? '#C8C8C8' :
                            params.row.state == 5 ? '#ED4014' :
                            '#C8C8C8'
                        return h('div', {
                            style: {
                                color
                            }
                        }, title);
                    }
                },
                { //没有该字段 显示所有默认按钮
                    title: '操作',
                    width: '160',
                    columns: [{
                        name: '详情',
                        colorDatas: [{
                            key: 'jobGroup',
                            value: 'JDBC'
                        }, {
                            key: 'jobGroup',
                            value: 'STREAM'
                        }],
                        click: (params) => {
                            if (params.row.jobGroup == 'STREAM') {
                                this.$refs.streamLog.init(params.row)
                                return
                            }
                            if (params.row.context && typeof params.row.context == 'string') {
                                let cacherrorMsgjson = []
                                if (params.row.errors) {
                                    this.erroclose = true
                                    for (let i = 0; i < params.row.errors.length; i++) {
                                        cacherrorMsgjson.push('报错信息' + (i + 1) + ":", params.row.errors[i])
                                    }
                                } else {
                                    this.erroclose = false
                                }
                                console.log(cacherrorMsgjson, "循环放出")
                                this.errorMsg = params.row.context
                                this.errorMsgjson = cacherrorMsgjson.join("")
                                console.log(this.errorMsgjson, "详情")
                                let start = new Date(params.row.startTime).getTime() / 1000
                                let end = new Date().getTime() / 1000
                                if (params.row.endTime)
                                    end = new Date(params.row.endTime).getTime() / 1000
                                let obj = JSON.parse(params.row.context)
                                let id = obj.jobId
                                this.query_range(id, start, end)
                            } else this.errorMsg = ''
                            this.$nextTick(() => {
                                this.close3 = true
                            })
                        }
                    }, {
                        name: '重试任务日志',
                        colorDatas: [{
                            key: 'state',
                            value: 7
                        }],
                        click: (params) => {
                            this.$set(this.tableOptions3, 'param', {
                                id: params.row.id
                            })
                            this.$nextTick(() => {
                                this.close4 = true
                            })
                        }
                    }],
                }
            ],
            searchDynamic: [
                []
            ],
            showSearch: false
        }
        this.tableOptions3 = {
            selection: [],
            pageSize: 20,
            labelWidth: 70,
            title: '日志',
            permsPrefix: 'role',
            // editOptions: tableEditOptions,
            dataUrl: this.ip + '/job-schedule/scheduler/logs/retryLogs',
            dataUrlType: 'get',
            // createUrl: '/dg/serviceConfig/create',
            // deleteUrl: this.ip+'/job-schedule/scheduler/job/delete',
            // updateUrl: '/dg/serviceConfig/update',
            hiddenEdit: true,
            showAction: false,
            param: {
                id: ''
            },
            headers:this.headers,
            columns: [
                // {
                //     type: 'selection',
                //     width: 50,
                //     align: 'center'
                // },
                {
                    key: 'maxRetry',
                    title: '重试次数',
                    align: 'left',
                },
                {
                    key: 'currentRetry',
                    title: '当前重试',
                    align: 'left',
                },
                {
                    key: 'startTime',
                    title: '开始时间',
                    align: 'left',
                },
                {
                    key: 'endTime',
                    title: '结束时间',
                    align: 'left',
                },
                // {
                //     key: 'stateName',
                //     title: '状态',
                //     align: 'left',

                // },
                {
                    key: 'state',
                    title: '任务状态',
                    align: 'left',
                    render: (h, params) => {
                        let title = params.row.state == 1 ? '处理中' :
                            params.row.state == 2 ? '成功' :
                            params.row.state == 3 ? '更新状态失败' :
                            params.row.state == 4 ? '失败' :
                            params.row.state == 5 ? '取消' :
                            '未知状态'
                        let color = params.row.state == 1 ? '#587C0C' :
                            params.row.state == 2 ? '#19BE6B' :
                            params.row.state == 3 ? '#ED4014' :
                            params.row.state == 4 ? '#ED4014' :
                            params.row.state == 5 ? '#C8C8C8' :
                            '#C8C8C8'
                        return h('div', {
                            style: {
                                color
                            }
                        }, title);
                    }
                },
                {
                    key: 'context',
                    title: '详情',
                    align: 'left',
                    tooltip: true
                }
            ],
            searchDynamic: [
                []
            ],
            showSearch: false
        }
    },
    mounted() {
        this.schedulerGroup()
    },
    methods: {
        search(name, group) {
            console.log(name)
            this.showView = false
            setTimeout(() => {
                this.tableOptions = {
                    selection: [],
                    pageSize: 20,
                    labelWidth: 70,
                    title: '定时任务',
                    permsPrefix: 'role',
                    // editOptions: tableEditOptions,
                    dataUrl: this.ip + '/job-schedule/scheduler/job/list',
                    // dataUrlType: 'get',
                    // createUrl: '/dg/serviceConfig/create',
                    deleteUrl: this.ip + '/job-schedule/scheduler/job/delete',
                    // updateUrl: '/dg/serviceConfig/update',
                    hiddenEdit: true,
                    showAction: false,
                    param: {
                        name,
                        group
                    },
                    headers:this.headers,
                    columns: [{
                            type: 'selection',
                            width: 50,
                            align: 'center'
                        },
                        {
                            key: 'group',
                            title: '任务组',
                            align: 'left',
                            render: (h, params) => {
                                // <Icon type="ios-alert-outline" />
                                if (params.row.group == 'JDBC') {
                                    return h('Poptip', {
                                        style: {
                                            cursor: 'default',
                                        },
                                        attrs: {
                                            trigger: 'hover',
                                            placement: 'right'
                                        }
                                    }, [
                                        h('span', params.row.group),
                                        h('Icon', {
                                            attrs: {
                                                type: 'ios-alert-outline'
                                            }
                                        }),
                                        h('div', {
                                            on: {
                                                slot: 'content'
                                            },
                                            slot: 'content'
                                        }, [h('span', 'topic: '), h('span', {
                                                style: {
                                                    color: 'rgb(20, 136, 20)'
                                                }
                                            }, params.row.propertiesMap._parameter_topic), h('br'),
                                            h('span', 'sql: '), h('span', {
                                                style: {
                                                    color: 'rgb(20, 136, 20)'
                                                }
                                            }, params.row.propertiesMap._parameter_sql)
                                        ])
                                    ]);
                                } else {
                                    return h('span', params.row.group)
                                }
                            }
                        },
                        {
                            key: 'name',
                            title: '任务名称',
                            align: 'left',
                        },
                        {
                            key: 'cronExpression',
                            title: '执行表达式',
                            align: 'left',
                        },
                        {
                            key: 'stage',
                            title: '任务状态',
                            align: 'left',
                            render: (h, params) => {
                                let title = params.row.stage == 'NORMAL' ? '运行' : params.row.stage == 'PAUSED' ? '暂停' : params.row.stage == 'ERROR' ? '错误' : '未知状态'
                                let color = params.row.stage == 'NORMAL' ? '#19BE6B' : params.row.stage == 'PAUSED' ? '#FF9900' : params.row.stage == 'ERROR' ? '#ED4014' : '#C8C8C8'
                                return h('div', {
                                    style: {
                                        color
                                    }
                                }, title);
                            }
                        },
                        // {
                        //     key: 'retry',
                        //     title: '重试次数',
                        //     align: 'left',
                        // },
                        // {
                        //     key: 'topic',
                        //     title: '主题名称',
                        //     align: 'left',
                        // },
                        // {
                        //     key: 'sql',
                        //     title: 'sql语句',
                        //     align: 'left',
                        // },
                        { //没有该字段 显示所有默认按钮
                            title: '操作',
                            width: '180',
                            columns: [{
                                    name: '编辑',
                                    collapse: true,
                                    click: (params) => {
                                        console.log('编辑')
                                        this.close = true
                                        this.editorId = params.row.id
                                        this.getForm(params.row.id, params.row.propertiesMap)
                                        this.$nextTick(() => {
                                            this.$refs.dynamicOne.setFormData(params.row)
                                        })
                                    }
                                }, {
                                    name: '日志',
                                    collapse: true,
                                    click: (params) => {
                                        console.log('日志')
                                        this.jobId = params.row.id
                                        this.date = []
                                        this.$set(this.tableOptions2, 'param', {
                                            jobId: params.row.id
                                        })
                                        this.cronName = params.row.name
                                        this.$nextTick(() => {
                                            this.close2 = true
                                            this.close3 = false
                                        })
                                    }
                                },
                                {
                                    name: '触发',
                                    // showData:{key:'serviceStatus',value:1},//对应key值和value值相等才显示该按钮 (新增 2019-11-14)
                                    // colorData:{key:'serviceStatus',value:1},//对应key值和value值相等 按钮颜色为可点击 (新增 2019-11-14)
                                    colorDatas: [{
                                            key: 'stage',
                                            value: 'NORMAL'
                                        },
                                        {
                                            key: 'stage',
                                            value: 'PAUSED'
                                        },
                                        {
                                            key: 'stage',
                                            value: 'ERROR'
                                        }
                                    ],
                                    click: (params) => {
                                        this.trigger(params.row.id)
                                    }
                                },
                                {
                                    name: '暂停',
                                    // collapse:true,//为true时 该按钮会在下拉菜单里(新增 2019-11-07)
                                    colorDatas: [{
                                        key: 'stage',
                                        value: 'NORMAL'
                                    }],
                                    click: (params) => {
                                        this.reStop(params.row.id)
                                    }
                                }, {
                                    name: '重新开始',
                                    // collapse:true,
                                    colorDatas: [{
                                            key: 'stage',
                                            value: 'PAUSED'
                                        },
                                        {
                                            key: 'stage',
                                            value: 'ERROR'
                                        },
                                    ],
                                    click: (params) => {
                                        this.reStart(params.row.id)
                                    }
                                }
                            ],
                        }
                    ],
                    searchDynamic: [
                        [{
                                name: 'name',
                                type: 'text',
                                span: 6,
                                value: name,
                                label: '任务名称'
                            },
                            {
                                name: 'group',
                                label: '任务组',
                                span: 6,
                                value: group,
                                type: 'text'
                            }
                        ]
                    ]
                }
                this.showView = true
            }, 10)
        },
        onVchange(status) {
            if (status) {
                document.body.style.overflow = 'auto'
            }
        },
        //重新开始任务
        reStart(id) {
            let url = this.ip + '/job-schedule/scheduler/job/resume',
                params = {
                    id
                }
            this.$http.apiPost(url, params,{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        this.$Message.success('已重新开始任务')
                        this.$refs.crudView.refreshTable()
                    } else {
                        this.$Massege.error(res.message)
                    }
                })
        },
        //暂停任务
        reStop(id) {
            let url = this.ip + '/job-schedule/scheduler/job/pause',
                params = {
                    id
                }
            this.$http.apiPost(url, params,{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        this.$Message.success('已暂停任务')
                        this.$refs.crudView.refreshTable()
                    } else {
                        this.$Massege.error(res.message)
                    }
                })
        },
        //触发任务
        trigger(id) {
            let url = this.ip + '/job-schedule/scheduler/job/trigger',
                params = {
                    id
                }
            this.$http.apiPost(url, params,{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        this.$Message.success('已触发任务')
                        this.$refs.crudView.refreshTable()
                    } else {
                        this.$Massege.error(res.message)
                    }
                })
        },
        //获取任务分组
        schedulerGroup() {
            this.$http.apiGet(this.ip + '/job-schedule/constant/schedulerGroup',{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        let arr = []
                        for (let a of res.data.rows) {
                            arr.push({
                                label: a,
                                value: a
                            })
                        }
                        this.$set(this.dynamicOne[0][2], 'data', arr)
                    }
                })
        },
        //编辑保存任务
        updateJob() {
            this.$refs.dynamicOne.submit(params => {
                console.log(params)
                console.log(this.dynamicTwo)
                let config = {
                    headers: {
                        'Content-Type': 'application/json',
                        ...this.headers
                    }
                }
                if (params.group == 'JDBC') {
                    let _parameter_topic
                    this.$refs.dynamicOnem.submit(params3 => {
                        _parameter_topic = params3._parameter_topic
                        if (this.dynamicTwo.length > 0) {
                            this.$refs.dynamicTwo.submit(params2 => {
                                console.log(params2)
                                let obj = {
                                    id: this.editorId,
                                    jobType: params.jobType,
                                    cronExpression: params.cronExpression,
                                    retry: params.retry
                                }
                                params2._parameter_topic = _parameter_topic
                                obj = Object.assign(obj, {
                                    propertiesMap: params2
                                })
                                this.$http.apiPostJson(this.ip + '/job-schedule/scheduler/job/update', obj, config)
                                    .then(res => {
                                        if (res.success) {
                                            this.$Message.success('保存成功!')
                                            this.close = false
                                            this.$refs.crudView.refreshTable()

                                        } else {
                                            this.$Message.error(res.message)
                                        }
                                    })
                            })
                        }
                    })
                } else if (params.group == 'STREAM' || params.group == 'SYSTEM') {
                    let obj = {
                        id: this.editorId,
                        projectId: params.projectId,
                        cronExpression: params.cronExpression,
                        retry: params.retry
                    }
                    if (params.group == 'STREAM') {
                        obj.propertiesMap = this.updateItem.propertiesMap
                        obj.propertiesMap._parameter_cronExpression = params.cronExpression
                    }
                    this.$http.apiPostJson(this.ip + '/job-schedule/scheduler/job/update', obj, config)
                        .then(res => {
                            if (res.success) {
                                this.$Message.success('保存成功!')
                                this.close = false
                                this.$refs.crudView.refreshTable()
                            } else {
                                this.$Message.error(res.message)
                            }
                        })
                }
            })
            // this.$http.apiPost(this.ip+'/job-schedule/scheduler/job/update')
        },
        //获取表单
        getForm(name, propertiesMap) {
            this.dynamicTwo = []
            this.$refs.dynamicTwo.setFormData({})
            let group = 'JOB_SCHEDULE_' + name
            this.$http.apiGet(this.ip + '/resource/getform?group=' + group,{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        if (res.data.rows) {
                            this.dynamicTwo = [res.data.rows]
                            this.$nextTick(() => {
                                console.log(propertiesMap)
                                this.$refs.dynamicTwo.setFormData(propertiesMap)
                            })
                        }
                    } else {
                        this.$Message.error(res.message)
                    }
                })
        },
        searchCrud2() {
            if (this.date) {
                let startTime = new Date(this.date[0]).format('yyyy-MM-dd')
                let endTime = new Date(this.date[1]).format('yyyy-MM-dd')
                this.$set(this.tableOptions2, 'param', {
                    jobId: this.jobId,
                    startTime: startTime + ' 00:00:00',
                    endTime: endTime + ' 00:00:00'
                })
                this.$nextTick(() => {
                    this.$refs.crudView2.refreshTable()
                })
            }
        },
        //获取运行情况
        query_range(id, startb, endb) {
            this.loading = true
            this.lineXdata = []
            this.lineValue = []
            this.lineValue2 = []
            let lineXdata = []
            let lineXdata2 = []
            let lineValue = []
            let start = startb - 60
            let end = ((endb + 60 - start) > 3600) ? (startb + 3660) : (endb + 60)
            let sstart = start
            for (; sstart <= end; sstart++) {
                let date = new Date(sstart * 1000)
                lineXdata.push(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds())
                lineXdata2.push(sstart)
                lineValue.push('')
            }
            this.lineXdata = lineXdata
            this.$http.apiGet(this.ip + '/api/v1/query_range?', {
                    params: {
                        // query: 'flink_taskmanager_job_task_operator_numRecordsOut{operator_name="~"Sink:_.*""}',
                        query: 'flink_taskmanager_job_task_operator_numRecordsIn{job_id="' + id + '",operator_name=~"Sink:_.*"}',
                        start: start,
                        end: end,
                        step: 1,
                        _: new Date().getTime()
                    },
                    headers:this.headers
                })
                .then(res => {
                    this.loading = false
                    if (res.status == 'success') {
                        if (res.data.result.length > 0) {
                            let lineValue = []
                            for (let a of res.data.result[0].values) {
                                if (lineXdata2.indexOf(a[0]) > -1) {
                                    lineValue[lineXdata2.indexOf(a[0])] = a[1]
                                }

                            }
                            this.lineValue = lineValue
                            console.log(lineValue)
                        }
                    }
                })
                .finally(() => {
                    this.loading = false
                })
            this.$http.apiGet(this.ip + '/api/v1/query_range?', {
                    params: {
                        // query: 'flink_taskmanager_job_task_operator_numRecordsOut{operator_name="~"Sink:_.*""}',
                        query: 'flink_taskmanager_job_task_operator_numRecordsInPerSecond{job_id="' + id + '",operator_name=~"Sink:_.*"}',
                        start: start,
                        end: end,
                        step: 1,
                        _: new Date().getTime()
                    },
                    headers:this.headers
                })
                .then(res => {
                    this.loading = false
                    if (res.status == 'success') {
                        if (res.data.result.length > 0) {
                            let lineValue = []
                            for (let a of res.data.result[0].values) {
                                if (lineXdata2.indexOf(a[0]) > -1) {
                                    lineValue[lineXdata2.indexOf(a[0])] = a[1]
                                }

                            }
                            this.lineValue2 = lineValue
                            console.log(lineValue)
                        }
                    }
                })
                .finally(() => {
                    this.loading = false
                })

        }
    },
    watch: {
        close3() {
            if (this.close3)
                this.$set(this.tableOptions2, 'height', 300)
            else
                this.$set(this.tableOptions2, 'height', 600)

        }
    },
    components: {
        CrudView,
        DataTree,
        FormDynamic,
        AceEditor,
        ChartLine,
        ChartDoubleLine,
        streamLog
    }
}
</script>
