import G6 from "@antv/g6/build/g6";
import hoverNode from './hover-node'
import addLine from './add-edge'
import dragItem from './drag-item'
import selectNode from './select-node'
import hoverEdge from "./hover-edge";
import keyboard from './keyboard'
import mulitSelect from './mulit-select'
import addMenu from './add-menu'

import selectNode2 from './select-node2'

const behavors = {
    'hover-node': hoverNode,
    'add-edge': addLine,
    'drag-item': dragItem,
    'select-node': selectNode,
    'hover-edge': hoverEdge,
    'keyboard':keyboard,
    'mulit-select':mulitSelect,
    'add-menu':addMenu,
    'select-node2':selectNode2
}

export function initBehavors(obj) {
    addLine.setIP(obj)
    for (let key in behavors) {
        G6.registerBehavior(key, behavors[key])
    }
}


