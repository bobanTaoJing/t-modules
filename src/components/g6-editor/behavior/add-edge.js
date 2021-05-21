
import eventBus from "../../../components/g6-editor/utils/eventBus";
import { uniqueId } from '../../../components/g6-editor/utils'
import {Message} from 'view-design';
import http from '../../../utils/http.js'
let startPoint = null
let startItem = null
let endPoint = {}
let activeItem = null
let curInPoint = null
let ip = ''
let headers = {}
export default {
    setIP(obj){
        ip = obj.ip
        headers = obj.headers
    },
    getEvents() {
        return {
            mousemove: 'onMousemove',
            mouseup: 'onMouseup',
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave'
        };
    },
    onMouseup(e) {
        console.log(e)
        const item = e.item
        if (item && item.getType() === 'node') {
            const group = item.getContainer()
            if (e.target._attrs.isInPoint) {
                const children = group._cfg.children
                children.map(child => {
                    if (child._attrs.isInPointOut && child._attrs.parent === e.target._attrs.id) {
                        activeItem = child
                    }
                })
                curInPoint = e.target
            } else if (e.target._attrs.isInPointOut) {
                activeItem = e.target
                const children = group._cfg.children
                children.map(child => {
                    if (child._attrs.isInPoint && child._attrs.id === e.target._attrs.parent) {
                        curInPoint = child
                    }
                })
            }
            if (activeItem) {
                let width = 0
                if(item._cfg.model.nodeType=="circle")
                    width = parseInt(item._cfg.model.size[0])
                const endX = parseInt(curInPoint._attrs.x + width/2)
                const endY = parseInt(curInPoint._attrs.y)
                endPoint = { x: endX, y: endY };
                if (this.edge) {
                    this.graph.removeItem(this.edge);
                    let id = 'edge' + (parseInt(uniqueId())+1)
                    const model = {
                        id,
                        source: startItem,
                        target: item,
                        sourceId: startItem._cfg.id,
                        targetId: item._cfg.id,
                        start: startPoint,
                        end: endPoint,
                        connectName:'验证中',
                        shape: 'customEdge',
                        type: 'edge'
                    }
                    let bcStartItem = startItem
                    eventBus.$emit('addItem', model)
                    let sourceItem = startItem._cfg.model.insert_data
                    let targetItem = item._cfg.model.insert_data
                    let params = {
                        source:{
                            key:sourceItem.key,
                            isAutoLoadSchema:sourceItem.isAutoLoadSchema,
                            schema:sourceItem.schema,
                        },
                        target:{
                            key:targetItem.key,
                            isAutoLoadSchema:targetItem.isAutoLoadSchema,
                            schema:targetItem.schema,
                        }
                    }
                    http.apiPostJson(ip+'/job/stream/node/config/verify/connect',params,{headers})
                        .then(res=>{
                            if(res.success){
                                this.graph.find("edge", edge => {
                                    console.log(edge._cfg.id)
                                    console.log(id)
                                    if(edge._cfg.id == id){
                                        this.graph.removeItem(edge)
                                    }
                                })
                                const model = {
                                    id,
                                    source: bcStartItem,
                                    target: item,
                                    sourceId: bcStartItem._cfg.id,
                                    targetId: item._cfg.id,
                                    start: startPoint,
                                    end: endPoint,
                                    connectName:res.data.connectName,
                                    shape: 'customEdge',
                                    type: 'edge'
                                }
                                eventBus.$emit('addItem', model)
                            }else{
                                this.graph.find("edge", edge => {
                                    console.log(edge._cfg.id)
                                    console.log(id)
                                    if(edge._cfg.id == id){
                                        this.graph.removeItem(edge)
                                    }
                                })
                                Message.error({
                                    content:res.message,
                                    duration:3
                                })
                            }
                        })
                }
            } else {
                if (this.edge)
                    this.graph.removeItem(this.edge);
            }
        } else {
            if (this.edge)
                this.graph.removeItem(this.edge);
        }
        this.graph.find("node", node => {
            const group = node.get('group')
            const children = group._cfg.children
            children.map(child => {
                if (child._attrs.isInPointOut) {
                    child.attr("opacity", "0")
                }
                if (child._attrs.isInPoint) {
                    child.attr("opacity", "0")
                }
                if (child._attrs.isOutPoint) {
                    child.attr("opacity", "0")
                    child.attr("fill", "#fff")
                }
            })
        })
        if (startItem) {
            this.graph.setItemState(startItem, 'hover', false);
        }

        this.graph.paint()
        startPoint = null
        startItem = null
        endPoint = {}
        activeItem = null
        curInPoint = null
        this.graph.setMode('default')
    },
    onMousemove(e) {
        const item = e.item
        if (!startPoint) {
            this.graph.find("node", node => {
                const group = node.get('group')
                const children = group._cfg.children
                children.map(child => {
                    let sourceId = item._cfg.id,targetId = child._cfg.parent._cfg.id
                    if(this.showInports(sourceId, targetId)){
                        if (child._attrs.isInPointOut) {
                            child.attr("opacity", "0.3")
                        }
                        if (child._attrs.isInPoint) {
                            child.attr("opacity", "1")
                        }
                    }
                })
            })
            let width = 0
            if(item._cfg.model.nodeType=="circle")
                width = parseInt(item._cfg.model.size[0])
            const startX = parseInt(e.target._attrs.x - width/2)
            const startY = parseInt(e.target._attrs.y)
            startPoint = { x: startX, y: startY };
            startItem = item
            this.edge = this.graph.addItem('edge', {
                source: item,
                target: item,
                start: startPoint,
                end: startPoint,
                shape: 'link-edge'
            });
        } else {
            const point = { x: e.x, y: e.y };
            if (this.edge) {
                // 增加边的过程中，移动时边跟着移动
                this.graph.updateItem(this.edge, {
                    //  start: startPoint,
                    target: point
                });
            }
        }
    },
    //判断可连接的点
    showInports(sourceId1,targetId1){
        console.log('判断')
        let can=true
        this.graph.find("edge", edge => {
            let sourceId = edge._cfg.source._cfg.id
            let targetId = edge._cfg.target._cfg.id
            if(sourceId1==sourceId&&targetId1==targetId) can = false
            if(sourceId1==targetId&&targetId1==sourceId) can = false
        })
        if(sourceId1==targetId1) can = false
        
        return can
    },
    onMouseover(e) {
        const item = e.item
        if (item && item.getType() === 'node') {
            if (e.target._attrs.isInPointOut && !this.hasTran) {
                this.hasTran = true
                e.target.transform([
                    ['t', 0, 3],
                    ['s', 1.2, 1.2],
                ])
            }
            this.graph.paint()
        }
    },
    onMouseleave() {
        this.graph.find("node", node => {
            const group = node.get('group')
            const children = group._cfg.children
            children.map(child => {
                if (child._attrs.isInPointOut) {
                    child.resetMatrix()
                }
            })
        })
        this.hasTran = false
        this.graph.paint()
    }
}
