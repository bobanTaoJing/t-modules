let ip =window.IPS.ip
// let ip ='http://192.168.2.124:40001'
let setChart = function(obj,dataTable){
    // console.log(obj,dataTable)
    let chartValue = {}
    if(obj.xString1){
        if(obj.yString1){
            if(obj.chartType=='bar'){
                //柱状图
                let xAxisData = []
                let seriesData = []
                for(let a of dataTable){
                    xAxisData.push(a[obj.xString1])
                    seriesData.push(a[obj.yString1])
                }
                chartValue.xAxisData = xAxisData
                chartValue.seriesData = seriesData
            }else if(obj.chartType=='line'){
                //线段
                let xData = []
                let seriesData = []
                for(let a of dataTable){
                    xData.push(a[obj.xString1])
                    seriesData.push(a[obj.yString1])
                }
                chartValue = {
                    xData,
                    value:[
                        {name:'',value:seriesData,color:'#509EE3'}
                    ]
                }
            }else if(obj.chartType=='pie'){
                //饼图
                chartValue = {
                    value:{}
                }
                let data = {}
                for(let a of dataTable){
                    data[a[obj.xString1]] = {value:a[obj.yString1]}
                }
                chartValue.value = data
            }else if(obj.chartType=='map'){
                //地图
                chartValue = {
                    value:[]
                }
                let data = []
                for(let a of dataTable){
                    data.push({
                        name:a[obj.xString1],
                        value:a[obj.yString1]
                    })
                }
                chartValue.value = data
            }
        }else{
            if(obj.chartType=='number'){
               //数字
            //    console.log(dataTable)
               chartValue = {
                   value:dataTable[0][obj.xString1]
               }
               // let data = {}
               // for(let a of dataTable.slice(0,5)){
               //     data[a[obj.xString1]] = {value:a[obj.yString1]}
               // }
               // chartValue.value = data
           }
        }
    }
    // console.log(chartValue)
    return chartValue
}
export {ip,setChart}