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
    console.log(corpId && appId && authCode,'corpId && appId && authCode,callback')
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
          window.sessionStorage.setItem('QCP_User', JSON.stringify(res.data.user));
          history.replace('/');
        } else {
          history.replace('/403/99999');
        }
      });
    }
  }, [corpId, appId, authCode]);
  return <PageLoading />;
};

export default Callback;
