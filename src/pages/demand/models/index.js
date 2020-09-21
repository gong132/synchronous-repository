import {
  updateDemand,
  addDemand,
  fetchSystemList,
  fetchUserList,
  addStory,
  updateStory,
  fetchStoryList,
  tempAddDemand,
  copyStory,
  searchStory,
  batchAssessStory,
  // updateDemand,
  queryDemand,
  queryGroup,
  queryDemandInfo,
  // queryDemandProject,
  queryDemandBoard,
  // queryProjectDemandBoard,
  queryBudgetNumber,
  queryFlow,
} from '@/services/demand/demand';
import { queryLogList } from '@/services/global';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Demand = {
  namespace: 'demand',
  state: {
    formType: 'list',
    demandList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    storyList: PagerHelper.genListState(),
    assessStoryList: PagerHelper.genListState(),
    demandBoard: [],
    demandInfo: {},
    groupList: [],
    groupMap: {},
    budgetList: [],
    budgetMap: {},
    systemList: [],
    userList: [],
    tempDemandId: '',
    flowList: []
  },
  effects: {
    *fetchLogList({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryLogList, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      const { records, ...others } = data;
      yield put({
        type: 'setLogData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
    },

    *queryStoryList({ payload }, { call, put }) {
      const res = yield call(fetchStoryList, payload);
      if (!res || res.code !== 200) {
        message.error(res.msg);
        return;
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'setStoryData',
        payload: {
          filter: payload,
          data,
          ...others,
        },
      });
    },

    *addDemand({ payload }, { call }) {
      const { code, msg } = yield call(addDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 暂存需求
    *tempAddDemand({ payload }, { call, put }) {
      const { code, msg, data } = yield call(tempAddDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      console.log(payload, 'payload');
      if (payload.autoSave) {
        yield put({
          type: 'saveData',
          payload: {
            tempDemandId: data,
          },
        });
      }
      return true;
    },

    *updateDemand({ payload }, { call }) {
      const { code, msg } = yield call(updateDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 查询负责人和团队
    *fetchHeaderGroup({ payload }, { call, put }) {
      const {
        code,
        msg,
        data: { data },
      } = yield call(queryGroup, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const gObj = {};
      if (data && data.length < 1) return '';
      data.map(v => {
        v.id = String(v.id);
        gObj[v.id] = v.name;
        return true;
      });
      yield put({
        type: 'setData',
        payload: {
          groupList: data,
          groupMap: gObj,
        },
      });
      return true;
    },

    *queryDemand({ payload }, { call, put }) {
      const res = yield call(queryDemand, payload);
      if (!res || res.code !== 200) {
        message.error(res.msg);
        return;
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'setDemandData',
        payload: {
          filter: payload,
          data,
          ...others,
        },
      });
    },

    // 查询需求详情
    *queryDemandInfo({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryDemandInfo, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'setData',
        payload: {
          demandInfo: data,
        },
      });
      return data;
    },

    // 查询流程进度
    *queryFlow({payload}, { call, put }) {
      const { code, data, msg } = yield call(queryFlow, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'setData',
        payload: {
          flowList: data,
        },
      });
      return data
    },  

    *queryDemandProject({ payload }, { call, put }) {
      const res = yield call(queryDemand, payload);
      if (!res || res.code !== 200) {
        message.error(res.msg);
        return;
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'setDemandData',
        payload: {
          filter: payload,
          data,
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
          demandBoard: data,
        },
      });
    },

    // 查询预算编号
    *fetchBudgetNumber({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryBudgetNumber, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {};
      data.map(v => {
        obj[v.number] = v.name;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          budgetList: data,
          budgetMap: obj,
        },
      });
      return true;
    },
    // 查询系统列表
    *querySystemList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchSystemList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          systemList: data,
        },
      });
    },
    // 查询人员列表
    *queryUserList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchUserList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          userList: data.data,
        },
      });
    },
    // 新增story
    *addStory({ payload }, { call }) {
      const { code, msg } = yield call(addStory, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    // 编辑story
    *updateStory({ payload }, { call }) {
      const { code, msg } = yield call(updateStory, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    // 复制story
    *copyStory({ payload }, { call }) {
      const { code, msg } = yield call(copyStory, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    // 查询story
    *searchStory({ payload }, { call, put }) {
      const res = yield call(searchStory, payload);
      if (!res.code || res.code !== 200) {
        message.error(res.msg);
        return;
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'saveData',
        payload: {
          assessStoryList: PagerHelper.resolveListState({
            filter: payload,
            data,
            ...others,
          })
        },
      });
    },

    // 批量评估、转评估story
    *batchAssessStory({ payload }, { call }) {
      const { code, msg } = yield call(batchAssessStory, payload);
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
        demandList: PagerHelper.resolveListState(action.payload),
      };
    },
    setLogData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
      };
    },
    setStoryData(state, action) {
      return {
        ...state,
        storyList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};

export default Demand;
