import { stringify } from 'querystring';
import { router } from 'umi';
import { fakeAccountLogin } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import {message} from "antd";
import storage from "@/utils/storage";

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const { code, msg, data } = yield call(fakeAccountLogin, payload);

      if ( !code || code !== 200) {
        message.error(msg);
        return false
      }
      storage.set('gd-user',{...data, loginTime: new Date() })

      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: "ok",
          currentAuthority: 'admin',
        },
      }); // login successfully

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          window.location.href = '/';
          return true;
        }
      }
      router.replace(redirect || '/');

      return true
    },

    *logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      storage.remove('gd-user');
      storage.remove('antd-pro-authority');
      if (window.location.pathname !== '/user/login' && !redirect) {
        router.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status, type: payload.type };
    },
  },
};
export default Model;
