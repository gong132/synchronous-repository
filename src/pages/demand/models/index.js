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
  estimate,
  batchAssessStory,
  fetchStoryDetails,
  syncStory,
  assignUser,
  // updateDemand,
  queryDemand,
  queryGroup,
  queryDemandInfo,
  // queryDemandProject,
  queryDemandBoard,
  // queryProjectDemandBoard,
  queryBudgetNumber,
  queryFlow,
  focusDemand,
} from '@/services/demand/demand';
import {
  addMilePlan,
  updateMilePlan,
  removeMilePlan,
  queryMilePlan,
  queryMilePlanStage,
  // queryMilePlanInfo,
} from '@/services/milestonePlan/mileStonePlan'
import { queryLogList, queryFile } from '@/services/global';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Demand = {
  namespace: 'demand',
  state: {
    formType: 'list',
    demandList: PagerHelper.genListState(),
    milePlanList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    storyList: PagerHelper.genListState(),
    assessStoryList: PagerHelper.genListState(),
    planStageList: [],
    planStageListMap: {},
    demandBoard: [],
    demandInfo: {},
    groupList: [],
    groupMap: {},
    budgetList: [],
    budgetMap: {},
    systemList: [],
    userList: [],
    tempDemandId: '',
    flowList: [],
    storyDetails: {},
    ITAssignVisible: false,
    assignorVisible: false,
  },
  effects: {
    *queryFile({ payload }, { call}) {
      const { code, msg } = yield call(queryFile, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

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

    // 关注需求
    *focusDemand({payload}, {call}) {
      const { code, msg } = yield call(focusDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
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
      const { code, msg, data } = yield call(addDemand, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return data;
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
      return data;
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
    *queryFlow({ payload }, { call, put }) {
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
    // story详情
    *queryStoryDetails({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchStoryDetails, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: "saveData",
        payload: { storyDetails: data }
      })
    },
    // 同步story
    *syncStory({ payload }, { call }) {
      const { code, msg } = yield call(syncStory, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 新增里程碑计划
    *addMilePlan({ payload }, { call }) {
      const { code, msg } = yield call(addMilePlan, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    // 指派关注人
    },
    *assignUser({ payload }, { call }) {
      const { code, msg } = yield call(assignUser, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 编辑里程碑计划
    *updateMilePlan({ payload }, { call }) {
      const { code, msg } = yield call(updateMilePlan, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 删除里程碑计划
    *deleteMilePlan({ payload }, { call }) {
      const { code, msg } = yield call(removeMilePlan, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 查询里程碑计划
    *queryMilePlan({ payload }, { call, put }) {
      const res = yield call(queryMilePlan, payload);
      if (!res.code || res.code !== 200) {
        message.error(res.msg);
        return;
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'setMilePlanData',
        payload: {
          filter: payload,
          data,
          ...others,
        },
      });
    },

    // 获取里程碑所有阶段
    *queryMilePlanStage({payload}, {call, put}) {
      const {data, msg, code} = yield call(queryMilePlanStage, payload)
      if(code !== 200) {
        message.error(msg)
        return false
      }
      const obj = {}
      data.map(v => {
        obj[v.id] = v.stageName
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          planStageList: data,
          planStageListMap: obj
        }
      })
      return true
    },
    // 查询 评估权限
    *ITAssignAuth({payload}, {call, put}) {
      const {data, msg, code} = yield call(estimate, payload)
      if(code !== 200) {
        message.error(msg)
        return false
      }
      yield put({
        type: 'saveData',
        payload: {
          ITAssignVisible: data,
        }
      })
      return data
    },
    // 查询 评估权限
    *assignorAuth({payload}, {call, put}) {
      const {data, msg, code} = yield call(estimate, payload)
      if(code !== 200) {
        message.error(msg)
        return false
      }
      yield put({
        type: 'saveData',
        payload: {
          assignorVisible: data,
        }
      })
      return data
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
    setMilePlanData(state, action) {
      return {
        ...state,
        milePlanList: PagerHelper.resolveListState(action.payload),
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
