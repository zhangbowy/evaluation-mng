import { PageLoading } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import dd from 'dingtalk-jsapi';
import { message } from 'antd';
import { login } from '@/services/api';
import queryString from 'query-string';
import { history, useModel } from 'umi';

const Login: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { corpId, appId, clientId } = queryString.parse(location.search) as {
    corpId: string;
    appId: string;
    clientId: string;
  };

  useEffect(() => {
    if (!corpId) {
      message.error('缺少企业id');
      return;
    }
    console.log(corpId, appId, clientId, 'console.log(corpId && appId && clientId)')
    console.log(location.href, 'location.href')
    console.log(dd.env.platform)
    console.log(dd.env.platform != 'notInDingTalk')
    if (corpId && appId && clientId) {
      try {
        dd.env.platform != 'notInDingTalk' && dd.ready(async () => {
          const result = await dd.runtime.permission.requestAuthCode({ corpId })
          console.log(result, 'result')
          const res = await login({ code: result.code, corpId, appId });
          console.log(res, 'res')
          if (res.code === 1) {
            if (!res.data.authLogin) {
              if (!clientId) {
                message.error('缺少clientId');
                return;
              }
              // 未授权登录需要先授权登录
              window.location.replace(
                `https://login.dingtalk.com/oauth2/auth?redirect_uri=${encodeURIComponent(
                  `${window.location.origin}/admin${window.location.search}#/user/login/callback`,
                )}&response_type=code&client_id=${clientId}&scope=openid&prompt=consent`,
              );
            } else {
              console.log('已授权123123123')
              // 已经授权则免登进入系统
              setInitialState({
                ...initialState,
                user: res.data.user,
              });
              window.sessionStorage.setItem('QAT', res.data.token);
              window.sessionStorage.setItem('QCP_User', JSON.stringify(res.data.user));
              history.push('/exam/template');
            }
          } else {
            // 免登失败，提示进入403
            history.push(`/403/${res.code}`);
          }
        });
      } catch (e) {
        console.log(e, '错误了')
      }
    }
  }, [corpId, appId, clientId]);
  return <PageLoading tips="登录中" />;
};

export default Login;
