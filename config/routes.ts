export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
          { path: '/user/login/callback', component: './user/Login/callback' }
        ],
      },
      {
        component: './404',
      },
    ],
  },
  { path: '/exam/template', icon: 'Reconciliation', component: './exam/template' },
  {
    component: './404',
  },
];
