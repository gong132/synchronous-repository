import { queryBudgetList, addBudget, updateBudget, fetchClusterList,
  fetchDeptListByCluster, fetchGroupList, fetchBudgetDetails, fetchLogList } from '@/services/contractBudget/budget';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const budgetManage = {
  namespace: 'budgetManage',
  state: {
    budgetList: PagerHelper.genListState(),
    clusterList: [],
    deptList: [],
    groupList: [],
    budgetDetails: {},
    budgetLogList: PagerHelper.genListState(),
  },
  effects: {
    *fetchBudgetData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryBudgetList, payload);
      if (code !== 200) {
        message.error(msg);
        return
      }
      data.currentPage = data.current;
      data.pageSize = data.size;
      const { records, ...others } = data;
      yield put({
        type: 'setBudgetData',
        payload: {
          filter: payload,
          data: records,
          ...others
        },
      })
    },
    *queryLogList({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchLogList, payload);
      if (code !== 200) {
        message.error(msg);
        return
      }
      const { records, ...others } = data;
      yield put({
        type: 'setLogData',
        payload: {
          filter: payload,
          data: records,
          ...others
        },
      })
    },
    *addBudget({ payload }, { call, put }) {
      const { code, msg, data } = yield call(addBudget, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },
    *updateBudget({ payload }, { call, put }) {
      const { code, msg, data } = yield call(updateBudget, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
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
      })
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
      })
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
      })
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
      })
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
