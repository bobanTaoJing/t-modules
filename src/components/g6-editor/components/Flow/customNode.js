import G6 from "@antv/g6/build/g6";
import { uniqueId,fittingString } from '@/components/g6-editor/utils'
import Shape from '@antv/g/src/shapes'
const textColor = '#565758'
const textHoverColor = '#fff'
const customNode = {
  init() {
    G6.registerNode("customNode", {
      draw(cfg, group) {
        let size = cfg.size;
        if(!size){
          size=[170,34]
        }
        // 此处必须是NUMBER 不然bbox不正常
        const width = parseInt(size[0]);
        //如果 nodeType是table 则自适应高度
        let height = parseInt(size[1]);
        if(cfg.nodeType=='table'&&cfg.objects)
          height+=cfg.objects.length*25
        const color = cfg.color;
        // 此处必须有偏移 不然drag-node错位
        const offsetX = -width / 2
        const offsetY = -height / 2

        const mainId = 'rect' + uniqueId()
        const shape = group.addShape(cfg.nodeType=='circle'?"circle":'rect', {
          attrs: {
            id: mainId,
            x: cfg.nodeType=='circle'?offsetX+width/2:offsetX,
            y: cfg.nodeType=='circle'?offsetY+width/2:offsetY,
            width: width,
            height: height,
            stroke: color,
            fill: color,//此处必须有fill 不然不能触发事件
            radius: 4,
            r:width/2,
            opacity:.3,
          }
        });
        // group.addShape("rect", {
        //   attrs: {
        //     x: offsetX,
        //     y: offsetY,
        //     width: 4,
        //     height: height,
        //     fill: color,
        //     parent: mainId,
        //     radius: [4, 0, 0, 4]
        //   }
        // });
       
        //表类型
        if(cfg.nodeType=='table'){
          if (cfg.label){
            group.addShape("text", {
              attrs: {
                id: 'label' + uniqueId(),
                x: offsetX + width/2,
                y: offsetY + 10,
                textAlign: "center",
                textBaseline: "top",
                text: cfg.label,
                parent: mainId,
                fill: textColor,
                fontSize:18,
                fontWeight:600
              }
            });
          }
          let inPoints = [],outPoints=[]
          if(cfg.objects){
            for(let i=0;i<cfg.objects.length;i++){
              let a = cfg.objects[i]
              a.showName = fittingString(a.name,50,16)
              let hoverText =  group.addShape("text", {
                attrs: {
                  // id: 'label' + uniqueId(),
                  width:50,
                  x: offsetX + 20,
                  y: offsetY + (i+1)*25 + 10,
                  textAlign: "left",
                  textBaseline: "top",
                  text: a.showName,
                  parent: mainId,
                  fill: textColor,
                  fontSize:16
                }
              });
              
              hoverText.set('className', 'HOVER_CLASS'+i);
              group.addShape("text", {
                attrs: {
                  // id: 'label' + uniqueId(),
                  width:50,
                  x: offsetX + width-20,
                  y: offsetY + (i+1)*25 + 10,
                  textAlign: "right",
                  textBaseline: "top",
                  text: a.type,
                  parent: mainId,
                  fill: textColor,
                  fontSize:12
                }
              });
              //自动配置输入输入节点位置
              inPoints.push([(i+1)*25 + 10 +7 ,0])
              outPoints.push([(i+1)*25 + 10+7,width])
            }
            if(inPoints){
              for (let i = 0; i < inPoints.length; i++) {
                let x=inPoints[i][1],
                  y = inPoints[i][0];
                const id = 'circle' + uniqueId()
                group.addShape("circle", {
                  attrs: {
                    id: 'circle' + uniqueId(),
                    parent: id,
                    x: x + offsetX,
                    y: y + offsetY,
                    r: 15,
                    isInPointOut: true,
                    fill: "#1890ff",
                    opacity: 0
                  }
                });
                group.addShape("circle", {
                  attrs: {
                    id: id,
                    x: x + offsetX,
                    y: y + offsetY,
                    r: 8,
                    isInPoint: true,
                    fill: "#fff",
                    stroke: "#1890ff",
                    opacity: 0
                  }
                });
              }
            }
            if(outPoints){
              for (let i = 0; i < outPoints.length; i++) {
                let x=outPoints[i][1],
                  y = outPoints[i][0];
                const id = 'circle' + uniqueId()
                group.addShape("circle", {
                  attrs: {
                    id: 'circle' + uniqueId(),
                    parent: id,
                    x: x + offsetX,
                    y: y + offsetY,
                    r: 15,
                    isOutPointOut: true,
                    fill: "#1890ff",
                    opacity: 0//默認0 需要時改成0.3
                  }
                });
                group.addShape("circle", {
                  attrs: {
                    id: id,
                    x: x + offsetX,
                    y: y + offsetY,
                    r: 8,
                    isOutPoint: true,
                    fill: "#fff",
                    stroke: "#1890ff",
                    opacity: 0
                  }
                });
              }
            }
          }
        }else if(cfg.nodeType=='circle'){
          if (cfg.label){
            group.addShape("text", {
              attrs: {
                id: 'label' + uniqueId(),
                x: offsetX + width/2,
                y: offsetY + height/2,
                textAlign: "center",
                textBaseline: "middle",
                text: cfg.label,
                parent: mainId,
                fill: textColor
              }
            });
          }
          if (cfg.inPoints) {
            for (let i = 0; i < cfg.inPoints.length; i++) {
              const id = 'circle' + uniqueId()
              group.addShape("circle", {
                attrs: {
                  id: 'circle' + uniqueId(),
                  parent: mainId,
                  x: 0 + offsetX,
                  y: height/2 + offsetY,
                  r: 20,
                  isInPointOut: true,
                  fill: "#1890FF",
                  opacity: 0
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: mainId,
                  x: 0 + offsetX,
                  y: height/2 + offsetY,
                  r: 3,
                  isInPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
          }
          if (cfg.outPoints) {
            for (let i = 0; i < cfg.outPoints.length; i++) {
              const id = 'circle' + uniqueId()
              group.addShape("circle", {
                attrs: {
                  id: 'circle' + uniqueId(),
                  parent: mainId,
                  x: width + offsetX,
                  y: height/2 + offsetY,
                  r: 10,
                  isOutPointOut: true,
                  fill: "#1890ff",
                  opacity: 0//默認0 需要時改成0.3
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  parent:mainId,
                  x: width + offsetX,
                  y: height/2 + offsetY,
                  r: 3,
                  isOutPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
          }
        }else{
          group.addShape("image", {
            attrs: {
              x: offsetX + 16,
              y: offsetY + 8,
              width: 20,
              height: 16,
              img: cfg.image,
              parent: mainId
            }
          });
          group.addShape("image", {
            attrs: {
              x: offsetX + width - 32,
              y: offsetY + 8,
              width: 16,
              height: 16,
              parent: mainId,
              img: cfg.stateImage
            }
          });
          if(cfg.backImage){
            const clip = new Shape.Rect({
              attrs: {
                x: offsetX,
                y: offsetY,
                width: width,
                height: height,
                fill:'#fff',
                radius: 4
              }
          });
            group.addShape("image", {
              attrs: {
                x: offsetX,
                y: offsetY,
                width: width,
                height: height,
                img: cfg.backImage,
                clip: clip
              }
            });
          }
          if (cfg.label){
            group.addShape("text", {
              attrs: {
                id: 'label' + uniqueId(),
                x: offsetX + width/2,
                y: offsetY + height/2,
                textAlign: "center",
                textBaseline: "middle",
                text: cfg.label,
                parent: mainId,
                fill: textColor
              }
            });
          }
          if (cfg.inPoints) {
            for (let i = 0; i < cfg.inPoints.length; i++) {
              let x,
                y = 0;
              //0为顶 1为底
              if (cfg.inPoints[i][0] === 0) {
                y = 0;
              } else {
                  y = height * cfg.inPoints[i][0];
              }
              x = width * cfg.inPoints[i][1];
              const id = 'circle' + uniqueId()
              group.addShape("circle", {
                attrs: {
                  id: 'circle' + uniqueId(),
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 10,
                  isInPointOut: true,
                  fill: "#1890ff",
                  opacity: 0
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isInPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
          }
          if (cfg.outPoints) {
            for (let i = 0; i < cfg.outPoints.length; i++) {
              let x,
                y = 0;
              //0为顶 1为底
              if (cfg.outPoints[i][0] === 0) {
                y = 0;
              } else {
                y = height;
              }
              x = width * cfg.outPoints[i][1];
              const id = 'circle' + uniqueId()
              group.addShape("circle", {
                attrs: {
                  id: 'circle' + uniqueId(),
                  parent: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 10,
                  isOutPointOut: true,
                  fill: "#1890ff",
                  opacity: 0//默認0 需要時改成0.3
                }
              });
              group.addShape("circle", {
                attrs: {
                  id: id,
                  x: x + offsetX,
                  y: y + offsetY,
                  r: 3,
                  isOutPoint: true,
                  fill: "#fff",
                  stroke: "#1890ff",
                  opacity: 0
                }
              });
            }
          }
        }
        //group.sort()
        // 添加文本、更多图形
        return shape;
      },
      //设置状态
      setState(name, value, item) {
        const group = item.getContainer();
        const shape = group.get("children")[0]; // 顺序根据 draw 时确定

        const children = group.findAll(g => {
          return g._attrs.parent === shape._attrs.id
        });
        const texts = group.findAll(g => {
          return g._cfg.type==='text'
        });
        const circles = group.findAll(circle => {
          return circle._attrs.isInPoint || circle._attrs.isOutPoint;
        });
        const selectStyles = () => {
          // shape.attr("fill", "#f3f9ff");
          // shape.attr("stroke", "#6ab7ff");
          shape.attr("opacity", .8);
          // shape.attr("cursor", "move");
          // children.forEach(child => {
          //   child.attr("cursor", "move");
          // });
          texts.forEach(text => {
            text.attr('fill', textHoverColor)
          })
          circles.forEach(circle => {
            circle.attr('opacity', 1)
          })
        };
        const unSelectStyles = () => {
          // shape.attr("fill", color);
          // shape.attr("stroke", "#ced4d9");
          texts.forEach(text => {
            text.attr('fill', textColor)
          })
          shape.attr("opacity", .3);
          circles.forEach(circle => {
            circle.attr('opacity', 0)
          })
          
        };
        switch (name) {
          case "selected":
          case "hover":
            if (value) {
              selectStyles()
            } else {
              unSelectStyles()
            }
            break;
        }
      }
    });
  }
}

export default customNode
