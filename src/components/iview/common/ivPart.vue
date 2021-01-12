<style>
    .ivPart-item{
        width:100%
    }
</style>
<template>
    <div :style="'min-width:'+param.minWidth?param.minWidth:'100px'">
        <template v-if="param.type=='input_text'">
            <Input v-model="param.value" @on-enter="getData" :placeholder="param.placeholder" class="ivPart-item"/>
        </template>
        <template v-else-if="param.type=='select'">
            <Select v-model="param.value" @on-change="getData" :placeholder="param.placeholder" :clearable="true">
                <Option v-for="item in param.data"
                    :value="item.value" :key="item.value">{{ item.name }}</Option>
            </Select>
        </template>
        <template v-else-if="param.type=='DatePicker'">
            <DatePicker v-model="param.value" @on-change="getData" :format="param.format" :type="param.type2" placement="bottom-start" :placeholder="param.placeholder" class="ivPart-item"></DatePicker>
        </template>
    </div>
</template>
<script>
export default {
    props:{
        param:{
            type:Object,
            default:function(){
                return {}
            }
        },
        //控件值改变或回车触发查询时间
        triggerGetData:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        getData(){
            if(this.triggerGetData){
                this.$emit('getData')
            }
        }
    }
}
</script>