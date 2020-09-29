import { PagerHelper } from "@/utils/helper";
import { message } from "antd";
import { fetchDemandInfo, fetchDemandList } from "@/services/demandManage";


const UserModel = {
  namespace: 'demandManage',
  state: {
    demandTableList: PagerHelper.genListState(),
    demandManageList: PagerHelper.genListState(),
    demandDeptInfo: [],
    demandTeamList: [],
    demandStatusList: [],
    demandSystemList: [],
    pendingCount: 0,
    othersData: {},
  },
  effects: {
    *queryDemandInfo({payload}, { call, put }) {
      const res = yield call(fetchDemandInfo, payload);

      if (!res || res.code !== 200) {
        message.error(res.msg)
        return
      }
      const { demandDetailCountVOS, deptDemandVOS, teamDemandVOS,
        notAcceptDemandCount, statusDemandVOS, systemDemandVOS, ...others } = res?.data || {};

      yield put({
        type: 'saveData',
        payload: {
          demandDeptInfo: deptDemandVOS,
          demandTeamList: teamDemandVOS,
          demandStatusList: statusDemandVOS,
          demandSystemList: systemDemandVOS,
          pendingCount:notAcceptDemandCount,
          othersData: {
            ...others
          },
        },
      })

      const { data, ...other } = demandDetailCountVOS || {};

      yield put({
        type: 'setDemandTableData',
        payload: {
          filter: payload,
          data,
          ...other
        },
      })
    },
    *queryDemandList({payload}, { call, put }) {
      const res = yield call(fetchDemandList, payload);

      if (!res || res.code !== 200) {
        message.error(res.msg)
        return
      }

      const { data, ...other } = res.data;

      yield put({
        type: 'setDemandManageData',
        payload: {
          filter: payload,
          data,
          ...other
        },
      })
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, ...payload };
    },
    setDemandTableData(state, action) {
      return {
        ...state,
        demandTableList: PagerHelper.resolveListState(action.payload),
      };
    },
    setDemandManageData(state, action) {
      return {
        ...state,
        demandManageList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default UserModel;
