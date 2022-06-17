import React from 'react';
import { Avatar, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';

const AvatarDropdown: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const userInfo = JSON.parse(sessionStorage.getItem('QCP_User') || '{}');
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  // if (!initialState) {
  //   return loading;
  // }

  const { user }:any = initialState;

  // if (!user || !user.name) {
  //   return loading;
  // }

  if (!user && !userInfo) {
    return loading;
  }

  return (
    <span className={`${styles.action} ${styles.account}`}>
      <Avatar size="small" className={styles.avatar} src={user?.avatar || userInfo?.avatar} alt="avatar" />
      <span className={`${styles.name} anticon`}>{user?.name || userInfo?.name}</span>
    </span>
  );
};

export default AvatarDropdown;
