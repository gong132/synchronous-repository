module.exports = {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        authority: ['admin', 'user'],
        routes: [
          // 路由页面 start
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            name: 'home',
            icon: 'smile',
            component: './home/home',
          },
          {
            path: '/table',
            name: 'table',
            icon: 'crown',
            redirect: '/table/userTable',
            authority: ['admin'],
            routes: [
              {
                path: '/table/userTable',
                name: 'userTable',
                icon: 'smile',
                component: './table/userTable/index',
                authority: ['admin'],
              },
              {
                path: '/table/orderTable',
                name: 'orderTable',
                icon: 'smile',
                component: './table/orderTable/index',
                authority: ['admin'],
              },
            ],
          },

          // 路由页面 end

          // 404页面
          {
            component: './404',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  }
