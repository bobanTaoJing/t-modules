<template>
    <exampleLout ref="exampleLout" @run="run">
        <template slot="right">
            <ttree :data="data" @changeIndex="changeIndex"/>
        </template>
    </exampleLout>
</template>
<script>
import exampleLout from '../exampleLout.vue'
import ttree from '../../components/ttree/main.vue'
import {ttreeData} from '../devTool/defaultData/index'
export default {
    name:'ttreeExample',
    components:{exampleLout,ttree},
    data(){
        return{
            data:[
                {
                    name:'test',
                    treeId:1,
                    children:[
                        {
                            name:'test2',
                            treeId:2
                        }
                    ]
                }
            ]
        }
    },
    mounted(){
        this.$refs.exampleLout.inCome({
            htmlCode:ttreeData.template,
            dataString:ttreeData.data
        })
    },
    methods:{
        changeIndex(index,item){
            console.log(index)
            console.log(item)

        },
        run(obj){
            this.data = obj.data
        }
    }
}
</script>