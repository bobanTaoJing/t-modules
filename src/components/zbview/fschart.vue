<template>
    <div style="position:relative">
        <Spin size="large" fix v-if="loading" :height="height"></Spin>
         <schart v-else :chartOption="option" :height="height" :disHover="false"></schart>
    </div>
</template>
<script>
import schart from './metabase/schart'
export default {
    props:['chartOption','height'],
    data(){
        return{
            option:{},
            loading:false
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.loading = true
        this.$http.get('/resource/statistic/query/list?id='+this.chartOption)
        .then(res1=>{
            let res = res1.data
            this.loading = false
            if(res.success){
                if(res.data.rows.length>0){
                    let option = res.data.rows[0]
                    if(option.queryAttribute){
                        option.queryAttribute = JSON.parse(option.queryAttribute)
                    }
                    if(option.cardAttribute){
                        option.cardAttribute = JSON.parse(option.cardAttribute)
                    }
                    this.option = option
                }
            
            }else{
                this.$Message.error(res.message)
            }
        })
        .finally(()=>[
            this.loading = false
        ])
        }
    },
    components:{schart},
    watch: {
        chartOption(){
            this.init()
        }
    },
}
</script>