import AdminRoutes from '@/pages/routes.config'
const routes = [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './login/login' },
    ],
  },
  AdminRoutes,
  {
    component: './404',
  },
]

export default routes
