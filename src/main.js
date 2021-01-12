import Vue from 'vue'
import App from './App.vue'
import axios from './utils/http'
import store from "./store/index";

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/a11y-light.css'

import { Button,Select,Option,Cell, Table,Form,FormItem,Row,Col,
  Icon,Poptip,Checkbox,CheckboxGroup,Input,Page,Modal,Dropdown,DropdownMenu,Tree,Switch,
  Tabs,TabPane,Split,TimePicker,InputNumber,DatePicker,Radio,RadioGroup,Card,Upload
  ,Message,Spin } from 'view-design';
import 'view-design/dist/styles/iview.css'
Vue.component('Button', Button);
Vue.component('i-button', Button);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('Cell', Cell);
Vue.component('Table', Table);
Vue.component('Form', Form);
Vue.component('i-form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Row', Row);
Vue.component('i-row', Row);
Vue.component('Col', Col);
Vue.component('i-col', Col);
Vue.component('Icon', Icon);
Vue.component('Poptip', Poptip);
Vue.component('Checkbox', Checkbox);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('Input', Input);
Vue.component('i-input', Input);
Vue.component('Page', Page);
Vue.component('spin', Spin);
Vue.component('Modal', Modal);
Vue.component('Dropdown', Dropdown);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('Tree', Tree);
Vue.component('i-switch', Switch);
Vue.component('Switch', Switch);
Vue.component('Tabs', Tabs);
Vue.component('TabPane', TabPane);
Vue.component('Split', Split);
Vue.component('TimePicker', TimePicker);
Vue.component('input-number', InputNumber);
Vue.component('DatePicker', DatePicker);
Vue.component('Radio', Radio);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Card', Card);
Vue.component('Upload', Upload);

Vue.prototype.$Message=Message

Vue.prototype.$http = axios

import { TaskNode } from '../self_node_modules/vue-task-node'
import '../self_node_modules/vue-task-node/src/css/vnode.css'
Vue.use(TaskNode)


Vue.use(VueHighlightJS)
Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
