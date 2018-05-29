//import Axios from 'axios';
//import {req} from '../../utils/index'

import {
  A_INCREASE2,
  A_DECREASE2,
  A_PREFETCH
} from '../action-types';

import {
  M_INCREASE2,
  M_DECREASE2
} from '../mutation-types';

const state = {
  page2Count: 0
};

const actions = {
  [A_PREFETCH]: ({commit, state}, params) => {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    commit(M_INCREASE2, 1);
  },
  [A_INCREASE2]: ({commit, state}, params) => {
    commit(M_INCREASE2, 1);
  },
  [A_DECREASE2]: ({commit, state}, params) => {
    commit(M_DECREASE2, 1);
  }
};

const mutations = {
  [M_INCREASE2](state, num) {
    state.page2Count += num;
  },
  [M_DECREASE2](state, num) {
    state.page2Count -= num;
  }
};

const getters = {
  getPage2Count(state) {
    return state.page2Count
  }
};

export default {
  state,
  actions,
  mutations,
  getters
}
