let tTableData = `let data = {
    columns: [{//必须
            title: 'test',
            key: 'test',
            width: 100,
            html:(param)=>{
                //return '<span>'+param.test+'</span>'
                return \`<span>\${param.test}</span>\`
            },
            click:(param)=>{
                console.log(param)
            }
        },
        {
            title: 'test2',
            key: 'test2',
            width: 100
        },
        {
            title: 'test3',
            key: 'test3',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
        {
            title: 'test4',
            key: 'test4',
            width: 100
        },
        {
            title: 'test5',
            key: 'test5',
            width: 100
        },
    ],
    data:(()=>{
        let arr = []
        for(let i=0;i<100;i++){
            arr.push({
            test: 'test',
            test2: 'test2',
            test3: 'test3',
            test4: 'test4',
            test5: 'test6'
        })
        }
        return arr
    })(),
    height: 800,
    headerStyle:{
        color:'#000',
        bgColor:'#fff',
        size:16,
        weight:600
    },
    bodyStyle:{
        color:'#000',
        bgColor:'#fff',
        size:14,
        weight:300
    }
}`
let crudViewData = {
    template:`<CrudView ref='crudView' :tableOptions='tableOptions'>
    <!-- 数据源连接 -->
    <template slot="toolbar">
        <i-button ghost type='primary' shape="circle">自定义按钮</i-button>
    </template>
</CrudView>`,
    data:`let data = {
        tableOptions: {
            selection: [],
            pageSize: 20,
            title: '服务配置',
            height:700,
            data:[{name:'test'}],
            editOptions:{
                // editPage: true,
                width: 1200,
                labelWidth: 90,
                title: '服务',
                showAction: true,
                dynamic: [
                    [{
                            name: 'id',
                            hidden: true
                        },
                        {
                            name: 'name',
                            type: 'text',
                            span: 12,
                            label: '服务名称',
                            rules: {
                                required: true,
                                // validatorSimp:{res:/^w*$/,msg:'限 0-9、a-z、A-Z、_ 符号'}
                            }
                        },
                        {
                            name: 'serviceClasses',
                            type: 'treeSelect',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/serviceCatalog/list',
                            param:{status:1},
                            span: 12,
                            label: '所属目录',
                            expandAll: true,
                            // constructTree:false,
                            textField:'name',
                            valField:'id',
                            rules: {
                                required: true,type:'number'
                            }
                        },
                        // {
                        //     name: 'themeCatalogs',
                        //     type: 'treeSelect',
                        //     // dataUrl: '/dg/serviceCatalog/list',
                        //     span: 12,
                        //     label: '主题目录',
                        //     expandAll: true,
                        //     multiple: true,
                        //     selfData:[{id:17,title:'主题目录',disabled:true,expand:true}],
                        //     // constructTree:false,
                        //     placeholder:'请选择,可以多选',
                        //     textField:'name',
                        //     valField:'id',
                        // },
                        {
                            name: 'serviceName',
                            type: 'text',
                            span: 12,
                            label: '服务编码',
                            rules: {
                                required: true
                            }
                        },
                        // {
                        //     name:'test',
                        //     type:'imgUpload',
                        //     span:24,
                        //     max:5,
                        //     lable:'test',
                        //     uploadFormat:['txt','png']
                        // },
                        {
                            name: 'serviceVersion',
                            type: 'text',
                            span: 12,
                            label: '服务版本',
                            value:'V1',
                            rules: {
                                required: true
                            }
                        },
                        {
                            name: 'protocol',
                            type: 'select',
                            span: 12,
                            label: '服务协议',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/get?type=protocol',
                            textField: 'name',
                            valField: 'code',
                            value:'http',
                            multiple: false,
                            placeholder: '请选择'
                        },
                        {
                            name: 'requestType',
                            type: 'select',
                            span: 12,
                            label: '请求类型',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/get?type=requestType',
                            textField: 'name',
                            valField: 'code',
                            value:'get',
                            multiple: false,
                            placeholder: '请选择'
                        },
                        {
                            name: 'responseType',
                            type: 'select',
                            span: 12,
                            label: '返回值类型',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/get?type=responseType',
                            textField: 'name',
                            valField: 'code',
                            value:'json',
                            multiple: false,
                            placeholder: '请选择'
                        },
                        { //回显不能正常运行的解决办法：https://juejin.im/entry/5964a1c15188250d8b65ef5f
                            name: 'dbId',
                            type: 'select',
                            span: 12,
                            label: '数据源',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/datasource/list',
                            textField: 'name',
                            valField: 'id',
                            multiple: false,
                            placeholder: '请选择'
                        },
                        // {
                        //     name:'test',
                        //     type:'imgUpload',
                        //     max:5,
                        //     span:12,
                        //     uploadFormat:['png','jpg','txt','js']
                        // },
                        {
                            name: 'serviceStatus',
                            openText: '启用',
                            closeText: '禁用',
                            type: 'switch',
                            span: 12,
                            label: '状态',
                            value: 1,
                            trueValue: 1,
                            falseValue: 0,
                            rules: {
                                required: true,
                                type: 'number'
                            },
                        },
                        {
                            name: 'dataManageDbId',
                            type: 'select',
                            span: 12,
                            label: '数据治理数据源',
                            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/datasource/list?simple=true&sourceType=kafka',
                            textField: 'name',
                            valField: 'id',
                            multiple: false,
                            placeholder: '请选择'
                        },
                        {
                            name: 'dataManageTopic',
                            type: 'text',
                            span: 12,
                            label: 'topic',
                            linkageHidden:true,
                            relyKey:'dataManageDbId',
                            relyValue:undefined,
                            rules: {
                                required: true
                            }
                        },
                        {
                            name: 'scsql', 
                            type: 'buttons',  label: '',
                            span:24,
                            data:[
                                {
                                    label:'快速生成sql',
                                    onClick:(params)=>{
                                        this.close = true
                                    }
                                }
                            ]
                        },
                        {
                            name: 'definition',
                            type: 'codeEditor',
                            height: '200px',
                            span: 24,
                            label: '服务定义',
    
                        },
                        {
                            name: 'serviceDesc',
                            type: 'text',
                            textarea: {
                                minRows: 2,
                                maxRows: 3
                            },
                            span: 24,
                            label: '描述'
                        }
                    ]
                ]
            },
            dataUrl: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/serviceConfig/list',
            createUrl: '/create',
            deleteUrl: '/delete',
            updateUrl: '/update',
            showAction: false,
            hiddenEdit: false,
            param: {},
            headers:{
                Authorization:'476dae416b796f807618a8ba96942303',
                // user:'TMR'
            },
            columns: [{
                    type: 'selection',
                    width: 50,
                    align: 'center'
                },
                {
                    key: 'name',
                    title: '服务名称',
                    align: 'left',
                    width: 180,
                    // click: (params) => {
                    //     this.selected = params.row
                    //     this.servicePreviewVisible = true
                    // }
                },
                {
                    key: 'serviceName',
                    title: '服务编码',
                    align: 'left',
                    width: 180
                },
                {
                    key: 'serviceVersion',
                    title: '版本',
                    align: 'left',
                    width: 80
                },
                {
                    key: 'dbId',
                    title: '数据源',
                    align: 'left',
                    width: 120,
                    enum: [],
                    queryEnum: {
                        url: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/datasource/list',
                        param: {}
                    }
                },
                {
                    key: 'serviceClasses',
                    title: '服务类别',
                    align: 'left',
                    width: 100,
                    //enum: [{name: '测试用', id: 1}, {name: '财务', id: 0}, {name: 'CRM系统', id: 2}]
                    enum: [],
                    queryEnum: {
                        url: 'http://data-platform-demo.bobandata.com/data-service-admin/api/dg/serviceCatalog/list',
                        param: {},
                        textField: 'name',
                        valField: 'id'
                    }
                },
                {
                    key: 'protocol',
                    title: '协议',
                    align: 'left',
                    width: 80,
                    enum: [],
                    queryEnum: {
                        url: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/list',
                        param: {},
                        textField: 'name',
                        valField: 'code'
                    }
                },
                {
                    key: 'definition',
                    title: '服务定义',
                    align: 'left',
                    tooltip: true,
                    width: 180
                },
                {
                    key: 'requestType',
                    title: '请求类型',
                    align: 'left',
                    width: 120,
                    enum: [],
                    queryEnum: {
                        url: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/list',
                        param: {},
                        textField: 'name',
                        valField: 'code'
                    }
                },
                {
                    key: 'responseType',
                    title: '返回类型',
                    align: 'left',
                    width: 120,
                    enum: [],
                    queryEnum: {
                        url: 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/dict/list',
                        param: {},
                        textField: 'name',
                        valField: 'code'
                    }
                },
                {
                    key: 'serviceStatus',
                    title: '服务状态',
                    align: 'left',
                    width: 120,
                    enum: [{
                        name: '启用',
                        id: 1
                    }, {
                        name: '禁用',
                        id: 0
                    }]
                },
                {
                    key: 'serviceDesc',
                    title: '描述',
                    align: 'left',
                    width: 120
                },
                { //没有该字段 显示所有默认按钮
                    title: '操作',
                    width: '130',
                    columns: [{
                        name: '文档',
                        collapse: false, //为true时 该按钮会在下拉菜单里(新增 2019-11-07)
                        click: (params) => {
                            this.selected = params.row
                            this.servicePreviewVisible = true
                        }
                    }, 
                    {
                        name: '复制',
                        collapse: false, //为true时 该按钮会在下拉菜单里(新增 2019-11-07)
                        click: (params) => {
                            this.addVisible = true
                            this.$nextTick(()=>{
                                let obj = deepCopy(params.row)
                                obj.name = obj.name+'_copy'
                                this.$refs.dynamic1.setFormData(obj)
                            })
                        }
                    }, 
                    {
                        name: '监控',
                        collapse: true, //为true时 该按钮会在下拉菜单里(新增 2019-11-07)
                        click: (params) => {
                            this.$router.push({
                                path: '/servicemgr/dashboard',
                                query: {
                                    name: params.row.serviceVersion + '/' + params.row.serviceName
                                }
                            });
                            // console.log('监控'+params.row.id+'::'+JSON.stringify(params))
                        }
                    }],
                }
    
            ],
            searchDynamic: [
                [
                    {
                        name: 'serviceName',
                        type: 'text',
                        span: 6,
                        label: '服务编码'
                    },
                    {
                        name: 'name',
                        type: 'text',
                        span: 6,
                        label: '服务名'
                    },
    
                    {
                        name: 'serviceStatus',
                        label: '服务状态',
                        span: 6,
                        type: 'select',
                        data: [{
                            label: '启用',
                            value: 1
                        }, {
                            label: '禁用',
                            value: 0
                        }]
                    }
                ]
            ]
        }
    }`
}
let formDynamicData={
    template:`<FormDynamic :data="dynamic" :label-width="100">
    <template slot="append">
    </template>
</FormDynamic>`,
    data:`let data = {
        dynamic:[
            [{
                name:'data1',
                type:'text',
                span:12,
                label:'输入框',
                tiptext:'提示语',
                rules: {
                    required: false
                }
            },{
                name:'data2',
                type:'number',
                span:12,
                label:'数字输入框',
                rules: {
                    required: false
                }
            },{
                name: 'data3',
                type: 'select',
                span: 24,
                label: '选择框',
                textField: 'title',
                valField: 'id',
                clearable: false,
                data: [{id:1,title:'显示值'}],
                rules: {
                    required: true
                }
            },{
                name:'data4',
                type:'time',
                span:12,
                label:'时间选择器',
                rules: {
                    required: false
                }
            },{
                name:'data5',
                type:'year',
                span:12,
                label:'日期选择器',
                rules: {
                    required: false
                }
            },{
                name:'data6',
                type:'date',
                span:12,
                label:'日期选择器',
                rules: {
                    required: false
                }
            },{
                name:'data7',
                type:'datetime',
                span:12,
                label:'日期选择器',
                rules: {
                    required: false
                }
            },{
                name:'data8',
                type:'datetimerange',
                span:12,
                label:'日期选择器',
                rules: {
                    required: false
                }
            },{
                name:'data9',
                type:'checkbox',
                span:12,
                label:'多选框',
                data:[
                    {label:'选项一',value:'1'},
                    {label:'选项二',value:'2'},
                    {label:'选项三',value:'3'},
                    {label:'选项四',value:'4'}
                    ],
                rules: {
                    required: false
                }
            },{
                name:'data10',
                type:'switch',
                span:12,
                label:'开关',
                openText:'开',
                closeText:'关',
                rules: {
                    required: false
                }
            },{
                name:'data11',
                type:'radio',
                span:12,
                label:'单选',
                data:[
                    {label:'选项一',value:1},
                    {label:'选项二',value:2},
                    {label:'选项三',value:3},
                    {label:'选项四',value:4}
                    ],
                rules: {
                    required: false
                }
            },{
                name:'data12',
                type:'treeSelect',
                span:12,
                label:'选择树',
                data:[
                    {
                        name:'1',
                        title:'1',
                        id:1,
                        children:[
                            {title:'1-1',name:'1-1',id:2},
                            {title:'1-2',name:'1-2',id:3},
                            ]
                    }
                    ],
                rules: {
                    required: false
                }
            },{
                type:'label',
                data:'label',
                span:24
            },{
                name:'data13',
                type:'buttons',
                span:12,
                label:'按钮组',
                data:[
                    {label:'按钮',btnType:'primary',
                        onClick:(param)=>{
                            console.log(param)
                        }
                    },
                    {label:'dashed',btnType:'dashed'},
                    {label:'text',btnType:'text'},
                    {label:'info',btnType:'info'},
                    {label:'success',btnType:'success'},
                    {label:'warning',btnType:'warning'},
                    {label:'error',btnType:'error'}
                    ],
                rules: {
                    required: false
                }
            },{
                name:'data14',
                type:'codeEditor',
                span:24,
                label:'代码编辑器',
                language:'mysql',
                height:'200px',
                rules: {
                    required: false
                }
            },{
                name:'data15',
                type:'VueQuillEditor',
                span:24,
                label:'代码编辑器',
                language:'mysql',
                height:'200px',
                rules: {
                    required: false
                }
            }
            ]
        ]
    }`
}
let editTableData = {
    template :` <EditTable :columns="columns" :deleteTip="deleteTip" :height="height" ref="editTable" style="padding:0;width:100%" :disabled="disabled" :showSerial="showSerial" :showTopd="showTopd">
    <template slot="button">
        <Button style="margin-left:10px;">自定义按钮</Button>
    </template>
</EditTable>`,
    data:`let data = {
        columns:[{
                title: '类型',
                key: 'type',
                type: 'select',
                // width: 100,
                value: 'string',
                data: [{
                        label: 'string',
                        value: 'string'
                    },
                    {
                        label: 'number',
                        value: 'number'
                    },
                    {
                        label: 'array',
                        value: 'array'
                    },
                    {
                        label: 'object',
                        value: 'object'
                    },
                    {
                        label: 'boolean',
                        value: 'boolean'
                    },
                    {
                        label: 'integer',
                        value: 'integer'
                    }
                ]
            },
            {
                title: '参数名称',
                key: 'name',
                required: true,
                // width: 100,
                value: '',
                type: 'input',
            }
        ],
        deleteTip:true,//删除行时，是否需要提示
        height:400,
        disabled:false,//是否禁用添加按钮
        showSerial:true,//是否显示序号
        showTopd:true,//是否显示上限移动按钮
    }`
}
let vsNodeData = {
    template:`<vsNode ref="vsnode" :sourceTable="sourceTable" :targetTable="targetTable" :lines="lines"></vsNode>
<i-button @click="save">保存</i-button>
//save(){
    this.$refs.vsnode.submit(params=>{
        console.log(params)
    })
}`,
    data:`let data={
        sourceTable:{
            columns:[{
                    name:'源表字段',
                    key:'name',
                    width:120,
                },{
                    name:'类型',
                    key:'type',
                    width:80
                }
            ],
            data:[
                {name:'uid',type:'BIGINT'},
                {name:'uname',type:'STRING'},
                {name:'upass',type:'STRING'},
                {name:'width',type:'STRING'},
                {name:'height',type:'STRING'},
            ]
        },
        targetTable:{
            columns:[{
                    name:'目标表字段',
                    key:'name',
                    width:120,
                },{
                    name:'类型',
                    key:'type',
                    width:80
                }
            ],
            data:[
                {name:'uid',type:'BIGINT'},
                {name:'pid',type:'STRING'},
                {name:'upass',type:'STRING'},
                {name:'adre',type:'STRING'},
                {name:'uname',type:'STRING'},
            ]
        },
        lines:[]
    }`
}

