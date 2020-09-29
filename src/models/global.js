import {message} from "antd";
import {router} from "umi";
import storage from "@/utils/storage";
import {PagerHelper} from "@/utils/helper";
import {isArray, isEmpty} from "@/utils/lang";
import { queryLogList, fetchUserList, saveFile, fetchSystemList } from '@/services/global'
import { queryNotices, fetchMenuList, fetchCurrentUserInfo, queryCurrentUserMenuList } from '@/services/user';
import {fetchMessageList} from "@/services/message/message";

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    logList: PagerHelper.genListState(),
    userList: PagerHelper.genListState(),
    systemList: PagerHelper.genListState(),
    allMenuList: [],
    currentUserMenuList: [],
    authActions: [],
    currentUser: {},
    messageList: {},
  },
  effects: {
    *queryAllMenuList({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(fetchMenuList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      storage.add('gd-user', { allMenuList: data });
      yield put({
        type: 'saveData',
        payload: { allMenuList: data },
      });

      callback && callback(data);
      return data
    },

    *queryCurrentUserInfo({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(fetchCurrentUserInfo, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      storage.add('gd-user', { userInfo: data });
      yield put({
        type: 'saveData',
        payload: { currentUser: data },
      });

      callback && callback(data);
      return data
    },
    *queryCurrentUserMenuList({ payload, callback }, { call, put }) {
      const { code, data, msg } = yield call(queryCurrentUserMenuList, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false
      }
      const newData = isArray(data) ? data.flat(1).reduce((cur, next, i) =>{
        const findCurIndex = cur.find(v => v?.id === next?.id)
        if (isEmpty(findCurIndex)) cur.push(next)
        return cur
      }, []) : []
      storage.add('gd-user', { currentUserMenuList: newData });
      yield put({
        type: 'saveData',
        payload: { currentUserMenuList: newData },
      });

      yield put({
        type: 'updateAuthData',
        payload: {
          pathname: window.location.pathname,
        },
      });

      callback && callback(newData);
      return newData
    },

    *fetchLogList({payload}, {call, put}) {
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

    *saveFile({payload}, {call}) {
      const { code, msg } = yield call(saveFile, payload);
      if (!code || code !== 200) {
        message.error(msg);
        return false;
      }
      return true;
    },
    *queryUserList({payload}, {call, put}) {
      const res = yield call(fetchUserList, payload);
      if (!res || res.code !== 200) {
        message.error(msg);
        return
      }
      const { data, ...others } = res.data;
      yield put({
        type: 'setUserData',
        payload: {
          filter: payload,
          data,
          ...others
        },
      })
    },
    *querySystemList({payload}, {call, put}) {
      const res = yield call(fetchSystemList, payload);
      if (!res || res.code !== 200) {
        message.error(msg);
        return
      }
      yield put({
        type: 'setSystemData',
        payload: {
          filter: payload,
          data: res.data,
        },
      })
    },
    *queryMessageList({payload}, { call, put }) {
      const res = yield call(fetchMessageList, payload);
      if (!res || res.code !== 200) {
        message.error(res.msg)
        return
      }
      const { data, unReadCount = 0, ...other } = res.data
      yield put({
        type: 'saveData',
        payload: {
          messageList: {
            data,
            ...other,
            unReadCount,
          },
        },
      })
    },
  },
  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    changeLayoutCollapsed(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return { ...state, collapsed: payload };
    },

    saveNotices(state, { payload }) {
      return {
        collapsed: false,
        ...state,
        notices: payload,
      };
    },

    setLogData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
      };
    },

    setUserData(state, action) {
      return {
        ...state,
        userList: PagerHelper.resolveListState(action.payload),
      };
    },
    setSystemData(state, action) {
      return {
        ...state,
        systemList: PagerHelper.resolveListState(action.payload),
      };
    },

    saveClearedNotices(
      state = {
        notices: [],
        collapsed: true,
      },
      { payload },
    ) {
      return {
        collapsed: false,
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },

    updateAuthData(state, action) {
      const { currentUserMenuList } = state;

      // 如果没有菜单列表，则返回空的authActions
      if (isEmpty(currentUserMenuList)) return { ...state, authActions: [] };

      const { pathname } = action.payload;

      const currentMenu = currentUserMenuList.find(menu => menu.url === pathname);

      // 如果没有当前菜单权限，则返回空的authActions
      if (isEmpty(currentMenu)) return { ...state, authActions: [] };

      // menu.type 菜单类型 0 url  1 按钮
      const authActionsList = currentUserMenuList
          .filter(menu => menu.pid === currentMenu.id && menu.type === 2)
          .map(menu => menu.url);

      return {
        ...state,
        // 更新属于当前菜单的authActions
        // 按钮也是路由，按钮路由的parentId为当前页面路由的menuId，按钮路由的url为 add、eidt、delete等
        // eg： {
        //         "menuId": "c2f12374a90811e9afe600163e04a76c",
        //         "parentId": "281aab6da90811e9afe600163e04a76c",
        //         "url": "add",
        //         "icon": "",
        //         "name": "新增",
        //         "perms": "",
        //         "type": 2,
        //         "orderNum": 0,
        //         "menuTarget": 1
        //     },
        //     {
        //         "menuId": "281aab6da90811e9afe600163e04a76c",
        //         "parentId": "265",
        //         "url": "/contract",
        //         "icon": "",
        //         "name": "合同管理",
        //         "perms": "",
        //         "type": 0,
        //         "orderNum": 0,
        //         "menuTarget": 1
        //     }
        authActions: authActionsList
    }
    },
  },
  subscriptions: {
    setup({ history, dispatch }) {
      // 订阅, 监听当前页面路由改变,
      history.listen(({ pathname, search }) => {
        const { currentUserMenuList } = storage.get('gd-user', []);
        // console.log(currentUserMenuList, 'currentUserMenuList')
        const findCurrentPage = currentUserMenuList && currentUserMenuList.filter(v => !!v ).find(v => v.url === pathname );
        // console.log(currentUserMenuList, pathname, findCurrentPage, 'findCurrentPage')

        // 监听当前页面路由是否在菜单池, 如果不在, 并且不是异常页面和登陆页时, 跳转到403页面
        // 异常页面不监听路由
        // if (!isEmpty(currentUserMenuList) && !findCurrentPage && pathname.indexOf('/exception') < 0 && pathname !== '/user/login' && pathname !== '/menuConfig' && pathname !== '/') {
        //   router.replace('/exception/403');
        // }
        // if (isEmpty(findCurrentPage) && pathname.indexOf('/exception') < 0 && pathname !== '/user/login' && pathname !== '/menuConfig' && pathname !== '/') {
        //   router.replace('/exception/403');
        // }
        // 如果路径名为' / '，则触发' load '操作
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });

      // 通过订阅history，监听路由变化后，对当前路由更新authActions
      return history.listen(({ pathname }) => {
        dispatch({ type: 'updateAuthData', payload: { pathname } });
        dispatch({ type: 'queryMessageList', payload: { readStatus: 0, type: 1 } });
      });
    },
  },
};
export default GlobalModel;
