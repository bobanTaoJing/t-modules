<template>
    <div>
        <Form :model="formData">
                <Row :gutter="32">
                    <Col span="12">
                        <FormItem label="nameKey" label-position="top">
                            <Input v-model="formData.nameKey" placeholder="please enter user name" />
                            <Input v-model="checkData.name" />
                        </FormItem>
                    </Col>
                    <Col span="12">
                        
                    </Col>
                </Row>
            </Form>
            <div class="demo-drawer-footer">
                <Button style="margin-right: 8px" @click="$emit('update:close',false)">Cancel</Button>
                <Button type="primary" @click="value3 = false">Submit</Button>
            </div>
    </div>
</template>
<script>
export default {
    props:['diagramJson', 'nodeKey','close','checkData'],
    data(){
        return{
            formData: {
                    nameKey: '',
            },
        }
    },
    mounted(){
        if(this.diagramJson.nodeDataArray)
        for(let a of this.diagramJson.nodeDataArray){
            if(a.key==this.nodeKey) this.formData = a
        }
        console.log(this.formData)
    },
    watch:{
        nodeKey(){
            if(this.diagramJson.nodeDataArray)
            for(let a of this.diagramJson.nodeDataArray){
                if(a.key==this.nodeKey) this.formData = a
            }
        }
    }
}
</script>
<style scoped>
    .demo-drawer-footer{
        width: 100%;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 1px solid #e8e8e8;
        padding: 10px 16px;
        text-align: right;
        background: #fff;
    }
</style>