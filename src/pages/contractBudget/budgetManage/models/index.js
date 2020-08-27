import { queryBudgetList, addBudget, updateBudget } from '@/services/contractBudget/budget';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'budgetManage',
  state: {
    budgetList: PagerHelper.genListState()
  },
  effects: {
    *fetchBudgetData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryBudgetList, payload);

      if (code !== 200) {
        message.error(msg)
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
    }
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
  },
};
export default UserModel;
