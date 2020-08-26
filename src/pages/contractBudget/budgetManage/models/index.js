import { queryBudgetList } from '@/services/contractBudget/budget';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'budgetManage',
  state: {
    budgetList: PagerHelper.genListState()
  },
  effects: {
    *fetchBudgetData({payload}, { call, put }) {
      const { code, data, msg } = yield call(queryBudgetList, payload);

      if (code !== 200) {
        message.error(msg)
        return
      }
      const { datas, ...others } = data;
      yield put({
        type: 'setBudgetData',
        payload: {
          filter: payload,
          data: datas,
          ...others
        },
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
  },
};
export default UserModel;
