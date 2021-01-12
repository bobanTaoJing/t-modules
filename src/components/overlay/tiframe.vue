<template>
    <iframe v-if="show" :src="url" style="width:100%;height:100%" frameborder="0"></iframe>
</template>
<script>
export default {
    props:['url'],
    data(){
        return{
            show:true
        }
    },
    watch:{
        url(){
            this.show = false
            setTimeout(()=>{
                this.show = true
            },10)
        }
    }
}
</script>