import { fetchAllMenuList, deleteMenu } from '@/services/menuConfig/menuConfig';
import {message} from "antd";


const menuConfig = {
  namespace: 'menuConfig',
  state: {
    allMenuList: [],
  },
  effects: {
    *queryAllMenuData({payload}, { call, put }) {
      const { code, data, msg } = yield call(fetchAllMenuList, payload);

      if (code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'saveData',
        payload: { allMenuList: data },
      })
    },
    *deleteMenu({payload}, { call }) {
      const { code, msg } = yield call(deleteMenu, payload);

      if (code !== 200) {
        message.error(msg);
        return false
      }
      return true
    },
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
    },
  },
};
export default menuConfig;
