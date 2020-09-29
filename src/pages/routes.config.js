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
          path: '/demand',
          name: 'demand',
          icon: 'appstore',
          // component: './demand',
          routes: [
            { path: '/demand', redirect: '/demand/myDemand' },
            {
              path: '/demand/myDemand',
              name: 'myDemand',
              component: './demand/index.js',
            },
            {
              path: '/demand/myDemand/detail',
              name: 'demandDetail',
              hideInMenu: true,
              component: './demand/components/demandDetail',
            },
            {
              path: '/demand/generalDemand',
              name: 'generalDemand',
              component: './demand/index.js',
            },
            {
              path: '/demand/generalDemand/detail',
              name: 'generalDemandDetail',
              hideInMenu: true,
              component: './demand/components/demandDetail',
            },
            {
              path: '/demand/projectDemand',
              name: 'projectDemand',
              component: './demand/index.js',
            },
            {
              path: '/demand/projectDemand/detail',
              name: 'projectDemandDetail',
              hideInMenu: true,
              component: './demand/components/demandDetail',
            },
            {
              path: '/demand/storyDetail',
              name: 'storyDetail',
              hideInMenu: true,
              component: './demand/components/story/storyDetails',
            },
          ],
        },
        {
          path: '/table',
          name: 'table',
          icon: 'TableOutlined',
          routes: [
            { path: '/table', redirect: '/table/userTable' },
            {
              path: '/table/userTable',
              name: 'userTable',
              component: './table/userTable/index.js',
              buttons: [
                { name: '审核', key: 'audit' },
                { name: '启用', key: 'enable' },
                { name: '停止', key: 'disable' },
              ],
            },
            {
              path: '/table/orderTable',
              name: 'orderTable',
              component: './table/orderTable/index.js',
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
              component: './contractBudget/contractManage',
              buttons: [
                { name: '新建', key: 'add' },
                { name: '编辑', key: 'edit' },
                { name: '查看', key: 'check' },
                { name: '导出', key: 'export' },
              ],
            },
            {
              path: '/contract-budget/contract/detail',
              name: 'contractDetail',
              hideInMenu: true,
              component: './contractBudget/contractManage/components/detail',
              buttons: [{ name: '编辑', key: 'edit' }],
            },
            {
              path: '/contract-budget/budget',
              name: 'budgetManage',
              component: './contractBudget/budgetManage/index.js',
              buttons: [
                { name: '新建', key: 'add' },
                { name: '编辑', key: 'edit' },
                { name: '查看', key: 'check' },
                { name: '导出', key: 'export' },
              ],
            },
            {
              path: '/contract-budget/budget/detail',
              name: 'budgetDetail',
              hideInMenu: true,
              component: './contractBudget/budgetManage/details',
              buttons: [{ name: '编辑', key: 'edit' }],
            },
          ],
        },
        {
          path: '/projectManage',
          name: 'projectManage',
          icon: 'project',
          component: './projectManage',
        },
        {
          path: '/projectDetail',
          name: 'projectDetail',
          hideInMenu: true,
          component: './projectManage/components/detail',
          // buttons: [{ name: '编辑', key: 'edit' }],
        },
        {
          path: '/survey',
          name: 'satisfactionSurvey',
          icon: 'project',
          hideInMenu: true,
          component: './survey',
        },
        {
          path: '/reportFormManage',
          name: 'reportFormManage',
          icon: 'pie-chart',
          routes: [
            { path: '/reportFormManage', redirect: '/reportFormManage/demandForm' },
            {
              path: '/reportFormManage/demandForm',
              name: 'demandForm',
              component: './reportFormManage/demandForm',
            },
            {
              path: '/reportFormManage/projectForm',
              name: 'projectForm',
              component: './reportFormManage/projectForm',
            },
            {
              path: '/reportFormManage/budgetForm',
              name: 'budgetForm',
              component: './reportFormManage/budgetForm',
            },
          ],
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
              buttons: [{ name: '查看', key: 'check' }],
            },
            {
              path: '/systemManage/teamManage/detail',
              name: 'teamDetail',
              hideInMenu: true,
              component: './systemManage/teamManage/components/detail',
              buttons: [{ name: '编辑', key: 'edit' }],
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
              buttons: [
                { name: '新建', key: 'add' },
                { name: '编辑', key: 'edit' },
                { name: '查看', key: 'check' },
              ],
            },
            {
              path: '/systemManage/sectorManage/detail',
              name: 'detail',
              hideInMenu: true,
              component: './systemManage/sectorManage/components/detail',
              buttons: [{ name: '编辑', key: 'edit' }],
            },
          ],
        },
        // 路由页面 end
        // 前端新增路由按钮页面
        {
          path: '/menuConfig',
          name: 'menuConfig',
          hideInMenu: true,
          component: './menuConfig/menuConfig',
        },
        // 异常页面
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
        },
      ],
    },
  ],
};
