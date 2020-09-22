import {
  fetchData,
  createData,
  updateData,
  queryDept,
  querySectorInfo,
  queryDeptAll,
} from '@/services/systemManage/sectorManage';
import { queryLogList } from '@/services/global';
import { PagerHelper } from '@/utils/helper';
import { message } from 'antd';

const Sector = {
  namespace: 'sector',
  state: {
    sectorList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    deptList: [],
    deptListMap: {},
    deptListAll: [],
    deptListMapAll: {},
    sectorInfo: {},
    allDept: [],
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
    *queryData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchData, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      const { records, ...others } = data;
      yield put({
        type: 'setSectorData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
    },
    *addData({ payload }, { call }) {
      const { code, msg } = yield call(createData, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    *updateData({ payload }, { call }) {
      const { code, msg } = yield call(updateData, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },

    // 查询未被集群绑定部门
    *fetchNotBindDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDept, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {};
      data.map(v => {
        obj[v.deptId] = v.deptName;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          deptList: data,
          deptListMap: obj,
        },
      });
      return true;
    },

    // 查询所有部门接口
    *fetchAllDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDeptAll, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        v.id = String(v.id)
        obj[v.id] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          deptListAll: data,
          deptListMapAll: obj
        }
      })
      return true
    },

    // 查看集群详情
    *fetchSectorInfo({ payload }, { call, put }) {
      const { code, msg, data } = yield call(querySectorInfo, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          sectorInfo: data,
        },
      });
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
  },
};

export default Sector;
