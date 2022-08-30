
import React, { lazy } from 'react'
import { RouteObject, useRoutes } from 'react-router';
import { Navigate } from 'react-router-dom'
import Login from '@/page/login';
import Evaluation from '@/page/evaluation';
import NeedPay from '@/page/402';
import NotJurisdiction from '@/page/403';
import PDF from '@/page/pdf';
const Management = lazy(() => import('@/page/evaluation/management'));
// const PdfDetail  = lazy(() => import('@/page/evaluation/pdf'));
const PeopleLookReport = lazy(() => import('@/page/evaluation/peopleReport/lookReport'));
const PeopleReport = lazy(() => import('@/page/evaluation/peopleReport'));
const Library = lazy(() => import('@/page/evaluation/library'));
const UserAuthority = lazy(() => import('@/page/evaluation/userAuthority'));
const NoFind = lazy(() => import('@/page/404'));
const Recharge = lazy(() => import('@/page/evaluation/recharge'));
const ManagementDetail = lazy(() => import('@/page/evaluation/management/detail'));
const PeopleReportDetail = lazy(() => import('@/page/evaluation/peopleReport/detailNew'));
const Layout = lazy(() => import('@/components/layout'));
const ManagementLibrary = lazy(() => import('@/page/evaluation/management/library'));
const RecruitEvaluation = lazy(() => import('@/page/evaluation/recruitEvaluation'));
const LaunchEvaluation = lazy(() => import('@/page/evaluation/recruitEvaluation/launchEvaluation'));
const RecruitReport = lazy(() => import('@/page/evaluation/recruitEvaluation/report'));
const LookReport = lazy(() => import('@/page/evaluation/management/detail/lookReport'));
const WorthPortrait = lazy(() => import('@/page/evaluation/portrait/worth'));
const PostPortrait = lazy(() => import('@/page/evaluation/portrait/post'));
const Employee = lazy(() => import('@/page/evaluation/staffManagement'))
const Share = lazy(() => import('@/page/share'))

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
                        element: <ManagementDetail />,
                    },
                    {
                        path: 'detail/:id/lookReport/:people',
                        element: <LookReport />
                    },
                    {
                        path: 'library/:type',
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
                    },
                    {
                        path: 'lookReport/:userId/:people',
                        element: <PeopleLookReport />
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
                path: 'employee',
                element: <Employee />
            },
            {
                path: 'userAuthority',
                children: [
                    {
                        path: 'account',
                        element: <UserAuthority />
                    }
                ]
            },
            {
                path: 'recruitEvaluation',
                element: <Layout />,
                children: [
                    {
                        index: true,
                        element: <RecruitEvaluation />
                    },
                    {
                        path: 'launchEvaluation',
                        element: <LaunchEvaluation />
                    },
                    {
                        path: 'report/:id/lookReport/:people',
                        element: <RecruitReport />
                    }
                ]
            },
            {
                path: 'portrait',
                element: <Layout />,
                children: [
                    {
                        index: true,
                    },
                    {
                        path: 'worth',
                        element: <WorthPortrait />
                    },
                    {
                        path: 'post',
                        element: <PostPortrait />
                    }
                ],
            },
        ]
    },
    {
        path: '/pdf/:type/:userId/:examPaperId',
        element: <PDF />,
    },
    {
        path: '/share/:url',
        element: <Share />
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/402',
        element: <NeedPay />,
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
