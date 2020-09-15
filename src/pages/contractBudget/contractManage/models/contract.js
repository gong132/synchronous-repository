import {
  queryContractList,
  queryContractInfo,
  createContract,
  editContract,
  queryDept,
  queryProject,
  querySystem,
  querySupplier,
  queryHeaderGroup,
  queryBudgetNumber,
  checkProject
} from '@/services/contractBudget/contract'
import { addMenuList, queryLogList } from '@/services/global'
import { PagerHelper } from "@/utils/helper";
import { message } from "antd";

const Contract = {
  namespace: 'contract',
  state: {
    contractList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    contractInfo: {},
    deptList: [],
    deptListMap: {},
    projectList: [],
    projectMap: {},
    systemList: [],
    systemMap: {},
    supplierList: [],
    supplierMap: {},
    headerList: [],
    headerMap: {},
    groupMap: {},
    budgetList: [],
    budgetMap: {},
  },
  effects: {
    *addMenu({ payload }, { call }) {
      const { code, msg } = yield call(addMenuList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },
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

    // 合同确认
    *checkProject({ payload }, { call }) {
      const { code, msg } = yield call(checkProject, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },

    // 查询部门
    *fetchNotBindDept({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryDept, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.deptId] = v.deptName
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          deptList: data,
          deptListMap: obj
        }
      })
      return true
    },

    // 查询项目
    *fetchProject({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryProject, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.number] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          projectList: data,
          projectMap: obj
        }
      })
      return true
    },

    // 查询预算编号
    *fetchBudgetNumber({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryBudgetNumber, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.number] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          budgetList: data,
          budgetMap: obj
        }
      })
      return true
    },

    // 查询系统
    *fetchSystem({ payload }, { call, put }) {
      const { code, msg, data } = yield call(querySystem, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.systemId] = v.systemName
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          systemList: data,
          systemMap: obj
        }
      })
      return true
    },

    // 查询供应商
    *fetchSupplier({ payload }, { call, put }) {
      const { code, msg, data } = yield call(querySupplier, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.supplierId] = v.supplierName
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          supplierList: data,
          supplierMap: obj
        }
      })
      return true
    },

    // 查询负责人和团队
    *fetchHeaderGroup({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryHeaderGroup, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      const gObj = {}
      data.map(v => {
        obj[v.leaderId] = v.leaderName
        return true
      })
      data.map(v => {
        gObj[v.number] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          headerList: data,
          headerMap: obj,
          groupMap: gObj
        }
      })
      return true
    },

    // 查看合同详情
    *fetchContractInfo({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryContractInfo, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          contractInfo: data,
        }
      })
      return true
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
        contractList: PagerHelper.resolveListState(action.payload),
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

export default Contract