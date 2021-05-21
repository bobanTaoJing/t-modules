<style>
.itemPaneBox .ivu-collapse-content {
    padding: 5px 0;
}

.itemPaneBox .ivu-collapse-content>.ivu-collapse-content-box {
    padding: 0;
}
</style>
<template>
<div class="itemPaneBox">
    <Collapse v-model="colArr">
        <Panel :name="itemf.name" v-for="(itemf,indexf) in itemPanelData" :key="indexf">
            <img :src="imgIp+'/img/stream/'+itemf.name+'.png'" style="width:18px;height:18px;    vertical-align: sub;" alt="" srcset="">
            <span style="font-weight:bold;padding-left:5px;font-size:16px;">{{itemf.name=='SOURCE'?'输入节点':itemf.name=='SINK'?'输出节点':itemf.name=='OPERATION'?'操作节点':itemf.name=='UNION'?'多流操作节点':itemf.name}}</span>
            <p slot="content" style="padding:0 5px;">
                <Collapse>
                    <Panel :name="itemf2.name" v-for="(itemf2,indexf2) in itemf.newChildren" :key="indexf2">
                        {{itemf2.name}}
                        <p slot="content">
                            <ul :ref="'itemBox'+indexf2">
                                <li v-for="(item,index) in itemf2.children" :key="index" class="getItem" :data-shape="item.shape" :data-type="item.type" :data-size="item.size" draggable @dragstart="handleDragstart($event,indexf2)" @dragend="handleDragEnd($event,item)">
                                    <img :src="imgIp+'/img/stream/'+item.icon+'.png'" style="width:18px;height:18px;    vertical-align: sub;" alt="" srcset="">
                                    {{item.name}}
                                </li>
                            </ul>
                        </p>
                    </Panel>
                </Collapse>
            </p>
        </Panel>
    </Collapse>
</div>
</template>

