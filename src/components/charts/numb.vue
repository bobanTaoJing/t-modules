<template>
<Card class="chart_card" :bordered='false' :dis-hover="disHover">
    <div>
        <div v-if="text" :style="'background:linear-gradient(18deg,'+fcolor+','+(fcolor2)+')'" class="chart-title">{{text}}</div>
        <div :style="'position:relative;height:'+height">
            <Spin size="large" fix v-if="loading"></Spin>
            <div :style="'height:'+height" @mouseover="hoverNumb" @mouseout="outNumb">
                <Tooltip :content="value" placement="bottom" :delay="0" :disabled="!value&&value!==0" style="margin: auto;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                height: 40px;">
                    <NumberUp v-if="value" :endVal="value" :color="fcolor" :trueValue="trueValue" :countSize="countSize" :decimals="decimals" style="cursor:default;line-height:40px"></NumberUp>
                    <NumberUp v-else :endVal="0" :color="'#E6E6E6'" :countSize="countSize" :decimals="decimals" style="cursor:default;line-height:40px"></NumberUp>
                </Tooltip>
                <!-- <div class="chart-title" style="text-align:center;font-weight:500" v-if="text">{{text}}</div> -->
            </div>
        </div>
    </div>
</Card>
</template>
<script>
  import {NumberUp} from '../index.js';
export default {
    name:'chartNumb',
    props:{
        disHover:{
            type:Boolean,
            default:false
        },
        text:{
            type:String,
            default:''
        },
        height:{
            type:[String,Number],
            default:'400px'
        },
        value:{
            type:Number
        },
        decimals:{
            //保留几位小数
            type:Number,
            default:2
        },
        loading:{
            type:Boolean,
            default:false
        },
        color:{
            type:String,
            default:''
        },
        countSize:{
            type:String,
            default:'30px'
        },
        trueValue:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            fcolor:'#515A6E',
            fcolor2:'#515A6E',
        }
    },
    mounted(){
        this.fcolor = this.getColor()[0]
        this.fcolor2 = this.getColor()[1]
    },
    computed: {
        hheight() {
            if (this.height.indexOf('px') > -1)
                return this.height
            else return this.height + 'px'
        }
    },
    methods:{
        hoverNumb(){
            console.log('hover')
            // this.fcolor = '#509EE3'
        },
        outNumb(){
            // this.fcolor = this.color
        },
        getColor(color){
            let base = ['#FF6F91','#1F99C4','#9C4FF3','#F58750','#FC718D','#1FACAE','#A7B623','#B5A646','#06ABA2','#06ABA2']
            let base2 = ['#FB7E77','#4ACAC7','#7769FD','#F9B52C','#FD7F74','#1FACAEe3','#A7B623e3','#B5A646e3','#06ABA2e3','#06ABA2e3']
            // let base = '5678956789defdef'//深色
            let index = parseInt(Math.random()*10)
            return [base[index],base2[index]]
        }
    },
    components:{NumberUp}
}
</script>