import {
  queryUserList,
  updateUser,
  fetchAllRolesList,
  queryHeaderGroup,
  queryRoleById
} from '@/services/systemManage/userManage';
import _ from 'lodash'
import { PagerHelper } from "@/utils/helper";
import { message } from "antd";


const UserModel = {
  namespace: 'userManage',
  state: {
    userList: PagerHelper.genListState(),
    roleData: [],
    roleDataMap: {},
    groupList: [],
    headerList: [],
    headerMap: {},
    groupMap: {},
    checkRole: []
  },
  effects: {
    *fetchUserData({ payload }, { call, put }) {
      const { code, data, msg } = yield call(queryUserList, payload);
      if (code !== 200) {
        message.error(msg);
        return
      }
      const { records, ...others } = data;
      yield put({
        type: 'setUserData',
        payload: {
          filter: payload,
          data: records,
          ...others
        },
      })
    },

    *updateUser({ payload }, { call }) {
      const { code, msg } = yield call(updateUser, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },

    *queryAllRoles({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchAllRolesList, payload)
      if (code !== 200) {
        message.error(msg);
        return
      }
      let obj = {}
      data.data.map(v => {
        obj[v.id] = v.roleName
      })
      yield put({
        type: 'saveData',
        payload: {
          roleData: data.data,
          roleDataMap: obj
        },
      })
    },

    // 查询负责人和团队
    *fetchHeaderGroup({ payload }, { call, put }) {
      const { code, msg, data: { data } } = yield call(queryHeaderGroup, payload)
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

    // 根据用户id查询绑定的角色
    *queryRoleById({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryRoleById, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      const arr = []
      if (_.isEmpty(data)) {
        return false
      }
      data.map(v => {
        arr.push(v.id)
        return true
      })
      yield put({
        type: 'saveData',
        payload: {
          checkRole: arr
        }
      })
    }
  },
  reducers: {
    saveData(state, { payload }) {
      return { ...state, ...payload };
    },
    setUserData(state, action) {
      return {
        ...state,
        userList: PagerHelper.resolveListState(action.payload),
      };
    },
  },
};
export default UserModel;
