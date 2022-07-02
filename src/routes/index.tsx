
import React, { lazy } from 'react'
import { RouteObject, useRoutes } from 'react-router';
import { Navigate } from 'react-router-dom'
const Evaluation = lazy(() => import('@/page/evaluation'))
const Management = lazy(() => import('@/page/evaluation/management'))
const PeopleReport = lazy(() => import('@/page/evaluation/peopleReport'))
const Library = lazy(() => import('@/page/evaluation/library'))
const UserAuthority = lazy(() => import('@/page/evaluation/userAuthority'))
const NoFind = lazy(() => import('@/page/404'))
const Recharge = lazy(() => import('@/page/evaluation/recharge'))
const ManagementDetail = lazy(() => import('@/page/evaluation/management/detail'))
const PeopleReportDetail = lazy(() => import('@/page/evaluation/peopleReport/detail'))
const Login = lazy(() => import('@/page/login'));
const Layout = lazy(() => import('@/components/layout'));
const NotJurisdiction = lazy(() => import('@/page/403'))
const ManagementLibrary = lazy(() => import('@/page/evaluation/management/library'));

const routes: RouteObject[] = [
    {
        path: '/evaluation',
        element: <Evaluation />,
        children: [
            {
                index: true,
                element: <Navigate to="/evaluation/management" />,
            },
            {
                path: 'management',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <Management />,
                    },
                    {
                        path: 'detail/:id',
                        element: <ManagementDetail />
                    },
                    {
                        path: 'library',
                        element: <ManagementLibrary />
                    }
                ]
            },
            {
                path: 'peopleReport',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <PeopleReport />,
                    },
                    {
                        path: 'detail/:userId',
                        element: <PeopleReportDetail />
                    }
                ]
            },
            {
                path: 'library',
                element: <Library />
            },
            {
                path: 'recharge',
                element: <Recharge />
            },
            {
                path: 'userAuthority',
                children: [
                    {
                        path: 'account',
                        element: <UserAuthority />
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/403/:code',
        element: <NotJurisdiction />,
    },
    { path: '/', element: <Navigate to="/login" /> },
    // 当用户输入到保存在的路由使用通配符来重定向
    { path: '*', element: <NoFind /> }
]
const Routers = () => useRoutes(routes)
export default Routers;
