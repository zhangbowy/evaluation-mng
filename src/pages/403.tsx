import { Result } from 'antd';
import React from 'react';

const NoAuthPage: React.FC = () => (
  <Result status="403" title="403" subTitle="对不起, 你没有权限访问" />
);

export default NoAuthPage;
