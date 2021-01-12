<style scoped>
    .svgBox{
        padding:20px;
    }
    .svgBox> div{
        display: inline-block;
        margin:0 5px;
        padding:0 5px;
        text-align:center;
    }
</style>
<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <div class="svgBox">
                <div v-for="(item,index) in types" :key="index">
                    <chartSvg :type="item.name" :width="item.width" :height="item.height" :color="item.color"/>
                    <br>
                    <span>{{item.name}}</span>
                </div>
            </div>
        </template>
    </exampleLout>
</template>

<script>
import exampleLout from '../exampleLout'
import {
    chartSvg
} from '@/components/index';
import {chartSvgData} from '../devTool/defaultData/index'
export default {
    name: 'chartSvgExample',
    components: {
        exampleLout,
        chartSvg
    },
    data() {
        return {
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
                }
            ],
            reflash:true
        }
    },
    created() {
        let obj = eval(`(()=>{${chartSvgData.data}\n return data})()`)
        this.types = obj.types
    },
    mounted() {
        this.$refs.exampleLout.inCome({
            htmlCode:chartSvgData.template,
            dataString:chartSvgData.data
        })
    },
    methods: {
        run(obj){
            this.reflash = false
            setTimeout(()=>{
                this.reflash = true
                this.types = obj.types
            },100)
        }
    },
}
</script>
