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
} from "@/components/g6-editor/behavior";
import config from '../../global'
export default {
    data() {
        return {
            pageId: "graph-container",
            graph: null
        };
    },
    props: {
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
        }
    },
    created() {
        initBehavors();
    },
    mounted() {
        // this.$nextTick(() => {
        //     this.init();
        // });
    },
    methods: {
        init(editor,command) {
            const height = this.height - 42
            const width = this.width - 400

            this.graph = new G6.Graph({
                container: "graph-container",
                height: height,
                width: width,
                modes: {
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
                        'drag-node',
                        // {
                        //     type: 'tooltip',
                        //     formatText: function formatText(model) {
                        //     const text = 'description: ' + model.description;
                        //     return text;
                        //     },
                        //     offset: 30
                        // },
                        // {
                        //     type: 'edge-tooltip',
                        //     formatText: function formatText(model) {
                        //     const text = 'description: ' + model.description;
                        //     return text;
                        //     },
                        //     offset: 30
                        // },
                    ],
                    mulitSelect: ["mulit-select"],
                    addEdge: ["add-edge"],
                    moveNode: ["drag-item"]
                },
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
