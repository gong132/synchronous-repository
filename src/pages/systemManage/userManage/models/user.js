import { queryUserList, updateUser, addUser } from '@/services/systemManage/userManage';
import { fetchAllRoles } from '@/services/systemManage/authorManage'
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";


const UserModel = {
  namespace: 'userManage',
  state: {
    userList: PagerHelper.genListState(),
    roleData: [],
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

    *addUser({ payload }, { call }) {
      const { code, msg } = yield call(addUser, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true
    },

    *queryAllRoles({ payload }, { call, put }) {
      const { code, data, msg } = yield call(fetchAllRoles, payload)
      if (code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: {
          roleData: data
        },
      })
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
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
