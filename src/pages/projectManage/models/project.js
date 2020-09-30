
import { PagerHelper } from '@/utils/helper';
import {
  queryAllCluster,
  queryBudgetNumber,
  queryAllStageStatus,
  queryProjectInfo,
  queryProjectList,
  updateProject,
  querySupplier,
} from '@/services/project/project'
import { queryLogList, queryUserList, queryGroup } from '@/services/global';
import { message } from 'antd'

const Project = {
  namespace: 'project',
  state: {
    projectList: PagerHelper.genListState(),
    logList: PagerHelper.genListState(),
    clusterList: [],
    budgetList: [],
    budgetMap: {},
    stageStatus: [],
    stageStatusMap: {},
    projectInfo: {},
    supplierList: [],
    supplierMap: {},
    userList: [],
    groupList: [],
    groupMap: {},
  },
  effects: {
    // 查询所有集群板块
    *queryAllCluster({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryAllCluster, payload)
      if (code !== 200) {
        message.error(msg);
        return false
      }
      yield put({
        type: 'saveData',
        payload: {
          clusterList: data
        },
      })
      return true
    },

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
      return true
    },

    // 查列表
    *queryProjectList({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryProjectList, payload);
      if (code !== 200) {
        message.error(msg);
        return;
      }
      const { records, ...others } = data;
      yield put({
        type: 'setProjectData',
        payload: {
          filter: payload,
          data: records,
          ...others,
        },
      });
      return true
    },

    // 查询预算编号
    *fetchBudgetNumber({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryBudgetNumber, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {};
      data.map(v => {
        obj[v.number] = v.name;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          budgetList: data,
          budgetMap: obj,
        },
      });
      return true;
    },

    // 获取项目所有阶段状态
    *queryAllStageStatus({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryAllStageStatus, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const obj = {};
      data.map(v => {
        obj[v.id] = v.pjStageName;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          stageStatus: data,
          stageStatusMap: obj,
        },
      });
      return true;
    },

    // 查详情
    *queryProjectInfo({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryProjectInfo, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      yield put({
        type: 'saveData',
        payload: {
          projectInfo: data,
        },
      });
      return data;
    },

    // 编辑项目
    *updateProject({ payload }, { call }) {
      const { code, msg } = yield call(updateProject, payload)
      if (code !== 200) {
        message.error(msg);
        return false
      }
      return true
    },

    // 查供应商
    *querySupplier({ payload }, { call, put }) {
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

    // 查人员
    *queryUser({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryUserList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return;
      }
      yield put({
        type: 'saveData',
        payload: {
          userList: data,
        },
      });
    },

    // 查团队
    *queryTeam({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryGroup, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const gObj = {};
      if (data && data.length < 1) return '';
      data.map(v => {
        v.id = String(v.id);
        gObj[v.id] = v.name;
        return true;
      });
      yield put({
        type: 'saveData',
        payload: {
          groupList: data,
          groupMap: gObj,
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
    setProjectData(state, action) {
      return {
        ...state,
        projectList: PagerHelper.resolveListState(action.payload),
      };
    },
    setLogData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
}
export default Project