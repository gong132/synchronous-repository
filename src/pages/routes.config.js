module.exports = {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        // authority: ['admin', 'user'],
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
            path: 'table',
            name: 'table',
            icon: 'TableOutlined',
            routes: [
              { path: '/table', redirect: '/table/userTable' },
              {
                path: '/table/userTable',
                name: 'userTable',
                component: './table/userTable/index',
              },
              {
                path: '/table/orderTable',
                name: 'orderTable',
                component: './table/orderTable/index',
              },
            ],
          },
          {
            path: '/test',
            name: 'test',
            icon: 'smile',
            routes: [
              { path: '/test', redirect: '/testRoute' },
              {
                path: '/testRoute',
                name: 'test',
                component: './testRoute/index',
              },
            ]
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
