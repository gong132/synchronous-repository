import {
  queryContractList,
  queryContractInfo,
  createContract,
  editContract,
} from '@/services/contractBudget/contract'
import { PagerHelper } from "@/utils/helper";
import { queryLogList } from '@/services/global'
import { message } from "antd";

const Constract = {
  namespace: 'constract',
  state: {
    constractList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    constractInfo: {},
    deptList: [],
    deptListMap: {},
  },
  effects: {
    *fetchLogList({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryLogList, payload);
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
    *queryData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryContractList, payload)
      if (code !== 200) {
        message.error(msg);
        return
      }
      const { records, ...others } = data;
      yield put({
        type: 'setSectorData',
        payload: {
          filter: payload,
          data: records,
          ...others
        },
      })
    },
    *addData({ payload }, { call }) {
      const { code, msg } = yield call(createContract, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },
    *updateData({ payload }, { call }) {
      const { code, msg } = yield call(editContract, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },

    //查看合同详情
    *fetchContractInfo({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryContractInfo, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          constractInfo: data,
        }
      })
    }
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    setSectorData(state, action) {
      return {
        ...state,
        sectorList: PagerHelper.resolveListState(action.payload),
      };
    },
    setLogData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
      };
    },
  }
}

export default Constract