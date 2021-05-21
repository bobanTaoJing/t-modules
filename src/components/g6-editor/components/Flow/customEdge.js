import G6 from "@antv/g6/build/g6";
import { uniqueId } from '../../../../components/g6-editor/utils'
const MIN_ARROW_SIZE = 3
const YZ_COLOR = '#c3bb5c98'
const YZ_COLOR_HOVER = '#c3bb5c'
const TG_COLOR = '#3BAF6A98'
const TG_COLOR_HOVER = '#3BAF6A'

const customEdge = {
  init() {
    const dashArray = [
      [0, 1],
      [0, 2],
      [1, 2],
      [0, 1, 1, 2],
      [0, 2, 1, 2],
      [1, 2, 1, 2],
      [2, 2, 1, 2],
      [3, 2, 1, 2],
      [4, 2, 1, 2]
    ];

    const lineDash = [4,2,1,2];
    const interval = 9;
    G6.registerEdge('customEdge', {
      draw(cfg, group) {
        let sourceNode, targetNode, start, end
        if (typeof (cfg.source) === 'string') {
          cfg.source = cfg.sourceNode
        }
        if(!cfg.start){
          cfg.start={
            x:0,
            y:17
          }
        }
        if(!cfg.end){
          cfg.end={
            x:0,
            y:-17
          }
        }
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel()
          start = { x: sourceNode.x + 40, y: sourceNode.y + 0 }
        } else {
          start = cfg.source
        }
        if (typeof (cfg.target) === 'string') {
          cfg.target = cfg.targetNode
        }
        if (!cfg.target.x) {

          targetNode = cfg.target.getModel()
          end = { x: targetNode.x +-40, y: targetNode.y +  0 }
        } else {
          end = cfg.target
        }

        let path = []
        let hgap = Math.abs(end.x - start.x)
        if (end.x > start.x) {
          path = [
            ['M', start.x, start.y],
            // [
            //   'C',
            //   start.x,
            //   start.y + hgap / (hgap / 50),
            //   end.x,
            //   end.y - hgap / (hgap / 50),
            //   end.x,
            //   end.y - 4
            // ],
            [
              'L',
              end.x,
              end.y
            ]
          ]
        } else {
          path = [
            ['M', start.x, start.y],
            [
              'C',
              start.x,
              start.y + hgap / (hgap / 50),
              end.x,
              end.y - hgap / (hgap / 50),
              end.x,
              end.y - 4
            ],
            [
              'L',
              end.x,
              end.y
            ]
          ]
        }
        let lineWidth = 3;
        lineWidth = lineWidth > MIN_ARROW_SIZE ? lineWidth : MIN_ARROW_SIZE;
        const width = lineWidth * 10 / 3;
        const halfHeight = lineWidth * 4 / 3;
        const radius = lineWidth * 4;
        const endArrowPath = [
          ['M', -width, halfHeight],
          ['L', 0, 0],
          ['L', -width, -halfHeight],
          ['A', radius, radius, 0, 0, 1, -width, halfHeight],
          ['Z']
        ];
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            name:'test',
            lineWidth,
            path: path,
            stroke: cfg.connectName=='验证中'?YZ_COLOR:TG_COLOR,
            lineAppendWidth: 10,
            endArrow: {
              path: endArrowPath,
            }
          }
        });
        return keyShape
      },
      afterDraw(cfg, group) {
        // if (cfg.source.getModel().isDoingStart && cfg.target.getModel().isDoingEnd) {
        if (true) {
          const shape = group.get('children')[0];
          const length = shape.getTotalLength(); // G 增加了 totalLength 的接口
          let totalArray = [];
          for (var i = 0; i < length; i += interval) {
            totalArray = totalArray.concat(lineDash);
          }
          let index = 0;
          shape.animate({
            onFrame() {
              const cfg = {
                lineDash: dashArray[index].concat(totalArray)
              };
              index = (index + 1) % interval;
              return cfg;
            },
            repeat: true
          }, 5000);
          const midPoint = shape.getPoint(0.5);
          // 在中点增加一个矩形，注意矩形的原点在其左上角
          console.log(cfg)
          let getStrWidth = function(temp,size){
              let reg=/^[\u4e00-\u9fa5]+$/,length=0,title=''
              let tempArr = temp.split('')
              for(let a of tempArr){
                  if(reg.test(a)) length+=1
                  else length+.5
              }
              return length*size
          }
          let width = getStrWidth(cfg.connectName,12)
          group.addShape('text', {
            attrs: {
              text:cfg.connectName,
              width:getStrWidth(cfg.connectName,12),
              height: 10,
              fill: cfg.connectName=='验证中'?YZ_COLOR:TG_COLOR,
              // x 和 y 分别减去 width / 2 与 height / 2，使矩形中心在 midPoint 上
              x: midPoint.x - getStrWidth(cfg.connectName,12)/2,
              y: midPoint.y - 5,
            },
          });
        }
      },
      setState(name, value, item) {
        const group = item.getContainer();
        console.log(group)
        const shape = group.get("children")[0];
        const shape2 = group.get("children")[1];
        const selectStyles = () => {
          console.log(shape2)
          if(shape2._cfg.attrs.text=='验证中'){
            shape.attr("stroke", YZ_COLOR_HOVER);
            shape2.attr("fill", YZ_COLOR_HOVER);
          }else{
            shape.attr("stroke", TG_COLOR_HOVER);
            shape2.attr("fill", TG_COLOR_HOVER);
          }
        };
        const unSelectStyles = () => {
          if(shape2._cfg.attrs.text=='验证中'){
            shape.attr("stroke", YZ_COLOR);
            shape2.attr("fill", YZ_COLOR);
          }else{
            shape.attr("stroke", TG_COLOR);
            shape2.attr("fill", TG_COLOR);
          }
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
    G6.registerEdge('link-edge', {
      draw(cfg, group) {
        let sourceNode, targetNode, start, end
        if (!cfg.source.x) {
          sourceNode = cfg.source.getModel()
          start = { x: sourceNode.x + cfg.start.x, y: sourceNode.y + cfg.start.y }
        } else {
          start = cfg.source
        }
        if (!cfg.target.x) {
          targetNode = cfg.target.getModel()
          end = { x: targetNode.x + cfg.end.x, y: targetNode.y + cfg.end.y }
        } else {
          end = cfg.target
        }

        let path = []
        path = [
          ['M', start.x, start.y],
          ['L', end.x, end.y]
        ]
        const keyShape = group.addShape('path', {
          attrs: {
            id: 'edge' + uniqueId(),
            path: path,
            stroke: '#1890FF',
            strokeOpacity: 0.9,
            lineDash: [5, 5]
          }
        });
        return keyShape
      },
    });
  }
}

export default customEdge
