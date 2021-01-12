import * as types from '../mutaion-types'

const user = {
    state: {
        menu: [],
        pmenu:[],
        canAction:true,
        rname:'',
        name:'',
        perm:[],//权限
    },
    mutations: {
        set_menu: (state, menu) => {
            state.menu = menu
        },
        add_menu: (state, menu) => {
            let cmenu = state.menu
            cmenu.push(menu)
            state.menu = cmenu
        },
        del_menu: (state, index) => {
            let cmenu = state.menu
            cmenu.splice(index,1)
            state.menu = cmenu
        },
        set_pmenu: (state, pmenu) => {
            state.pmenu = pmenu
        },
        set_canAction:(state, canAction) => {
            state.canAction = canAction
        },
        set_rname: (state, rname) => {
            state.rname = rname
        },
        set_name: (state, name) => {
            state.name = name
        },
        set_perm: (state, perm) => {
            state.perm = perm
        },
    },
    actions: {
        setMenu({ commit }, { menu }) {
            commit('set_menu', menu)
        },
        addMenu({ commit }, { menu }) {
            commit('add_menu', menu)
        },
        delMenu({ commit }, { index }) {
            commit('del_menu', index)
        },
        setPmenu({ commit }, { pmenu }) {
            commit('set_pmenu', pmenu)
        },
        setCanAction({ commit }, canAction) {
            commit('set_canAction', canAction)
        },
        setRname({ commit }, rname) {
            commit('set_rname', rname)
        },
        setName({ commit }, name) {
            commit('set_name',name)
        },
        setPerm({ commit }, {perm}) {
            commit('set_perm',perm)
        },
    }
}

export default user