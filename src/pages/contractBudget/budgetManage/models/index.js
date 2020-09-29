import {
  queryBudgetList,
  addBudget,
  updateBudget,
  fetchClusterList,
  fetchDeptListByCluster,
  fetchGroupList,
  fetchBudgetDetails,
  fetchLogList,
  fetchDeptList,
  fetchGroupByDept,
  fetchAllTeam,
} from '@/services/contractBudget/budget';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const budgetManage = {
  namespace: 'budgetManage',
  state: {
    budgetList: PagerHelper.genListState(),
    clusterList: [],
    deptList: [],
    allDeptList: [],
    groupList: [],
    groupByDept: {},
    teamList: [],
    budgetDetails: {},
    budgetLogList: PagerHelper.genListState(),
  },
  effects: {
    *fetchBudgetData({ payload }, { call, put }) {
      console.log(payload,"payload")
      const res = yield call(queryBudgetList, payload);
      console.log(res,"热")
      if (!res?.code || res?.code !== 200) {
        message.error(res?.msg);
        return;
      }
      res.data.currentPage = res.data.current;
      res.data.pageSize = res.data.size;
      const { records, ...others } = res.data;
      yield put({
        type: 'setBudgetData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
    },
    *queryLogList({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchLogList, payload);
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
    *addBudget({ payload }, { call }) {
      const { code, msg } = yield call(addBudget, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    *updateBudget({ payload }, { call }) {
      const { code, msg } = yield call(updateBudget, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    *queryClusterList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchClusterList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: { clusterList: data },
      });
    },
    *queryDeptList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchDeptListByCluster, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: { deptList: data },
      });
    },
    *queryGroupByDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchGroupByDept, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: { groupByDept: data },
      });
      return data;
    },
    *queryGroupList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchGroupList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: { groupList: data },
      });
    },
    *queryAllDeptList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchDeptList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: { allDeptList: data },
      });
      return data;
    },
    *queryBudgetDetails({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchBudgetDetails, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: { budgetDetails: data },
      });
    },
    *queryAllTeam({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchAllTeam, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: { teamList: data },
      });
      return data;
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, ...payload };
    },
    setBudgetData(state, action) {
      return {
        ...state,
        budgetList: PagerHelper.resolveListState(action.payload),
      };
    },
    setLogData(state, action) {
      return {
        ...state,
        budgetLogList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default budgetManage;
