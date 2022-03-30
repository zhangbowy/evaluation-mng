export default [
  { path: '/', redirect: '/exam/template', hideInMenu: true },
  {
    path: '/403',
    name: '无权访问',
    layout: false,
    component: './403',
    hideInMenu: true,
  },
  {
    path: '/user',
    layout: false,
    icon: 'user',
    name: '权限管理',
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
          { path: '/user/login/callback', component: './user/login/callback' },
          { path: '/user/list', name: '用户权限', component: './user/account' },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  { path: '/exam/template', icon: 'reconciliation', component: './exam/template' },
  {
    component: './404',
  },
];
