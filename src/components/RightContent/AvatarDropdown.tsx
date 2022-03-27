import React from 'react';
import { Avatar, Spin } from 'antd';
import { useModel } from 'umi';
import styles from './index.less';

const AvatarDropdown: React.FC = () => {
  const { initialState } = useModel('@@initialState');

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

  if (!initialState) {
    return loading;
  }

  const { user } = initialState;

  if (!user || !user.name) {
    return loading;
  }

  return (
    <span className={`${styles.action} ${styles.account}`}>
      <Avatar size="small" className={styles.avatar} src={user.avatar} alt="avatar" />
      <span className={`${styles.name} anticon`}>{user.name}</span>
    </span>
  );
};

export default AvatarDropdown;