let chartSvgData = {
    template:`<div v-for="(item,index) in types" :key="index">
    <chartSvg :type="item.name" :width="item.width" :height="item.height" :color="item.color"/>
    <br>
    <span>{{item.name}}</span>
</div>`,
    data:`let data = {
        types: [
            {
                name:'bar',color:'',width:20,height:20
            },{
                name:'line',color:'red',width:20,height:20
            },{
                name:'pie',color:'',width:20,height:20
            },{
                name:'string',color:'',width:20,height:20
            },{
                name:'date',color:'',width:20,height:20
            },{
                name:'number',color:'',width:20,height:20
            },{
                name:'number2',color:'',width:20,height:20
            },{
                name:'dataservice',color:'',width:20,height:20
            },{
                name:'gement',color:'',width:20,height:20
            },{
                name:'map',color:'',width:20,height:20
            },{
                name:'docx',color:'',width:20,height:20
            },{
                name:'doc',color:'',width:20,height:20
            },{
                name:'xls',color:'',width:20,height:20
            },{
                name:'txt',color:'',width:20,height:20
            },{
                name:'csv',color:'',width:20,height:20
            },{
                name:'annex',color:'',width:20,height:20
            },{
                name:'database',color:'',width:20,height:20
            },{
                name:'dev',color:'',width:20,height:20
            },{
                name:'admin',color:'',width:20,height:20
            },{
                name:'oam',color:'',width:20,height:20
            },{
                name:'mysql',color:'',width:20,height:20
            },{
                name:'draggble',color:'',width:20,height:20
            },{
                name:'help',color:'',width:20,height:20
            },{
                name:'user',color:'',width:20,height:20
            },{
                name:'password',color:'',width:20,height:20
            },{
                name:'equipment',color:'',width:20,height:20
            },{
                name:'line',color:'',width:20,height:20
            },{
                name:'card',color:'',width:20,height:20
            },{
                name:'dataStream',color:'',width:20,height:20
            },{
                name:'nod',color:'',width:20,height:20
            },{
                name:'name',color:'',width:20,height:20
            },{
                name:'search',color:'',width:20,height:20
            },{
                name:'reflash',color:'',width:20,height:20
            },{
                name:'inspection',color:'',width:20,height:20
            },{
                name:'region',color:'',width:20,height:20
            },{
                name:'unit',color:'',width:20,height:20
            },{
                name:'file',color:'',width:20,height:20
            },{
                name:'basic',color:'',width:20,height:20
            },{
                name:'operationManagement',color:'',width:20,height:20
            },{
                name:'terminal',color:'',width:20,height:20
            },{
                name:'expand',color:'',width:20,height:20
            },{
                name:'packUp',color:'',width:20,height:20
            },{
                name:'powerUnit',color:'',width:20,height:20
            },{
                name:'fileManagement',color:'',width:20,height:20
            },{
                name:'caiji',color:'',width:20,height:20
            },{
                name:'xunshi',color:'',width:20,height:20
            },{
                name:'jingxiang',color:'',width:20,height:20
            },{
                name:'jiliangdian',color:'',width:20,height:20
            },{
                name:'filter',color:'',width:20,height:20
            },{
                name:'byq',color:'',width:20,height:20
            },{
                name:'gddw',color:'',width:20,height:20
            },{
                name:'page',color:'',width:20,height:20
            }
        ]
    }`
}

