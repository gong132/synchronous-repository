import { fetchAllMenuList } from '@/services/menuConfig/menuConfig';
import {PagerHelper} from "@/utils/helper";
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
  },
  reducers: {
    saveData(state, action) {
      return { ...state, ...action };
    },
  },
};
export default menuConfig;
