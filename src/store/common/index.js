
import {
    A_ADD
} from '../action-types';

import {
    M_ADD
} from '../mutation-types';

const state = {
    commonCount : 0
};

const actions = {
    [A_ADD]: ({commit, state}, params) => {
        commit(M_ADD, 1);
    }
};

const mutations = {
    [M_ADD](state, num){
        state.commonCount += num;
    }
};

const getters = {
    getCommonCount(state, getters){
        return state.commonCount
    }
};

export default {
    state,
    actions,
    mutations,
    getters
}

