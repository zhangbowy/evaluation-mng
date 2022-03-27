import { PageLoading } from '@ant-design/pro-layout';
import { useEffect } from 'react';
import { useParams } from 'umi';
import dd from 'dingtalk-jsapi';
import { message } from 'antd';
import { login } from '@/services/api';

const Login: React.FC = () => {
  const { corpId } = useParams() as { corpId: string };
  useEffect(() => {
    if (!corpId) {
      message.error('缺少企业id');
      return;
    }
    dd.ready(async () => {
      const result = await dd.runtime.permission.requestAuthCode({ corpId });

      const res = await login({ code: result.code });
      // TODO
      // 授权登录
      // 设置token
    });
  }, [corpId]);
  return <PageLoading />;
};

export default Login;
