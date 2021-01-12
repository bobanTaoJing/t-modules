import * as types from '../mutaion-types'

const user = {
    state: {
        title: ''
    },
    mutations: {
        setTitle: (state, token) => {
            state.token = token
        },
    },
    actions: {}
}

export default user