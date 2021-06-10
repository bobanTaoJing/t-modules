<template>
    <ttree v-if="showTree" ref="ttree" :data.sync="data" :draggable="draggable" :showIcon="showIcon" @hdragstart="hdragstart" @hdragover="hdragover" @hdragend="hdragend" @hdragleave="hdragleave"
     :checkIndex.sync="checkIndex" @changeIndex="changeIndex" @reflashTree="reflashTree"></ttree>
</template>
<script>
import ttree from './index'
export default {
    components:{ttree},
    props:{
        data:{
            type:Array,
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
            showTree:true,
            checkIndex:-1,
            lastOver:{}
        }
    },
    methods:{
        hdragstart(e,item){
            this.$emit('hdragstart',e,item)
        },
        hdragend(e,item){
            if(this.lastOver.target){
                this.lastOver.target.className = 'tree-item-p tree-draggable'
            }
            this.$emit('hdragend',e,item)
        },
        hdragover(e,item){
            this.lastOver = e
            this.$emit('hdragover',e,item,success=>{
                if(success){
                    e.preventDefault()
                    e.dataTransfer.dropEffect = 'move'
                    e.target.className = 'tree-item-p tree-draggable tree-drag-hover'
                }
            })
        },
        hdragleave(e,item){
            this.lastOver = {}
            try{
                e.target.className = 'tree-item-p tree-draggable'
            }catch{
                console.log(1)
            }
            this.$emit('hdragleave',e,item)
        },
        removeHover(){
            if(this.lastOver.target){
                this.lastOver.target.className = 'tree-item-p tree-draggable'
            }
        },
        changeIndex(checkIndex,item){
            this.$emit('changeIndex',checkIndex,item)
        },
        reflashTree(){
            // this.showTree = false
            // setTimeout(()=>{
            //     this.showTree = true
            // },10)
            // this.data.unshift({})
            // this.data.splice(0,1)
            // this.$emit('changeIndex')
            // this.$emit('update:data',data)
            let checkIndex = this.$refs.ttree.checkIndex
            //作用于刷新树 
            this.checkIndex='-gd'
            setTimeout(()=>{
                this.checkIndex = checkIndex
            },10)
        }
    }
}
</script>