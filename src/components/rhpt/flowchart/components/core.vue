<style>
    #sample .ivu-collapse{
        background-color: #EBEEF2;
        color: #000;
        border-radius: 3px;
        border: 1px solid #dcdee2;
    }
    #sample .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header{
        color:#000;
    }
    #sample .ivu-collapse > .ivu-collapse-item.ivu-collapse-item-active > .ivu-collapse-header {
    color: #000;
    }
    .title{
        background: #EBEEF2;
        height: 40px;
        line-height: 40px;
        padding-left: 10px;
        font-size:16px !important;
    }
</style>
<template>
<div id="sample" :style="fullScree?'position: fixed;background:#fff;top:0;left:0;width:100vw;height:100vh;z-index:100':''">
    <div class="node-tool">
        <Button @click="showLeftNodes=!showLeftNodes" :style="!showLeftNodes?'':'margin-right:102px'">
            <Icon v-if="showLeftNodes" type="ios-arrow-back" />
            <Icon v-else type="ios-arrow-forward" />
        </Button>
        <Button @click="myDiagram.commandHandler.deleteSelection()" :disabled="!canDel">删除</Button>
        <Button @click="myDiagram.commandHandler.undo()" :disabled="!canUndo" title="撤销">
            <chartSvg type="undo" :height="14"></chartSvg>
        </Button>
        <Button @click="myDiagram.commandHandler.redo()" :disabled="!canRedo" title="重做">
            <chartSvg type="redo" :height="14"></chartSvg>
        </Button>
        <Button v-if="!fullScree" @click="fullScree=true" icon="md-expand"></Button>
        <Button v-if="fullScree" @click="fullScree=false" icon="md-contract"></Button>
        <slot name="actions"></slot>
    </div>
    <div style="width: 100%; display: flex; justify-content: space-between;position:relative" :style="{width:close?'calc(100% - 300px)':'100%'}">
        <div v-show="showLeftNodes" class="media-nodes"  :style=" 'margin-right: 2px; background-color: whitesmoke; border: 1px solid #dedfe0;height:'+boxHeight+'px;overflow:auto;background:#F7F9FB;width:160px;'">
            <template v-for="(item,index) in nodeTypes">
                <div :key="index">
                    <div class="ivu-collapse" @click="copyNodeTypes.indexOf(item)>-1?copyNodeTypes.splice(copyNodeTypes.indexOf(item),1):copyNodeTypes.push(item)">
                    <div class="ivu-collapse-item" :class="{'ivu-collapse-item-active':copyNodeTypes.indexOf(item)>-1}">
                        <div class="ivu-collapse-header" style=" white-space:nowrap;" :title="item">
                            <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                                {{item}}
                            </div>
                        </div>
                    </div>
                    <div :id="'myPaletteDiv'+index" v-show="copyNodeTypes.indexOf(item)>-1"  :style="'width: calc(100% - 2px);height:'+handlerHeight(item)+'px;background:#fff'"></div>
                </div>
            </template>
            <!-- <div class="ivu-collapse" @click="value1.indexOf('1')>-1?value1.splice(value1.indexOf('1'),1):value1.push('1')">
                <div class="ivu-collapse-item" :class="{'ivu-collapse-item-active':value1.indexOf('1')>-1}">
                    <div class="ivu-collapse-header">
                        <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                        s1
                    </div>
                </div>
            </div>
            <div id="myPaletteDiv" v-show="value1.indexOf('1')>-1" style="width: 278px;height:200px;background:#fff"></div>

            <div class="ivu-collapse" @click="value1.indexOf('2')>-1?value1.splice(value1.indexOf('2'),1):value1.push('2')">
                <div class="ivu-collapse-item" :class="{'ivu-collapse-item-active':value1.indexOf('2')>-1}">
                    <div class="ivu-collapse-header">
                        <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                        s2
                    </div>
                </div>
            </div>
            <div id="myPaletteDiv2" v-show="value1.indexOf('2')>-1" style="width: 278px;height:200px;background:#fff"></div> -->

        </div>
         <Split v-model="splitValue" :style="'flex-grow: 1; height: '+boxHeight+'px; border: 1px solid #dedfe0;background:#fff'">
            <div slot="left" class="demo-split-pane" style="overflow:hidden">
                <div id="myDiagramDiv" :style="' height: '+boxHeight+'px; border: 1px solid #dedfe0;background:#fff'"></div>
            </div>
            <div slot="right" class="demo-split-pane" style="width:100%">
                <div :style="'min-width:200px;width:100%;border:1px solid #dedfe0;position:relative;height:'+boxHeight+'px'">
                    <div style="height:calc(100% - 175px);overflow:auto;background:#F7F9FB;">
                        <slot name="nodeDetail"></slot>
                    </div>
                    <div style="position:absolute;bottom:0;width:100%">
                        <p class="title">导航器</p>
                        <div id="myOverviewDiv" style="height:100px;background:#fff;"></div>
                    </div>
                </div>
            </div>
        </Split>
        <!-- <div id="myDiagramDiv" style="flex-grow: 1; height: 750px; border: solid 1px black"></div> -->
        <div id="hiddenDia" style="opacity:0"></div>
        <!-- <div id="myOverviewDiv" style="width:200px;height:100px;position:absolute;top:0;right:0;background:#fff;"></div> -->
    </div>
    <!-- <p>
        Mouse-over a Node to view its ports.
        Drag from these ports to create new Links.
        Selecting Links allows you to re-shape and re-link them.
        Selecting a Node and then clicking its TextBlock will allow
        you to edit text (except on the Start and End Nodes).
    </p>
    <button @click="load()">Load</button>
    Diagram Model saved in diagramJson format:
    <textarea id="mySavedModel" style="width:100%;height:300px" v-model="diagramJson"></textarea>
    <button onclick="printDiagram()">Print Diagram Using SVG</button> -->
    <!-- <Drawer :closable="false" :styles="styles" :width="drawerWidth" class="hiddendrawer node-detail" v-model="close">
        <slot name="nodeDetail"></slot>
        <detail1 :diagramJson="diagramJson" :nodeKey="checkNodeKey" :checkData="checkData" :close.sync="close"></detail1>
    </Drawer> -->