let numberUpData ={
    template:`<NumberUp :startVal="startVal" :endVal="endVal" :color="color" :decimals="decimals" :countSize="countSize" :countWeight="countWeight">
</NumberUp>`,
    data:`let data={
        startVal: 0,//开始值
        endVal: 100,//结束值
        color:'red',
        decimals: 0,//小数点位数
        countSize: 50,//数字fontSize
        countWeight: 700//数字fontWeight
    }`
}

let chartLineData = {
    template:`<ChartLine ref='ChartLine' :loading="loading" :height="height"
    :value="value" :xData="xData" :text="text">
</ChartLine>`,
    data:`let data={
        text:'标题',
        loading: false,
        height:400,
        value:[
            {name:'线一',color:'#91C7AE',
                data:{
                    '周一':120,
                    '周二':132,
                    '周三':101,
                    '周四':134,
                    '周五':90,
                    '周六':230,
                    '周日':210,
                }
            },
            {name:'线二',color:'#D48265',
                data:{
                    '周一':220,
                    '周二':182,
                    '周三':191,
                    '周四':234,
                    '周五':290,
                    '周六':330,
                    '周日':310,
                }
            }
            ],
        textColor:'#000',
        bgColor:'#F3F3F3',
        disHover:false
    }`
}

let chartBarData = {
    template:`<ChartBar v-if="reflash" ref='ChartBar' :loading="loading" :height="height"
    :value="value" :text="text" :textColor="textColor" :bgColor="bgColor" :disHover="disHover">
</ChartBar>`,
    data:`let data={
        text:'标题',
        loading: false,
        height:400,
        value:[
            {name:'柱一',color:'#91C7AE',
                data:{
                    '周一':120,
                    '周二':132,
                    '周三':101,
                    '周四':134,
                    '周五':90,
                    '周六':230,
                    '周日':210,
                }
            },
            {name:'柱二',color:'#D48265',
                data:{
                    '周一':220,
                    '周二':182,
                    '周三':191,
                    '周四':234,
                    '周五':290,
                    '周六':330,
                    '周日':310,
                }
            }
            ],
        textColor:'#000',
        bgColor:'#F3F3F3',
        disHover:false
    }`
}

