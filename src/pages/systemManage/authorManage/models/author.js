import {
  fetchAllRolesList,
  queryMenuList,
  fetchAuthorByRoleId,
  updateRoleAuthor,
  deleteRoleAuthor,
  addRoleAuthor,
} from '@/services/systemManage/authorManage'
import { PagerHelper } from "@/utils/helper";
import { message } from "antd";

const Author = {
  namespace: 'authorManage',
  state: {
    roleList: PagerHelper.genListState(),
    allMenuList: [],
    menuList: [],
  },
  effects: {
    *queryAllRolesList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchAllRolesList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      yield put({
        type: 'saveData',
        payload: { roleList: PagerHelper.resolveListState({
            filter: payload,
            ...data,
          })}
      })
      return data.data
    },
    *queryMenuList({ payload }, { call, put }) {
      const { code, msg, data } = yield call(queryMenuList, payload)
      if (!code || code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: { allMenuList: data}
      })
    },
    *queryAuthorByRoleId({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fetchAuthorByRoleId, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      yield put({
        type: 'saveData',
        payload: { menuList: data }
      })
      return data
    },
    *updateRoleAuthor({ payload }, { call }) {
      const { code, msg } = yield call(updateRoleAuthor, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      return true
    },
    *addRoleAuthor({ payload }, { call }) {
      console.log(payload, "payload")
      const res = yield call(addRoleAuthor, payload);
      if ( res?.code !== 200) {
        message.error(res?.msg);
        return false
      }
      return true
    },
    *deleteRoleAuthor({ payload }, { call }) {
      const { code, msg } = yield call(deleteRoleAuthor, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      return true
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
  }
}

export default Author
