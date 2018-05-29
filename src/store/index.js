import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import common from './common/index';
import page1 from './page1/index';
import page2 from './page2/index';

const createStore = (Vue) => {
    Vue.use(Vuex);
    let opts = {
        modules: {
            // common
            common,
            // page1
            page1,
            // page2
            page2
        },
        strict: true
    };

    if (process.env.NODE_ENV === 'development') {
        opts['plugins'] = [createLogger()];
    }

  return new Vuex.Store(opts);
};

export default createStore(Vue);
