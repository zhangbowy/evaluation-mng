import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import defaultSettings from '../config/defaultSettings';
import { message, notification, Result } from 'antd';

const loginPath = '/user/login';
const callbackPath = '/user/login/callback';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  user?: User;
  loading?: boolean;
}> {
  return {
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.user?.name,
    },
    footerRender: false,
    logo: 'https://qzz-static.forwe.store/fadmin/%E7%99%BD%E5%BA%95%402x.png',
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (
        !initialState?.user &&
        location.pathname !== loginPath &&
        location.pathname !== callbackPath
      ) {
        // history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    unAccessible: (
      <Result
        status="403"
        title="403"
        subTitle="对不起，您无权访问"
        extra={<span>请联系管理员配置权限</span>}
      />
    ),
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading />;
      return <>{children}</>;
    },
    ...initialState?.settings,
  };
};

const filterParams = (params: any) => {
  const newParams = {};
  for (const key in params) {
    if (params[key] === undefined || params[key] === null || params[key] === '') {
    } else {
      newParams[key] = params[key];
    }
  }
  return newParams;
};

const middleware = async (ctx: any, next: () => void) => {
  try {
    if (ctx.req.options.params) {
      ctx.req.options.params = filterParams(ctx.req.options.params);
    }
    await next();
    if (ctx.res.code !== 1) {
      message.error(ctx.res.message || '系统错误');
    }
  } catch (error) {
    notification.error({
      message: `请求错误 ${ctx.res.status}: ${ctx.req.url}`,
      description: '网络错误',
    });
  }
};

const authHeaderInterceptor = (url: string, options: any) => {
  // const token = window.sessionStorage.getItem('QAT');
  const token = '9bf7bb6b815d6717ee0e455177bd0df8';
  const authHeader = { QZZ_ACCESS_TOKEN: token };
  return {
    url,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  errorHandler: (error) => {
    // 异常不再向上抛
    notification.error({ message: '系统错误' });
    console.error(error);
  },
  requestInterceptors: [authHeaderInterceptor],
  middlewares: [middleware],
};
