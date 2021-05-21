<style>
    .g6-tooltip {
    border: 1px solid #e2e2e2;
    border-radius: 4px;
    font-size: 12px;
    color: #545454;
    background-color: rgba(255, 255, 255, 0.9);
    padding: 10px 8px;
    box-shadow: rgb(174, 174, 174) 0px 0px 10px;
  }
</style>
<template>
<div class="page">
    <div :id="pageId" class="graph-container" style="position: relative;"></div>
</div>
</template>

<script>
import G6 from "@antv/g6/build/g6";
import {
    initBehavors
} from "../../../../components/g6-editor/behavior";
import config from '../../global'
export default {
    data() {
        return {
            graph: null
        };
    },
    props: {
        pageId:{
            type:String,
            default:'graph-container'
        },
        height: {
            type: Number,
            default: 0
        },
        width: {
            type: Number,
            default: 0
        },
        data: {
            type: Object,
            default: () => {}
        },
        runTime:{
            type:Boolean,
            default:false
        },
        onlyRead:{
            type:Boolean,
            default:false
        },
        ip:{},
        headers:{}
    },
    created() {
        initBehavors({
            ip:this.ip,
            headers:this.headers
        });
         var obj = {a:1}
         var obj2 = {...obj}
         console.log(this.data)
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.init();
        // });
    },
    methods: {
        init(editor,command,twidth) {
            let height = this.height - 42
            if(this.runTime) height = height/2
            const width = (twidth?twidth:this.width) - (this.runTime?0:200)
            let modes = {
                    // 支持的 behavior
                    default: [
                        "drag-canvas",
                        "zoom-canvas",
                        "hover-node",
                        "select-node",
                        "hover-edge",
                        "keyboard",
                        "customer-events",
                        "add-menu",
                        // 'drag-node',
                    ],
                    mulitSelect: ["mulit-select"],
                    addEdge: ["add-edge"],
                    moveNode:[ "drag-item"]
                }
            if(this.runTime) delete modes.addEdge
            this.graph = new G6.Graph({
                container: this.pageId,
                height: height,
                width: width,
                modes,
                defaultEdge: {
                    type: 'line',
                    style: {
                    stroke: '#A3B1BF',
                    },
                },
            });
            // const {
            //     editor,
            //     command
            // } = this.$parent;
            editor.emit("afterAddPage", {
                graph: this.graph,
                command
            });

            this.readData();
        },
        readData() {
            let data = this.data;
            if (data) {
                this.graph.read(data);
            }
        },
        reflash(editor,command,twidth){
            this.graph.destroy()
            this.init(editor,command,twidth)
        }
    }
};
</script>

<style scoped>
.page {
    /* margin-left: 200px;
    margin-right: 200px; */
    padding-left:200px;
}
</style>
