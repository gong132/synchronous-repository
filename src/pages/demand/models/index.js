import {
  addDemand,
  // updateDemand,
  queryDemand,
  // queryDemandDetail,
  queryDemandProject,
  queryDemandBoard,
  // queryProjectDemandBoard,
} from '@/services/demand/demand';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Demand = {
  namespace: 'demand',
  state: {
    formType: 'list',
    demandList: PagerHelper.genListState(),
    demandBoard: [],
  },
  effects: {
    *addDemand({ payload }, { call }) {
      const { code, msg } = yield call(addDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    *queryDemand({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryDemand, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      const { records, ...others } = data;
      yield put({
        type: 'setDemandData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
    },
    *queryDemandProject({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryDemandProject, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      const { records, ...others } = data;
      yield put({
        type: 'setDemandData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
    },

    *queryDemandBoard({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryDemandBoard, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      console.log(data);
      yield put({
        type: 'setData',
        // payload: {
        //   filter: payload,
        //   data: records,
        //   ...others
        // },
      });
    },
  },
  reducers: {
    setData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    setDemandData(state, action) {
      return {
        ...state,
        contractList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};

export default Demand;
