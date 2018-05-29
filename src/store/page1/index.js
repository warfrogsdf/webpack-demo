import Axios from 'axios';
import {
    A_INCREASE1,
    A_DECREASE1,
    A_PREFETCH
} from '../action-types';

import {
    M_INCREASE1,
    M_DECREASE1,
    M_PREFETCH
} from '../mutation-types';

const state = {
    page1Count: 0,
    data: []
};

const actions = {
    [A_PREFETCH]: ({commit, state}) => {
        //console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
        return Axios.get('https://www.aihuishou.com/util/GetSearchHot?pageSize=2').then((res)=>{
            //console.log(1111)
            //console.log(res.data.data);
            commit(M_PREFETCH, res.data.data)
        })
    },
    [A_INCREASE1]: ({commit, state}, params) => {
        commit(M_INCREASE1, 1);
    },
    [A_DECREASE1]: ({commit, state}, params) => {
        commit(M_DECREASE1, 1);
    }
};

const mutations = {
    [M_PREFETCH](state, data){
        state.data = data;
    },
    [M_INCREASE1](state, num){
        state.page1Count += num;
    },
    [M_DECREASE1](state, num){
        state.page1Count -= num;
    }
};

const getters = {
    getPage1Count(state){
        return state.page1Count
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}
