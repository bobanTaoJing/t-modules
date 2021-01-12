import Vue from "vue";
import Vuex from "vuex";
import user from './modules/user'
import getters from './getters'
import { TaskNodeStore } from '../../self_node_modules/vue-task-node'

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        user,
        TaskNodeStore
    },
    getters,
})

export default store