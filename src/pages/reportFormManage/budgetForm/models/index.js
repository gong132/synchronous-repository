import { fetchBudgetChartsData, fetchBudgetinfo, fetchBudgetListData, fetchBudgetTreeData } from '@/services/reportForm/budgetCharts';
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'budgetChart',
  state: {
    budgetList: PagerHelper.genListState(),
    budgetDetails: PagerHelper.genListState(),
    budgetDetailInfo: {},
    budgetChartList: {
      approvalProject: [],
      contractData: []
    },
    budgetTreeList: {},
  },
  effects: {
    *queryBudgetListData({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchBudgetListData, payload);

      if (code !== 200) {
        message.error(msg)
        return
      }
      const { datas, ...others } = data;
      yield put({
        type: 'setBudgetListData',
        payload: {
          filter: payload,
          data: datas,
          ...others
        },
      })
    },
    *queryBudgetChartsData({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchBudgetChartsData, payload);
      if (code !== 200) {
        message.error(msg)
        return
      }
      const newObj = {
        ...data,
        approvalProject:[
          { name: "已执行", value: data?.projectEstAmount || 0},
          { name: "未执行", value: data?.budgetTotalAmount - data?.projectEstAmount},
        ],
        contractData:[
          { name: "已执行", value: data?.transactionAmount || 0},
          { name: "未执行", value: data?.budgetTotalAmount - data?.transactionAmount},
        ],
      }
      yield put({
        type: 'saveData',
        payload: {
          budgetChartList: newObj
        },
      })
    },
    *queryBudgetTreeData({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchBudgetTreeData, payload);
      if (code !== 200) {
        message.error(msg)
        return
      }
      yield put({
        type: 'saveData',
        payload: {
          budgetTreeList: data
        },
      })
    },
    *queryBudgetDetails({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchBudgetinfo, payload);
      if (code !== 200) {
        message.error(msg)
        return
      }
      const { datas, ...others } = data;
      yield put({
        type: 'saveData',
        payload: { budgetDetailInfo: others },
      })
      yield put({
        type: 'setBudgetDetailData',
        payload: {
          filter: payload,
          data: datas,
          ...others
        },
      })
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, ...payload };
    },
    setBudgetListData(state, action) {
      return {
        ...state,
        budgetList: PagerHelper.resolveListState(action.payload),
      };
    },
    setBudgetDetailData(state, action) {
      return {
        ...state,
        budgetDetails: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default UserModel;
