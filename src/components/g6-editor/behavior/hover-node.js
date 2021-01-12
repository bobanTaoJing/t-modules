export default {
    getEvents() {
        return {
            'node:mouseover': 'onMouseover',
            'node:mouseleave': 'onMouseleave',
            "node:mousedown": "onMousedown"
        };
    },
    onMouseover(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        const group = item.getContainer()
        if (e.target._attrs.isOutPointOut || e.target._attrs.isOutPoint) {
            group.find(g => {
                if (g._attrs.isInPoint || g._attrs.isOutPoint) {
                    g.attr("fill", "#fff")
                }
                if (g._attrs.isOutPoint) {
                    if (g._attrs.id === e.target._attrs.parent) {
                        group.find(gr => {
                            if (gr._attrs.id === g._attrs.id) {
                                gr.attr('fill', "#1890ff")
                                gr.attr('opacity',1)
                            }
                        })
                    }
                    if (g._attrs.id === e.target._attrs.id) {
                        g.attr("fill", "#1890ff")
                        g.attr('opacity',1)
                    }

                }
            });
            e.target.attr("cursor", "crosshair");
            this.graph.paint();
        }
        if (item.hasState('selected')) {
            return
        } else {
            if (self.shouldUpdate.call(self, e)) {
                graph.setItemState(item, 'hover', true);
            }
        }
        graph.paint();
        //hover 节点 内部元素
        const shape = e.target
        let className = shape.get('className')
        if(className&&className.indexOf('HOVER_CLASS')>-1){
            //如果hover 
            let obj = item._cfg.model.objects,index = parseInt(className.split('HOVER_CLASS')[1])
            for(let a of obj){
                a.showLongName = false
            }
            obj[index].showLongName = true
            // alert(obj[index].name)
            graph.updateItem(item, {
                objects:obj
              });
        }
    },
    onMouseleave(e) {
        const self = this;
        const item = e.item;
        const graph = self.graph;
        const group = item.getContainer()
        group.find(g => {
            if (g._attrs.isInPoint || g._attrs.isOutPoint) {
                g.attr("fill", "#fff")
            }
        });
        if (self.shouldUpdate.call(self, e)) {
            if(!item.hasState('selected'))
            graph.setItemState(item, 'hover', false);
        }
        graph.paint();
        //onMouseleave 节点 内部元素
        if(item._cfg.model.nodeType=='table'){
            let obj = item._cfg.model.objects
            if(obj){
                for(let a of obj){
                    a.showLongName = false
                }
                graph.updateItem(item, {
                    objects:obj
                  });
            }
        }
    },
    onMousedown(e) {
        if(e.target._attrs.isOutPoint ||e.target._attrs.isOutPointOut){
            this.graph.setMode('addEdge')
        }else{
            this.graph.setMode('moveNode')
        }
    },

};
