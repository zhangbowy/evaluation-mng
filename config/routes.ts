export default [
  { path: '/', hideInMenu: true },
  {
    path: '/403/:code',
    name: '无权访问',
    layout: false,
    component: './403',
    hideInMenu: true,
  },
  { path: '/exam/template', icon: 'reconciliation', name: '测评库', component: './exam/template' },
  { path: '/exam/index', icon: 'appstore', name: '测评管理', component: './exam' },
  { path: '/exam/:id', hideInMenu: true, name: '测评详情', component: './exam/detail' },
  { path: '/report', name: '人才报告', icon: 'file', component: './user/report' },
  { path: '/report/user', hideInMenu: true, component: './user/detail' },
  {
    path: '/user',
    icon: 'user',
    name: '权限管理',
    routes: [
      {
        path: '/user/list',
        name: '账号管理',
        component: './user/account',
      },
      {
        name: 'login',
        path: '/user/login',
        layout: false,
        hideInMenu: true,
        component: './user/login',
      },
      { path: '/user/login/callback', layout: false, hideInMenu: true, component: './user/login/callback' },
    ],
  },
  {
    component: './404',
  },
];
