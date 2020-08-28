import { queryBudgetList, addBudget, updateBudget, fetchClusterList,
  fetchDeptListByCluster, fetchGroupList } from '@/services/contractBudget/budget';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'budgetManage',
  state: {
    budgetList: PagerHelper.genListState(),
    clusterList: [],
    deptList: [],
    groupList: [],
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
        type: 'setClusterData',
        payload: data,
      })
    },
    *queryDeptList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchDeptListByCluster, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'setDeptData',
        payload: data,
      })
    },
    *queryGroupList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchGroupList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'setGroupData',
        payload: data,
      })
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
    },
    setBudgetData(state, action) {
      return {
        ...state,
        budgetList: PagerHelper.resolveListState(action.payload),
      };
    },
    setClusterData(state, action) {
      return {
        ...state,
        clusterList: action.payload,
      };
    },
    setDeptData(state, action) {
      return {
        ...state,
        deptList: action.payload,
      };
    },
    setGroupData(state, action) {
      return {
        ...state,
        groupList: action.payload,
      };
    },
  },
};
export default UserModel;
