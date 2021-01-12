import axios from './utils/http'

  import tTable from './components/tTable'
  import CrudView from './components/views/CrudView'
  import FormDynamic from './components/form/FormDynamic'
  import NumberUp from './components/count/NumberUp'
  import ChartSvg from './components/charts/svg'
  import ChartBar from './components/charts/bar'
  import ChartLine from './components/charts/line'
  import ChartPie from './components/charts/pie'

// 导出模块
let components = [
  tTable,CrudView,FormDynamic,NumberUp,ChartSvg,ChartBar,ChartLine,ChartPie
]

const install = function(Vue) {
  Vue.prototype.$http = axios
  components.forEach((component) => {
      // console.log(component, index)
      Vue.component(component.name, component);
  })
}
// global 情况下 自动安装
if (typeof window !== 'undefined' && window.Vue) { 
  window.Vue.use(install) 
}
export default{
  install
}