<template>
    <div ref="dom">
        
    </div>
</template>
<script>
import E from 'wangeditor'
export default {
    name:'Wangeditor',
    mounted(){
        const editor = new E(this.$refs.dom)
         editor.config.uploadImgShowBase64 = true
        //  editor.config.uploadImgServer = 'http://data-platform-demo.bobandata.com/data-service-admin/api/sys/attach/uploadImg'
        editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
        editor.config.colors = [
            '#000000',
            '#000000',
            '#1c487f',
            '#4d80bf'
        ]
        // 或者 const editor = new E( document.getElementById('div1') )
        editor.create()
    }
}
</script>