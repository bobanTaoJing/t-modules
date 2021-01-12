import axios from './utils/http'

  import tTable from './components/tTable'
  import CrudView from './components/views/CrudView'
  import FormDynamic from './components/form/FormDynamic'
  import NumberUp from './components/count/NumberUp'
  import ChartSvg from './components/charts/svg'

// 导出模块
let components = [
  tTable,CrudView,FormDynamic,NumberUp,ChartSvg
]

export {
    axios,tTable,CrudView,FormDynamic,NumberUp,ChartSvg
}