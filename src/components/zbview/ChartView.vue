<template>
    <div>
            <Row>
                <i-col v-for="(item,index) in chartData" :key="index"  :sm="24" :md="12" :lg="8" :xl="6" :xxl="4">
                    <fschart :key="index" :chartOption="item" :height="200" class="fschart" style="margin:0 5px;margin-bottom:10px;min-height:100px;"></fschart>
                </i-col>
            </Row>
    </div>
</template>
<script>
import fschart from './fschart'
export default {
    props:{
        chartData:{
            type:Array,
            default:()=>{
                return []
            }
        }
    },
    data(){
        return{
        }
    },
    components:{fschart}
}
</script>