<script>
import eventBus from "../../../../components/g6-editor/utils/eventBus";
import okSvg from "../../../../components/g6-editor/assets/icons/ok.svg";
import bgImg from "../../../../components/g6-editor/assets/bg.jpg";
export default {
    props:['ip','headers'],
    data() {
        return {
            page: null,
            command: null,
            offsetX: 0,
            offsetY: 0,
            list: [{
                    name: "表圆节点",
                    label: "表圆节点",
                    size: "80*80",
                    type: "node",
                    nodeType: 'circle',
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    // stateImage: okSvg,
                    inPoints: [
                        [0.5, 0]
                    ],
                    outPoints: [
                        [0.2, 1]
                    ],
                    // isDoingStart: true,
                    // isDoingEnd:true
                },
                {
                    name: "表节点",
                    label: "表节点",
                    objects: [{
                            name: 'id',
                            type: 'bigint'
                        },
                        {
                            name: 'name',
                            type: 'varchar'
                        },
                        {
                            name: 'create_time',
                            type: 'datetime'
                        }
                    ],
                    size: "170*34",
                    type: "node",
                    nodeType: 'table',
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    // stateImage: okSvg,
                    inPoints: [
                        [0.5, 0],
                        [0, 0.7]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ]
                },
                {
                    name: "表节点2",
                    label: "表节点2",
                    objects: [{
                            name: 'id',
                            type: 'bigint'
                        },
                        {
                            name: 'name',
                            type: 'varchar'
                        },
                        {
                            name: 'create_time长度测试create_time长度测试create_time长度测试',
                            type: 'datetime'
                        },
                        {
                            name: 'create_time',
                            type: 'datetime'
                        },
                        {
                            name: 'create_time',
                            type: 'datetime'
                        },
                        {
                            name: 'create_time',
                            type: 'datetime'
                        },
                    ],
                    size: "170*34",
                    type: "node",
                    nodeType: 'table',
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    // stateImage: okSvg,
                    inPoints: [
                        [0.5, 0],
                        [0, 0.7]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ]
                },
                {
                    name: "测试节点",
                    label: "测试节点",
                    size: "170*80",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    inPoints: [
                        [0.5, 0],
                        [0, 0.7]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ]
                },

                {
                    name: "背景图片节点",
                    label: "背景图片节点",
                    size: "170*34",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    backImage: bgImg,
                    inPoints: [
                        [0, 0.5]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ]
                },
                {
                    name: "双输出节点",
                    label: "双输出节点",
                    size: "170*34",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    inPoints: [
                        [0, 0.5]
                    ],
                    outPoints: [
                        [1, 0.4],
                        [1, 0.6]
                    ]
                },
                {
                    name: "大型节点",
                    label: "大型节点",
                    size: "340*34",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    inPoints: [
                        [0, 0.5]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ]
                },
                {
                    name: "动画开始节点",
                    label: "动画开始",
                    size: "170*34",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    inPoints: [
                        [0, 0.5]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ],
                    isDoingStart: true
                },
                {
                    name: "动画结束节点",
                    label: "动画结束",
                    size: "170*34",
                    type: "node",
                    x: 0,
                    y: 0,
                    shape: "customNode",
                    color: "#1890ff",
                    image: "https://gw.alipayobjects.com/zos/rmsportal/czNEJAmyDpclFaSucYWB.svg",
                    stateImage: okSvg,
                    inPoints: [
                        [0, 0.5]
                    ],
                    outPoints: [
                        [1, 0.5]
                    ],
                    isDoingEnd: true
                }
            ],
            itemPanelData: [],
            dragIndex: '',
            colArr: [],
            imgIp: window.location.origin + window.location.pathname
        };
    },
    watch: {
        itemPanelData() {
            let arr = []
            for (let a of this.itemPanelData) {
                arr.push(a.name)
            }
            this.$nextTick(() => {
                this.colArr = arr
            })
        }
    },
    created() {
        this.bindEvent();
        this.getItemPanelData()
    },
    methods: {
        handleDragstart(e, index) {
            this.offsetX = e.offsetX;
            this.offsetY = e.offsetY;
            this.dragIndex = index
        },
        getItemPanelData() {
            this.$http.apiGet(this.ip + '/job/stream/node/detail/list',{
                headers:this.headers
            })
                .then(res => {
                    if (res.success) {
                        let arrTypes = [],
                            arrItemPanel = []
                        for (let a of res.data.nodes) {
                            if (arrTypes.indexOf(a.type) <= -1) {
                                arrTypes.push(a.type)
                                let obj = Object.assign({
                                    insert_data: a
                                }, {
                                    name: a.displayName,
                                    label: a.displayName,
                                    size: "80*80",
                                    type: "node",
                                    nodeType: 'circle',
                                    x: 0,
                                    y: 0,
                                    shape: "customNode",
                                    color: "#1890ff",
                                    inPoints: [
                                        [0.5, 0]
                                    ],
                                    outPoints: [
                                        [0.2, 1]
                                    ],
                                    icon: a.icon
                                })
                                arrItemPanel.push({
                                    name: a.type,
                                    children: [obj]
                                })
                            } else {
                                for (let b of arrItemPanel) {
                                    if (a.type == b.name) {
                                        let obj = Object.assign({
                                            insert_data: a
                                        }, {
                                            name: a.displayName,
                                            label: a.displayName,
                                            size: "80*80",
                                            type: "node",
                                            nodeType: 'circle',
                                            x: 0,
                                            y: 0,
                                            shape: "customNode",
                                            color: "#1890ff",
                                            inPoints: [
                                                [0.5, 0]
                                            ],
                                            outPoints: [
                                                [0.2, 1]
                                            ],
                                            icon: a.icon
                                        })
                                        b.children.push(obj)
                                    }
                                }
                            }
                        }
                        console.log(arrItemPanel)
                        for (let a of arrItemPanel) {
                            let elementNames = []
                            let newChildren = []
                            for (let b of a.children) {
                                if (elementNames.indexOf(b.insert_data.elementName) <= -1) {
                                    elementNames.push(b.insert_data.elementName)
                                    let obj = {
                                        name: b.insert_data.elementName,
                                        children: [b]
                                    }
                                    newChildren.push(obj)
                                } else {
                                    for (let c of newChildren) {
                                        if (b.insert_data.elementName == c.name) {
                                            c.children.push(b)
                                        }
                                    }
                                }
                            }
                            a.newChildren = newChildren
                        }
                        console.log(arrItemPanel)
                        this.itemPanelData = arrItemPanel
                    }
                })
        },
        handlerNodeData(data) {
            let arrItemPanel = []
            for (let a of data) {
                if (arrTypes.indexOf(a.type) <= -1) {
                    arrTypes.push(a.type)
                    let obj = Object.assign({
                        insert_data: a
                    }, {
                        name: a.displayName,
                        label: a.displayName,
                        size: "80*80",
                        type: "node",
                        nodeType: 'circle',
                        x: 0,
                        y: 0,
                        shape: "customNode",
                        color: "#1890ff",
                        inPoints: [
                            [0.5, 0]
                        ],
                        outPoints: [
                            [0.2, 1]
                        ],
                        icon: a.icon
                    })
                    arrItemPanel.push({
                        name: a.type,
                        children: [obj]
                    })
                } else {
                    for (let b of arrItemPanel) {
                        if (a.type == b.name) {
                            let obj = Object.assign({
                                insert_data: a
                            }, {
                                name: a.displayName,
                                label: a.displayName,
                                size: "80*80",
                                type: "node",
                                nodeType: 'circle',
                                x: 0,
                                y: 0,
                                shape: "customNode",
                                color: "#1890ff",
                                inPoints: [
                                    [0.5, 0]
                                ],
                                outPoints: [
                                    [0.2, 1]
                                ],
                                icon: a.icon
                            })
                            b.children.push(obj)
                        }
                    }
                }
            }
            return arrItemPanel
        },
        //判断是否拖到编辑器中
        isDragOnEditor(value) {
            let x = this.$refs['itemBox' + this.dragIndex][0].offsetWidth,
                parent = this.$refs['itemBox' + this.dragIndex][0].offsetParent
            while (parent !== null) {
                x += parent.offsetLeft
                parent = parent.offsetParent
            }
            console.log(value)
            console.log(x)
            return value > x
        },
        handleDragEnd(e, item) {
            console.log(this.$refs)
            console.log(e)
            item.color = '#' + this.getColor('')
            if (!this.isDragOnEditor(e.clientX)) return
            let data = {};
            Object.assign(data, item);
            data.offsetX = this.offsetX;
            data.offsetY = this.offsetY;
            if (this.page) {
                const graph = this.page.graph;
                // const size = e.target.dataset.size.split("*");
                const xy = graph.getPointByClient(e.x, e.y);
                data.x = xy.x;
                data.y = xy.y;
                data.size = item.size.split("*");
                data.type = "node";
                this.command.executeCommand("add", [data]);
            }
        },
        bindEvent() {
            eventBus.$on("afterAddPage", page => {
                this.page = page;
                this.command = page.command;
            });
        },
        getColor(color) {
            let base = '0123401234abcabc' //浅色
            // let base = '5678956789defdef'//深色
            return (color += base[Math.floor(Math.random() * 16)]) &&
                (color.length == 6) ? color : this.getColor(color)
        }
    }
};
</script>

<style scoped>
.itempannel {
  height: 100%;
  position: absolute;
  left: 0px;
  z-index: 2;
  background: #f7f9fb;
  width: 200px;
  padding-top: 8px;
  border-right: 1px solid #e6e9ed;
}
.itempannel ul {
  padding: 0px;
  padding-left: 16px;
}
.itempannel li {
  color: rgba(0, 0, 0, 0.65);
    border-radius: 4px;
    width: 160px;
    height: 28px;
    line-height: 26px;
    padding-left: 8px;
    border: 1px solid rgba(115, 31, 31, 0);
    list-style-type: none;
    background: #ddd;
    margin: 5px 0;
}
.itempannel li:hover {
  background: #7d8990;
  color:#fff;
  border: 1px solid #ced4d9;
  cursor: move;
}

.itempannel .pannel-type-icon {
  width: 16px;
  height: 16px;
  display: inline-block;
  vertical-align: middle;
  margin-right: 8px;
}
</style>
