import {
  fetchData,
  createData,
  updateData,
  queryDept,
  querySectorInfo,
} from '@/services/systemManage/sectorManage'
import { PagerHelper } from "@/utils/helper";
import {message} from "antd";

const Sector = {
  namespace: 'sector',
  state: {
    sectorList: PagerHelper.genListState(),
    deptList: [],
    deptListMap: {},
    sectorInfo: {}
  },
  effects: {
    *queryData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchData, payload)
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
      const { code, msg } = yield call(createData, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },
    *updateData({ payload }, { call }) {
      const { code, msg } = yield call(updateData, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },

    // 查询未被集群绑定部门
    *fetchNotBindDept({payload}, {call, put}) {
      const { code, msg, data } = yield call(queryDept, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      let obj = {}
      data.map(v => {
        obj[v.number] = v.name
      })
      yield put({
        type: 'saveData',
        payload: {
          deptList: data,
          deptListMap: obj
        }
      })
    },

    //查看集群详情
    *fetchSectorInfo({payload}, {call, put}) {
      const {code, msg, data} = yield call(querySectorInfo, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          sectorInfo: data,
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
  }
}

export default Sector