let chartPieData = {
    template:`<ChartPie v-if="reflash" ref='ChartPie' :loading="loading" :height="height"
    :value="value" :xData="xData" :text="text" :textColor="textColor" :bgColor="bgColor" :disHover="disHover">
</ChartPie>`,
    data:`let data={
        text:'标题',
        loading: false,
        height:400,
        value:[
            {name:'分类1',value:1000},
            {name:'分类2',value:1000},
            {name:'分类3',value:1000},
            ],
        textColor:'#000',
        bgColor:'#F3F3F3',
        disHover:false
    }`
}

let chartMapData = {
    template:`<ChartPie v-if="reflash" ref='ChartPie' :loading="loading" :height="height"
    :value="value" :xData="xData" :text="text" :textColor="textColor" :bgColor="bgColor" :disHover="disHover">
</ChartPie>`,
    data:`let data={
        text:'标题',
        loading: false,
        height:400,
        value:[
            {name:'分类1',value:1000},
            {name:'分类2',value:1000},
            {name:'分类3',value:1000},
            ],
        textColor:'#000',
        bgColor:'#F3F3F3',
        disHover:false
    }`
}

let sqlConfigData = {
    template:`<sqlConfig :ipMenhu="'http://data-platform-demo.bobandata.com'" :ipWuhan="'http://data-platform-demo.bobandata.com'" :Authorization="'7466a7a478fd89afdc79b13cf875500a'">
    </sqlConfig>`,
    data:`let data=''`
}

let flowchartData = {
    template:`<Flowchart :ip="data.ip" :headers="data.headers">
    </Flowchart>`,
    data:`let data={
        ip:'http://portal-test2.bobandata.com',
        headers:{
        Authorization: 'ddcae3deb414af8bb6ef9bf52f1b4624'
        }
    }`
}

export {
    tTableData,crudViewData,formDynamicData,editTableData,vsNodeData,chartSvgData,numberUpData,chartLineData,
    chartBarData,chartPieData,chartMapData,sqlConfigData,flowchartData
}