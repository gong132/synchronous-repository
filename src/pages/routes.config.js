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
            icon: 'home',
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
            path: '/contract-budget',
            name: 'contract-budget',
            icon: 'smile',
            routes: [
              { path: '/contract-budget', redirect: '/contract-budget/contract' },
              {
                path: '/contract-budget/contract',
                name: 'contractManage',
                component: './contractBudget/contractManage/index',
              },
              {
                path: '/contract-budget/budget',
                name: 'budgetManage',
                component: './contractBudget/budgetManage/index',
              },
              {
                path: '/contract-budget/budget/detail',
                name: 'budgetDetail',
                hideInMenu: true,
                component: './contractBudget/budgetManage/details',
              },
            ]
          },
          {
            path: '/systemManage',
            name: 'systemManage',
            icon: 'setting',
            routes: [
              { path: '/systemManage', redirect: '/systemManage/userManage' },
              {
                path: '/systemManage/userManage',
                name: 'userManage',
                component: './systemManage/userManage',
              },
              {
                path: '/systemManage/teamManage',
                name: 'teamManage',
                component: './systemManage/teamManage',
              },
              {
                path: '/systemManage/authorManage',
                name: 'authorManage',
                component: './systemManage/authorManage',
              },
              {
                path: '/systemManage/sectorManage',
                name: 'sectorManage',
                component: './systemManage/sectorManage',
              },
            ]
          },
          // 路由页面 end


          {
            path: '/exception',
            hideInMenu: true,
            routes: [
              { path: '/exception', redirect: '/exception/404' },
              {
                path: '/exception/403',
                name: 'not-permission',
                hideInMenu: true,
                component: './Exception/403',
              },
              {
                path: '/exception/404',
                name: 'not-find',
                hideInMenu: true,
                component: './Exception/404',
              },
              {
                path: '/exception/500',
                name: 'server-error',
                hideInMenu: true,
                component: './Exception/500',
              },
            ],
          }
        ],
      },
    ],
  }
