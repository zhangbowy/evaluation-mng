import { authLogin, login } from '@/api/api'
import Loading from '@/components/loading'
import { getAllUrlParam } from '@/utils/utils'
import { Button, message } from 'antd'
import dd from 'dingtalk-jsapi'
import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useSearchParams } from 'react-router-dom'

const Login = () => {
  const { corpId, appId, clientId, authCode } = getAllUrlParam()
  const navigate = useNavigate()
  // 跳转
  const handleLogin = (item: ILogin) => {
    window.sessionStorage.setItem('QCP_B_TOKEN', item.token);
    window.sessionStorage.setItem('QCP_B_USER', JSON.stringify(item.user));
    navigate(`/evaluation/library`);
  }
  useEffect(() => {
    if (authCode) {
      (async () => {
        if (!appId || !corpId) {
          message.error('appId或corpId不存在')
          return
        }
        const obj = {
          code: authCode,
          appId: appId!,
          corpId: corpId!,
        }
        const res = await authLogin(obj)
        if (res.code == 1) {
          handleLogin(res.data)
        } else {
          navigate('/403/99999');
        }
      })()
    }
    console.log(corpId, appId, clientId, authCode, 'corpId, appId, clientId, authCode ')
    dd.env.platform != 'notInDingTalk' && dd.ready(async () => {
      const result = await dd.runtime.permission.requestAuthCode({ corpId });
      const res = await login({ code: result.code, corpId, appId });
      if (res.code === 1) {
        if (!res.data.authLogin) {
          // 未授权登录需要先授权登录
          window.location.replace(
            `https://login.dingtalk.com/oauth2/auth?redirect_uri=${encodeURIComponent(
              `${location.origin}/admin/${location.search}#/login`,
            )}&response_type=code&client_id=${clientId}&scope=openid&prompt=consent`,
          );
        } else {
          window.sessionStorage.setItem('QCP_B_TOKEN', res.data.token);
          window.sessionStorage.setItem('QCP_B_USER', JSON.stringify(res.data.user));
          // 已经授权则免登进入系统
          res.data.user.auths.includes('admin') ? navigate(`/evaluation/library`) : navigate(`/403/99999`);
        }
      } else {
        // 免登失败，提示进入403
        navigate(`/403/${res.code}`);
      }
    });
  }, [])
  return (
    <Loading>登录中...</Loading>
  )
}

export default Login