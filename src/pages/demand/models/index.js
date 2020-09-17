import {
  addDemand, fetchSystemList, fetchUserList, addStory,
  updateStory,
  // updateDemand,
  queryDemand,
  queryGroup,
  // queryDemandDetail,
  queryDemandProject,
  queryDemandBoard,
  // queryProjectDemandBoard,
  queryBudgetNumber,
} from '@/services/demand/demand';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Demand = {
  namespace: 'demand',
  state: {
    formType: 'list',
    demandList: PagerHelper.genListState(),
    demandBoard: [],
    demandInfo: {},
    groupList: [],
    groupMap: {},
    budgetList: [],
    budgetMap: {},
    systemList: [],
    userList: [],
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

    // 查询负责人和团队
    *fetchHeaderGroup({ payload }, { call, put }) {
      const { code, msg, data: { data } } = yield call(queryGroup, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const gObj = {}
      if (data && data.length < 1) return ''
      data.map(v => {
        gObj[v.id] = v.name
        return true
      })
      yield put({
        type: 'setData',
        payload: {
          groupList: data,
          groupMap: gObj
        }
      })
      return true
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
        payload: {
          demandBoard: data
        },
      });
    },

    // 查询预算编号
    *fetchBudgetNumber({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryBudgetNumber, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.number] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          budgetList: data,
          budgetMap: obj
        }
      })
      return true
    },
    // 查询系统列表
    *querySystemList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchSystemList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          systemList: data,
        }
      })
    },
    // 查询人员列表
    *queryUserList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchUserList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          userList: data.data,
        }
      })
    },
    // 新增story
    *addStory({ payload }, { call }) {
      const { code, msg } = yield call(addStory, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    // 编辑story
    *updateStory({ payload }, { call }) {
      const { code, msg } = yield call(updateStory, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
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
