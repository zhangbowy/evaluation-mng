import { authLogin } from '@/services/api';
import { PageLoading } from '@ant-design/pro-layout';
import queryString from 'query-string';
import { useEffect } from 'react';
import { history, useModel } from 'umi';

const Callback: React.FC = () => {
  const { corpId, appId, authCode } = queryString.parse(location.search) as {
    corpId: string;
    appId: string;
    authCode: string;
  };
  const { initialState, setInitialState } = useModel('@@initialState');
  useEffect(() => {
    if (corpId && appId && authCode) {
      authLogin({
        code: authCode,
        appId,
        corpId,
      }).then((res) => {
        if (res.code === 1) {
          setInitialState({
            ...initialState,
            user: res.data.user,
          });
          window.sessionStorage.setItem('QAT', res.data.token);
          history.replace('/');
        } else {
          history.replace('/403');
        }
      });
    }
  }, [corpId, appId, authCode]);
  return <PageLoading />;
};

export default Callback;