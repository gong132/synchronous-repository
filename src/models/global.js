import { queryNotices } from '@/services/user';
import { queryLogList } from '@/services/global'
import {PagerHelper} from "@/utils/helper";
import {message} from "antd";
import { queryNotices, fetchMenuList } from '@/services/user';
import {message} from "antd";
import storage from "@/utils/storage";
import { isEmpty } from "@/utils/lang";
import {router} from "umi";

const GlobalModel = {
  namespace: 'global',
  state: {
    collapsed: false,
    notices: [],
    logList: PagerHelper.genListState(),
    allMenuList: [],
    authActions: [],
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


      yield put({
        type: 'updateAuthData',
        payload: {
          pathname: window.location.pathname,
        },
      });
      callback && callback(data);
      return data
    },
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },

    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },

    *changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };

          if (notice.id === payload) {
            notice.read = true;
          }

          return notice;
        }),
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },

    *fetchLogList({payload}, {call, put}) {
      const { code, data, msg } = yield call(queryLogList, payload);
      if (code !== 200) {
        message.error(msg);
        return
      }
      data.currentPage = data.current;
      data.pageSize = data.size;
      const { records, ...others } = data;
      yield put({
        type: 'setLOgData',
        payload: {
          filter: payload,
          data: records,
          ...others
        },
      })
    }
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

    setLOgData(state, action) {
      return {
        ...state,
        logList: PagerHelper.resolveListState(action.payload),
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
      const { allMenuList } = state;

      // 如果没有菜单列表，则返回空的authActions
      if (isEmpty(allMenuList)) return { ...state, authActions: [] };

      const { pathname } = action.payload;

      const currentMenu = allMenuList.find(menu => menu.url === pathname);

      // 如果没有当前菜单权限，则返回空的authActions
      if (isEmpty(currentMenu)) return { ...state, authActions: [] };

      // menu.type 菜单类型 0 url  1 按钮
      const authActionsList = allMenuList
          .filter(menu => menu.pid === currentMenu.id && menu.type === 1)
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
        const { allMenuList } = storage.get('gd-user', []);
        const findCurrentPage = allMenuList && allMenuList.find(v => v.url === pathname );
        // 监听当前页面路由是否在菜单池, 如果不在, 并且不是异常页面和登陆页时, 跳转到403页面
        // 异常页面不监听路由
        if (!findCurrentPage && pathname.indexOf('/exception') < 0 && pathname !== '/user/login') {
          router.replace('/exception/403');
        }
        // 如果路径名为' / '，则触发' load '操作
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });

      // 通过订阅history，监听路由变化后，对当前路由更新authActions
      return history.listen(({ pathname }) => {
        dispatch({ type: 'updateAuthData', payload: { pathname } });
      });
    },
  },
};
export default GlobalModel;
