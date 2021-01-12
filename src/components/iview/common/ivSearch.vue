<template>
    <Row :gutter="10" style="margin:5px">
        <i-col v-for="(item,index) in params" :key="index" :xl="item.span" :lg="item.span+2" :md="item.span*2" :sm="10" :xs="10">
            <ivPart :param="item" @getData="getData" :triggerGetData="true"></ivPart>
        </i-col>
        <i-col :span="2" v-if="params.length>0">
            <Button type="primary" @click="getData">查询</Button>
        </i-col>
    </Row>
</template>
<script>
import ivPart from './ivPart'
export default {
    props:{
        params:{
            type:Array,
            default:function(){
                return []
            }
        },
        //控件值改变或回车触发查询时间
        triggerGetData:{
            type:Boolean,
            default:false
        }
    },
    components:{ivPart},
    methods:{
        getData(){
            this.$emit('getData',this.params)
        }
    }
}
</script>