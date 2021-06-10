<template>
    <div>
        <div class="tree-item" v-for="(item,index) in data" :key="index">
            <p :draggable="draggable" @dragstart="hdragstart($event,item)" @dragend="hdragend($event,item)" 
            @dragover="hdragover($event,item)" @dragleave="hdragleave($event,item)"
             :style="'padding-left:'+(level*20)+'px'" class="tree-item-p" @click="item.disclick?chengeExpand(index,!item.expand):changeIndex(item.treeId,item)" 
            :class="{checked:checkIndex==item.treeId,'tree-draggable':draggable}">
                <Icon v-if="item.expand" @click.stop="chengeExpand(index,!item.expand)" type="md-arrow-dropdown" :style="item.children?'':'opacity:0'" />
                <Icon v-else @click.stop="chengeExpand(index,!item.expand);" type="md-arrow-dropright" :style="item.children?'':'opacity:0'" />
                <svgIndex v-if="item.icon" :type="item.icon" :color="item.color?item.color:'#6380A1'" style="vertical-align: middle;"/>
                <span style="vertical-align: middle;">{{item.name}}</span>
                <span class="tree-icon" v-show="showIcon">
                    <Icon :type="item2.type" @click.stop="item2.click(item)" v-for="(item2,index2) in item.icons" :key="index+'-'+index2"/>
                </span>
            </p>
            <template v-if="item.children">
                <tree-index v-show="item.expand" :data.sync="item.children" :draggable="draggable" :showIcon="showIcon" @hdragstart="hdragstart" @hdragover="hdragover" @hdragend="hdragend" @hdragleave="hdragleave"
                 :checkIndex="checkIndex" @chengeExpand="chengeExpand" @changeIndex="changeIndex" :level="level+1" :sindex="index"/>
            </template>
        </div>
    </div>
</template>
<script>
import svgIndex from '../../components/charts/svg'
export default {
    name:'tree-index',
    components:{svgIndex},
    props:{
        data:{
            type:Array,
            default:()=>{
                return []
            }
        },
        level:{
            type:Number,
            default:0
        },
        sindex:{
            type:Number,
            default:0
        },
        checkIndex:{
            type:[Number,String],
            default:-1
        },
        draggable:{
            type:Boolean,
            default:false
        },
        showIcon:{
            type:Boolean,
            default:false
        }
    },
    data(){
        return{
            hcheckIndex:-1
        }
    },
    mounted(){
    },
    methods:{
        hdragstart(e,item){
            this.$emit('hdragstart',e,item)
        },
        hdragend(e,item){
            console.log('end')
            this.$emit('hdragend',e,item)
        },
        hdragover(e,item){
            this.$emit('hdragover',e,item)
        },
        hdragleave(e,item){
            this.$emit('hdragleave',e,item)
        },
        chengeExpand(index,expand){
            if(this.level==0){
                let indexs = index.toString().split('-')
                let data = this.data,newData
                for(let i=0;i< indexs.length;i++){
                    let a = parseInt(indexs[i])
                    if(i==0){
                        newData = data[a]
                    }else{
                        newData = newData.children[a]
                    }
                }
                this.$set(newData,'expand',expand)
                this.$emit('reflashTree')
            }else{
                this.$emit('chengeExpand',this.sindex+'-'+index,expand)
            }
        },
        changeIndex(checkIndex,item){
            if(item.disclick) return
            if(this.level==0){
                if(this.hcheckIndex == checkIndex){
                    this.hcheckIndex = -1
                    this.$emit('changeIndex',-1,{})
                }else{
                    this.hcheckIndex = checkIndex
                    this.$emit('changeIndex',checkIndex,item)
                }
                this.$emit('update:checkIndex',this.hcheckIndex)
            }else{
                this.$emit('changeIndex',checkIndex,item)
            }
        }
    },
}
</script>
<style>
    .tree-item{
        font-size:16px;
    }
    .tree-item-p{
        cursor: pointer;
        margin:5px 0;
        border:1px solid transparent;
    }
    .tree-item-p:hover{
        background:#D1E8E878;
    }
    .tree-item-p.checked{
        background: #D1E8E8;
    }
     .tree-icon{
        float:right;vertical-align: middle;display: none;
     }
     .tree-icon i{
         cursor: pointer;
     }
     .tree-icon i:hover{
         color:blue;
     }
    .tree-item-p:hover .tree-icon{
        display: inline-block;
    }
    .tree-draggable{
        user-select: none;
        cursor: all-scroll;
    }
    .tree-drag-hover{
        border:1px solid #598eb8;
    }
</style>