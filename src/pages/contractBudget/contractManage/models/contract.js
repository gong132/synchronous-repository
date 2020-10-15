import {
  queryContractList,
  queryContractInfo,
  createContract,
  editContract,
  queryProject,
  querySystem,
  querySupplier,
  queryHeaderGroup,
  queryBudgetNumber,
  checkProject,
  queryAllCluster,
} from '@/services/contractBudget/contract'
import {
  queryLogList,
  queryDept,
  queryComp,
  queryUserList,
  queryGroup,
  fetchAllProject
} from '@/services/global'
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
    companyList: [],
    companyMap: {},
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
    clusterList: [],
    userData: [],
    userDataMap: {},
    userDataMapId: {},
    userLoginIdMap: {},
    groupList: [],
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

    // 查询所有集群板块
    *queryAllCluster({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryAllCluster, payload)
      if (code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: {
          clusterList: data
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
        v.id = String(v.id)
        obj[v.id] = v.name
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

    // 查询公司
    *queryComp({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryComp, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      data.map(v => {
        obj[v.id] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          companyList: data,
          companyMap: obj
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
        v.id = String(v.id)
        obj[v.id] = v.name
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
        v.id = String(v.id)
        obj[v.id] = v.name
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

    // 查询团队
    *fetchHeaderGroup({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryGroup, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {}
      const gObj = {}
      if (data && data.length < 1) return ''
      data.map(v => {
        v.id = String(v.id)
        obj[String(v.id)] = v.name
        return true
      })
      data.map(v => {
        gObj[String(v.id)] = v.name
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          groupList: data,
          headerList: data,
          headerMap: obj,
          groupMap: gObj
        }
      })
      return true
    },

    // 查项目 fetchAllProject
    *fetchAllProject({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchAllProject, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          projectList:data
        }
      })
      return true
    },

    // 查询人员
    *fetchUserData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryUserList, payload);
      if (code !== 200) {
        message.error(msg);
        return
      }
      const obj = {}
      data.map(v => {
        obj[v.userId] = v.userName
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          userData: data,
          userDataMap: obj,
        },
      })
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