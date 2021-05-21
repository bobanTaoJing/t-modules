<template>
<Modal title="定时执行" v-model="close2" :width="800" :styles="{top: '20px'}">
    <FormDynamic ref="dynamicOne" :data="dynamicOne" :label-width="100">
        <template slot="append"></template>
    </FormDynamic>
    <div style="width:768px;height:400px">
        <editor ref="editor" v-if="close2" :checked="item" :onlyRead="true"></editor>
    </div>
    <div slot="footer">
        <Button type="primary" :loading="loading2" @click="setTimeRw">提交</Button>
    </div>
</Modal>
</template>

<script>
import {
    CrudView,
    DataTree,
    FormDynamic,ChartDoubleLine
} from '../../../../components/';
import editor from '../../../../components/g6-editor/App.vue'
export default {
    components:{FormDynamic,editor},
    data() {
        return {
            item:{},
            close2:false,
            loading2:false,
            dynamicOne: [
                [
                    // {
                    //     name:'sql',
                    //     hidden:true
                    // },
                    {
                        label: "任务名称",
                        name: "name",
                        type: "text",
                        rules: {
                            required: true
                        }
                    },
                    {
                        label: "任务分组",
                        name: "group",
                        type: "text",
                        disabled: true,
                        rules: {
                            required: true
                        },
                        value: "STREAM"
                    },
                    {
                        label: "任务类型",
                        name: "jobType",
                        type: "select",
                        labelWidth: 100,
                        data: [{
                                label: "定时任务",
                                value: 0
                            },
                            {
                                label: "常驻任务",
                                value: 1
                            }
                        ],
                        rules: {
                            required: true,
                            type: "number"
                        },
                        value: 0
                    },
                    {
                        label: "cron表达式",
                        name: "cronExpression",
                        type: "cron",
                        rules: {
                            required: true
                        },
                    },
                ]
            ],
        }
    },
    methods: {
        init(item){
            this.item = item
            this.close2 = true
        },
        setTimeRw() {
            console.log('in')
            this.$refs.dynamicOne.submit(params => {
                this.loading2 = true;
                let obj = {
                    propertiesMap: {
                        streamConfigId:this.item.id,//流程id
                        jobType: params.jobType, //任务类型
                        cronExpression: params.cronExpression,
                        retry: null, //
                    },
                    projectId:this.item.projectId
                };
                let config = {
                    headers: {
                        "Content-Type": "application/json"
                    }
                };
                this.$http
                    .apiPostJson(
                        window.IPS.ip + "/job-schedule/scheduler/job/add",
                        Object.assign(obj, params),
                        config
                    )
                    .then(res => {
                        this.loading2 = false;
                        if (res.success) {
                            this.close2 = false;
                            this.$Message.success("提交成功");
                            this.$emit(
                                "submit",
                                Object.assign({
                                        duration: res.data.duration,
                                        type: "定时任务",
                                        result: "成功",
                                        action: params.sql
                                    },
                                    params
                                )
                            );
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
            });
        }
    }
}
</script>