</div>
</template>

<script>
import go from 'gojs'
import detail1 from './detail1'
import {chartSvg} from '../components/'
export default {
    props:{
        nodes:{
            type:Array,
            default:()=>{
                return []
            }
        },
        nodeTypes:{
            type:Array,
            default:()=>{
                return []
            }
        },
        fromPort:{
            type:String,
            default:'fromPort'
        },
        toPort:{
            type:String,
            default:'toPort'
        },
        drawerWidth:{
            type:Number,
            default:300
        }
    },
    data() {
        return {
            fullScree:false,
            close: false,
            styles: {
                height: 'calc(100% - 55px)',
                overflow: 'auto',
                paddingBottom: '53px',
                position: 'static'
            },
            value1: ['1', '2'],
            myDiagram: {},
            diagramJson:{
                "class": "GraphLinksModel"
            },
            copyNodeTypes:[],
            // diagramJson: {
            //     "class": "GraphLinksModel",
            //     "linkFromPortIdProperty": "source",
            //     "linkToPortIdProperty": "toPort",
                // "nodeDataArray": [{
                //         "name": "Mysql",
                //         "testxu": "test",
                //         "nameKey": 2,
                //         "img": "static/assets/img/icon_mysql.png",
                //         "size": [40, 40],
                //         "key": -2,
                //         "loc": "-616.9873853495236 -545.9918308046756"
                //     },
                //     {
                //         "name": "dm",
                //         "testxu": "test",
                //         "color": "blue",
                //         "nameKey": 3,
                //         "img": "static/assets/img/dm.png",
                //         "key": -5,
                //         "loc": "-392.09787059843654 -412.2853100063415"
                //     },
                //     {
                //         "name": "file",
                //         "testxu": "test",
                //         "nameKey": 4,
                //         "img": "static/assets/img/file.png",
                //         "key": -6,
                //         "loc": "-176.09787059843657 -576.2853100063415"
                //     },
                //     {
                //         "name": "kafka",
                //         "testxu": "test",
                //         "nameKey": 5,
                //         "img": "static/assets/img/kafka.png",
                //         "key": -7,
                //         "loc": "-700.0978705984367 -286.28531000634143"
                //     },
                //     {
                //         "name": "kb",
                //         "testxu": "test",
                //         "nameKey": 5,
                //         "img": "static/assets/img/kb.png",
                //         "key": -8,
                //         "loc": "-172.09787059843657 -332.28531000634143"
                //     }
                // ],
                // "linkDataArray": [{
                //         "from": -5,
                //         "to": -6,
                //         "fromPort": "R",
                //         "toPort": "L",
                //         "points": [-342.0978705984365, -412.28531000634143, -332.0978705984365, -412.28531000634143, -284.09787059843654, -412.28531000634143, -284.09787059843654, -576.2853100063414, -236.09787059843654, -576.2853100063414, -226.09787059843654, -576.2853100063414]
                //     },
                //     {
                //         "from": -2,
                //         "to": -5,
                //         "fromPort": "B",
                //         "toPort": "T",
                //         "points": [-616.9873853495237, -477.9918308046756, -616.9873853495237, -467.9918308046756, -504.5426279739801, -467.9918308046756, -504.5426279739801, -490.28531000634143, -392.0978705984365, -490.28531000634143, -392.0978705984365, -480.28531000634143]
                //     },
                //     {
                //         "from": -5,
                //         "to": -7,
                //         "fromPort": "L",
                //         "toPort": "R",
                //         "points": [-442.0978705984365, -412.28531000634143, -452.0978705984365, -412.28531000634143, -546.0978705984364, -412.28531000634143, -546.0978705984364, -286.28531000634143, -640.0978705984364, -286.28531000634143, -650.0978705984364, -286.28531000634143]
                //     },
                //     {
                //         "from": -5,
                //         "to": -8,
                //         "fromPort": "B",
                //         "toPort": "L",
                //         "points": [-392.0978705984365, -344.28531000634143, -392.0978705984365, -334.28531000634143, -392.0978705984365, -332.28531000634143, -312.09787059843654, -332.28531000634143, -232.09787059843654, -332.28531000634143, -222.09787059843654, -332.28531000634143]
                //     }
                // ]
            // },
            checkData:{},
            checkNodeKey: '',
            showLeftNodes:true,
            splitValue:.8
        }
    },
    computed:{
        canUndo(){
            if(Object.keys(this.myDiagram).length>0){
                return this.myDiagram.commandHandler.canUndo()
            }else{
                return false
            }
        },canRedo(){
            if(Object.keys(this.myDiagram).length>0){
                return this.myDiagram.commandHandler.canRedo()
            }else{
                return false
            }
        },
        canDel(){
            if(Object.keys(this.checkData).length>0){
                return this.myDiagram.commandHandler.canDeleteSelection()
            }else{
                return false
            }
        },
        boxHeight(){
            if(this.fullScree){
                return window.innerHeight - 55
            }else{
                return 750
            }
        }
    },
    created(){
        this.copyNodeTypes = this.nodeTypes.slice()
        // this.diagramJson.linkFromPortIdProperty = this.fromPort
        // this.diagramJson.linkToPortIdProperty = this.toPort
    },
    mounted() {
    },
    methods: {
        testconsole() {
            console.log(this.myDiagram)
        },
        init() {
            var $ = go.GraphObject.make; // for conciseness in defining templates
            let that = this
            this.myDiagram =
                $(go.Diagram, "myDiagramDiv", // must name or refer to the DIV HTML element
                    {
                        "LinkDrawn": showLinkLabel, // this DiagramEvent listener is defined below
                        "LinkRelinked": showLinkLabel,
                        "undoManager.isEnabled": true, // enable undo & redo
                        grid: $(go.Panel, "Grid",
                            $(go.Shape, "LineH", { stroke: "lightgray", strokeWidth: 0.3 }),
                            $(go.Shape, "LineH", { stroke: "gray", strokeWidth: 0.3, interval: 10 }),
                            $(go.Shape, "LineV", { stroke: "lightgray", strokeWidth: 0.3 }),
                            $(go.Shape, "LineV", { stroke: "gray", strokeWidth: 0.3, interval: 10 })
                        ),
                        "draggingTool.dragsLink": true,
                        "draggingTool.isGridSnapEnabled": true,
                        initialDocumentSpot: go.Spot.TopCenter,
                        initialViewportSpot: go.Spot.TopCenter,
                        //去掉选中时边框色
                        // nodeSelectionAdornmentTemplate:
                        // $(go.Adornment, "Auto",
                        //     $(go.Shape, "Rectangle", { fill: "#000", stroke: null }),
                        // ),
                    });

            // when the document is modified, add a "*" to the title and enable the "Save" button
            this.myDiagram.addDiagramListener("Modified", function (e) {
                console.log('Modified')
                var button = document.getElementById("SaveButton");
                if (button) button.disabled = !that.myDiagram.isModified;
                var idx = document.title.indexOf("*");
                if (that.myDiagram.isModified) {
                    if (idx < 0) document.title += "*";
                } else {
                    if (idx >= 0) document.title = document.title.substr(0, idx);
                }
            });

            // helper definitions for node templates

            function nodeStyle() {
                return [
                    // The Node.location comes from the "loc" property of the node data,
                    // converted by the Point.parse static method.
                    // If the Node.location is changed, it updates the "loc" property of the node data,
                    // converting back using the Point.stringify static method.
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        // the Node.location is at the center of each node
                        locationSpot: go.Spot.Center,
                    }
                ];
            }

            // Define a function for creating a "port" that is normally transparent.
            // The "name" is used as the GraphObject.portId,
            // the "align" is used to determine where to position the port relative to the body of the node,
            // the "spot" is used to control how links connect with the port and whether the port
            // stretches along the side of the node,
            // and the boolean "output" and "input" arguments control whether the user can draw links from or to the port.
            function makePort(name, align, spot, output, input) {
                var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
                // the port is basically just a transparent rectangle that stretches along the side of the node,
                // and becomes colored when the mouse passes over it
                return $(go.Shape, {
                    fill: "transparent", // changed to a color in the mouseEnter event handler
                    strokeWidth: 0, // no stroke
                    width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
                    height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
                    alignment: align, // align the port on the main Shape
                    stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                    portId: name, // declare this object to be a "port"
                    fromSpot: spot, // declare where links may connect at this port
                    fromLinkable: output, // declare whether the user may draw links from here
                    toSpot: spot, // declare where links may connect at this port
                    toLinkable: input, // declare whether the user may draw links to here
                    cursor: "pointer", // show a different cursor to indicate potential link point
                    mouseEnter: function (e, port) { // the PORT argument will be this Shape
                        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                    },
                    mouseLeave: function (e, port) {
                        port.fill = "transparent";
                    }
                });
            }

            function textStyle() {
                return {
                    font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "#000",
                    textAlign: "center",
                }
            }

            // define the Node templates for regular nodes
            let findSize = function (size) {
                return new go.size(size[0], size[1])
            }

            function makeButton(text, action, visiblePredicate) {
                return $("ContextMenuButton",
                    $(go.TextBlock, text), {
                        click: action
                    },
                    // don't bother with binding GraphObject.visible if there's no predicate
                    visiblePredicate ? new go.Binding("visible", "", function (o, e) {
                        return o.diagram ? visiblePredicate(o, e) : false;
                    }).ofObject() : {});
            }
            var partContextMenu =
                $("ContextMenu",
                    //   makeButton("Properties",
                    //     function(e, obj) {  // OBJ is this Button
                    //       var contextmenu = obj.part;  // the Button is in the context menu Adornment
                    //       var part = contextmenu.adornedPart;  // the adornedPart is the Part that the context menu adorns
                    //       // now can do something with PART, or with its data, or with the Adornment (the context menu)
                    //       if (part instanceof go.Link) alert(linkInfo(part.data));
                    //       else if (part instanceof go.Group) alert(groupInfo(contextmenu));
                    //       else alert(nodeInfo(part.data));
                    //     }),
                    makeButton("剪切",
                        function (e, obj) {
                            e.diagram.commandHandler.cutSelection();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canCutSelection();
                        }),
                    makeButton("复制",
                        function (e, obj) {
                            e.diagram.commandHandler.copySelection();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canCopySelection();
                        }),
                    makeButton("粘贴",
                        function (e, obj) {
                            e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
                        },
                        function (o) {
                            return o.diagram.commandHandler.canPasteSelection();
                        }),
                    makeButton("删除",
                        function (e, obj) {
                            e.diagram.commandHandler.deleteSelection();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canDeleteSelection();
                        }),
                    makeButton("撤销",
                        function (e, obj) {
                            e.diagram.commandHandler.undo();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canUndo();
                        }),
                    makeButton("重做",
                        function (e, obj) {
                            e.diagram.commandHandler.redo();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canRedo();
                        }),
                    makeButton("Group",
                        function (e, obj) {
                            e.diagram.commandHandler.groupSelection();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canGroupSelection();
                        }),
                    makeButton("Ungroup",
                        function (e, obj) {
                            e.diagram.commandHandler.ungroupSelection();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canUngroupSelection();
                        })
                );

            function nodeInfo(d) { // Tooltip info for a node data object
                var str = "Node " + d.key + ": " + d.name + "\n";
                if (d.group)
                    str += "member of " + d.group;
                else
                    str += "top-level node";
                return str;
            }
            this.myDiagram.nodeTemplateMap.add("", // the default category
                $(go.Node, "Table",nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    // $(go.Panel, "Table",
                    $(go.Panel, "Horizo​​ntal",
                        $(go.Picture, {
                                name: "Picture",
                                desiredSize: new go.Size(50, 50),
                                // margin: new go.Margin(6, 8, 6, 10),
                                // background:'#ddd'
                            },
                            new go.Binding("source", "img"),
                            new go.Binding("desiredSize", "size", findSize),
                        ),
                    ),
                    // {click : function(e, node){// 双击事件
                    //         console.log(e,node.data)
                    //         if (node.data.name){
                    //             that.$emit('showDetail',node.data)
                    //             // that.setDetails(node.data)
                    //             that.close = true
                    //         }
                    //         else that.close = false
                    //       }
                    // },
                    $(go.Panel, "Vertical",
                        $(go.Shape, "Circle", {
                            minSize: new go.Size(40, 40),
                            fill: "transparent",
                            strokeWidth: 0
                        }),
                        $(go.TextBlock, textStyle(), {
                                margin: 2,
                                // width: 80,
                                height: 20,
                                editable: true,
                            },
                            new go.Binding("text", "name"))
                    ), { // this tooltip Adornment is shared by all nodes
                        // toolTip:
                        // $("ToolTip",
                        //     $(go.TextBlock, { margin: 4 },  // the tooltip shows the result of calling nodeInfo(data)
                        //     new go.Binding("text", "", nodeInfo))
                        // ),
                        // this context menu Adornment is shared by all nodes
                        contextMenu: partContextMenu
                    },
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                    makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                    makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
                ));

            this.myDiagram.nodeTemplateMap.add("Start",
                $(go.Node, "Table", nodeStyle(),
                    $(go.Panel, "Table",
                        $(go.Panel, "Vertical",
                            $(go.Picture, {
                                    name: "Picture",
                                    desiredSize: new go.Size(80, 80),
                                    margin: new go.Margin(6, 8, 6, 10),
                                },
                                new go.Binding("source", "img")
                            ),
                        ),
                        $(go.Panel, "Vertical",
                            $(go.Shape, "Circle", {
                                minSize: new go.Size(40, 40),
                                fill: "transparent",
                                strokeWidth: 0
                            }),
                            $(go.TextBlock, "Start", textStyle(), {
                                    margin: 8,
                                    width: 80,
                                    height: 20,
                                    editable: true,
                                },
                                new go.Binding("text", "name"))
                        )
                    ),
                    // three named ports, one on each side except the top, all output only:
                    makePort("L", go.Spot.Left, go.Spot.Left, true, false),
                    makePort("R", go.Spot.Right, go.Spot.Right, true, false),
                    makePort("B", go.Spot.Bottom, go.Spot.Bottom, true, false)
                ));

            // replace the default Link template in the linkTemplateMap
            this.myDiagram.linkTemplate =
                $(go.Link, // the whole link panel
                    {
                        routing: go.Link.AvoidsNodes,
                        curve: go.Link.JumpOver,
                        corner: 5,
                        toShortLength: 4,
                        relinkableFrom: true,
                        relinkableTo: true,
                        reshapable: true,
                        resegmentable: true,
                        // mouse-overs subtly highlight links:
                        mouseEnter: function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "rgba(30,144,255,0.2)";
                        },
                        mouseLeave: function (e, link) {
                            link.findObject("HIGHLIGHT").stroke = "transparent";
                        },
                        selectionAdorned: false
                    },
                    new go.Binding("points").makeTwoWay(),
                    $(go.Shape, // the highlight shape, normally transparent
                        {
                            isPanelMain: true,
                            strokeWidth: 8,
                            stroke: "transparent",
                            name: "HIGHLIGHT"
                        }),
                    $(go.Shape, // the link path shape
                        {
                            isPanelMain: true,
                            stroke: "gray",
                            strokeWidth: 2
                        },
                        new go.Binding("stroke", "isSelected", function (sel) {
                            return sel ? "dodgerblue" : "gray";
                        }).ofObject()),
                    $(go.Shape, // the arrowhead
                        {
                            toArrow: "standard",
                            strokeWidth: 0,
                            fill: "gray"
                        }),
                    $(go.Panel, "Auto", // the link label, normally not visible
                        {
                            visible: false,
                            name: "LABEL",
                            segmentIndex: 2,
                            segmentFraction: 0.5
                        },
                        new go.Binding("visible", "visible").makeTwoWay(),
                        $(go.Shape, "RoundedRectangle", // the label shape
                            {
                                fill: "#F8F8F8",
                                strokeWidth: 0
                            }),
                        $(go.TextBlock, "Yes", // the label
                            {
                                textAlign: "center",
                                font: "10pt helvetica, arial, sans-serif",
                                stroke: "#333333",
                                editable: true
                            },
                            new go.Binding("text").makeTwoWay())
                    )
                );

            // Make link labels visible if coming out of a "conditional" node.
            // This listener is called by the "LinkDrawn" and "LinkRelinked" DiagramEvents.
            this.myDiagram.contextMenu =
                $("ContextMenu",
                    makeButton("粘贴",
                        function (e, obj) {
                            e.diagram.commandHandler.pasteSelection(e.diagram.lastInput.documentPoint);
                        },
                        function (o) {
                            return o.diagram.commandHandler.canPasteSelection();
                        }),
                    makeButton("撤销",
                        function (e, obj) {
                            e.diagram.commandHandler.undo();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canUndo();
                        }),
                    makeButton("重做",
                        function (e, obj) {
                            e.diagram.commandHandler.redo();
                        },
                        function (o) {
                            return o.diagram.commandHandler.canRedo();
                        })
                );

            function showLinkLabel(e) {
                var label = e.subject.findObject("LABEL");
                if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
            }

            // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
            this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
            this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;
            this.myDiagram.addDiagramListener("ChangedSelection", function (diagramEvent, listener) {
                console.log('ChangedSelection')
                console.log(that.myDiagram.selection)
                let index = 0,
                    selection = {}
                that.myDiagram.selection.each(function (nodeOrLink) {
                    if (index == 0)
                        selection = nodeOrLink.data
                    index++
                });
                if (selection.name)
                    that.setDetails(selection)
                // else that.close = false
            });
            this.myDiagram.addDiagramListener("BackgroundSingleClicked", function (diagramEvent) {
                console.log('BackgroundSingleClicked')
                that.close = false
            });
            this.load(); // load an initial diagram from some diagramJson text

            this.myPalette2()
            var myOverview = $(go.Overview, "myOverviewDiv",  // the HTML DIV element for the Overview
             { observed: that.myDiagram, contentAlignment: go.Spot.Center });   // tell it which Diagram to show and pan
        },
        myPalette2() {
            let $ = go.GraphObject.make; // for conciseness in defining templates
            let myDiagram =
                $(go.Diagram, "hiddenDia");

            function nodeStyle() {
                return [
                    new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
                    {
                        locationSpot: go.Spot.Center
                    }
                ];
            }

            function textStyle() {
                return {
                    // font: "bold 11pt Helvetica, Arial, sans-serif",
                    stroke: "#000",
                    textAlign: "center",
                }
            }

            function makePort(name, align, spot, output, input) {
                var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
                // the port is basically just a transparent rectangle that stretches along the side of the node,
                // and becomes colored when the mouse passes over it
                return $(go.Shape, {
                    fill: "transparent", // changed to a color in the mouseEnter event handler
                    strokeWidth: 0, // no stroke
                    width: horizontal ? NaN : 8, // if not stretching horizontally, just 8 wide
                    height: !horizontal ? NaN : 8, // if not stretching vertically, just 8 tall
                    alignment: align, // align the port on the main Shape
                    stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
                    portId: name, // declare this object to be a "port"
                    fromSpot: spot, // declare where links may connect at this port
                    fromLinkable: output, // declare whether the user may draw links from here
                    toSpot: spot, // declare where links may connect at this port
                    toLinkable: input, // declare whether the user may draw links to here
                    cursor: "pointer", // show a different cursor to indicate potential link point
                    mouseEnter: function (e, port) { // the PORT argument will be this Shape
                        if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
                    },
                    mouseLeave: function (e, port) {
                        port.fill = "transparent";
                    }
                });
            }
            myDiagram.nodeTemplateMap.add("", // the default category
                $(go.Node, "Table", nodeStyle(),
                    // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
                    // $(go.Panel, "Table",
                    $(go.Panel, "Position",
                        $(go.Picture, {
                                name: "Picture",
                                desiredSize: new go.Size(40, 40),
                                position: new go.Point(0, 0),
                                // margin: new go.Margin(6, 8, 6, 10),
                                // background:'#ddd'
                            },
                            new go.Binding("source", "img"),
                        ),
                    ),
                    $(go.Panel, "Position",
                        $(go.TextBlock, textStyle(), {
                                margin: new go.Margin(0, 3),
                                width: 80,
                                // height: 30,
                                editable: true,
                                position: new go.Point(0, 70),
                            },
                            new go.Binding("text", "name"))
                    ),
                    // four named ports, one on each side:
                    makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
                    makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
                    makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
                    makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
                ));
                for(let i=0;i<this.nodeTypes.length;i++){
                    let type = this.nodeTypes[i],nodes=[]
                    for(let a of this.nodes){
                        if(a.type == type){
                            nodes.push(a)
                        }
                    }
                    $(go.Palette, "myPaletteDiv"+i, // must name or refer to the DIV HTML element
                    {
                        nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by this.myDiagram
                        model: new go.GraphLinksModel(nodes)
                    });
                }
                return
            $(go.Palette, "myPaletteDiv2", // must name or refer to the DIV HTML element
                {
                    nodeTemplateMap: myDiagram.nodeTemplateMap, // share the templates used by this.myDiagram
                    model: new go.GraphLinksModel([ // specify the contents of the Palette
                        {
                            name: "Start",
                            nameKey: 1,
                            img: "static/assets/img/icon_mysql.png"
                        },
                        {
                            name: "Step",
                            testxu: 'test',
                            nameKey: 2,
                            img: "static/assets/img/icon_mysql.png"
                        },
                        {
                            name: "Step",
                            testxu: 'test',
                            nameKey: 3,
                            img: "static/assets/img/icon_mysql.png"
                        },
                        {
                            name: "Step",
                            testxu: 'test',
                            nameKey: 4,
                            img: "static/assets/img/icon_mysql.png"
                        },
                        {
                            name: "Step",
                            testxu: 'test',
                            nameKey: 5,
                            img: "static/assets/img/icon_mysql.png"
                        },
                    ])
                });
        },
        submit(success) {
            success(this.myDiagram.model.toJson())
            this.myDiagram.isModified = false;
        },
        load() {
            this.myDiagram.model = go.Model.fromJson(this.diagramJson);
        },
        printDiagram() {
            var svgWindow = window.open();
            if (!svgWindow) return; // failure to open a new Window
            var printSize = new go.Size(700, 960);
            var bnds = this.myDiagram.documentBounds;
            var x = bnds.x;
            var y = bnds.y;
            while (y < bnds.bottom) {
                while (x < bnds.right) {
                    var svg = this.myDiagram.makeSVG({
                        scale: 1.0,
                        position: new go.Point(x, y),
                        size: printSize
                    });
                    svgWindow.document.body.appendChild(svg);
                    x += printSize.width;
                }
                x = bnds.x;
                y += printSize.height;
            }
            setTimeout(function () {
                svgWindow.print();
            }, 1);
        },
        setDetails(data) {
            console.log(data)
            this.checkData = data
            this.checkNodeKey = data.key
            this.$emit('showDetail',data)
        },
        getNodesByType(type){
            let nodes = []
            for (let a of this.nodes) {
                    if (a.type == type) {
                        nodes.push(a)
                    }
                }
                return nodes
        },
        handlerHeight(item){
            let nodes =  this.getNodesByType(item)
            let height = nodes.length*120
            if(height>400) height=400
            return height
        }
    },
    beforeRouteLeave(to, from, next) {
        this.close = false
        next()
    },
    components: {
        detail1,chartSvg
    },
    watch:{
        nodeTypes(){
            this.copyNodeTypes = this.nodeTypes.slice()
        }
    }
}
</script>

<style scoped>
    #sample{
        padding: 5px 10px;
    }
</style>
<style>
.hiddendrawer .ivu-drawer-mask {
    display: none;
}

.hiddendrawer .ivu-drawer-wrap {
    width: 0px;
}

#sample .ivu-collapse-content {
    padding: 0;
}

#sample .ivu-collapse-content-box {
    padding: 0;
}
.media-nodes,.node-detail{
 width:150px
}
#sample .node-tool{
margin:5px 0 5px 0
}
@media screen and (max-width: 1280px){
    /* .media-nodes,.node-detail{
        width:100px;
    } */
    /* #sample .node-tool{
margin:5px 0 5px 100px
} */
}
</style>
