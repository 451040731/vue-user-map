const state = {
    isGlobalSpin: false,
    uid: '',
    token: localStorage.getItem('token') || '',
}

const type = {
	gettUidAsync: 'gettUidAsync'
}

const mutations = {
    changeGlobalSpin (state, show) {
        state.isGlobalSpin = show;
    },
    gettUidAsync (state, id) {
        state.uid = id;
        localStorage.setItem('uid', id);
    },
    getToken(state, token){
        //更改token的值
        state.token = token;
        localStorage.setItem('token', token);
    },
}

export default {
    state,
    type,
    mutations
}