import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';
import { Col, Progress, Row, Space, Typography } from 'antd';
import queryString from 'query-string';
import { useEffect } from 'react';

const UserDetail: React.FC = () => {
  const { id } = queryString.parse(location.hash);
  useEffect(() => {}, []);
  return (
    <PageContainer header={{ title: '大熊-产品部' }}>
      <ProCard>
        <Typography>
          <Row>
            <Col span={18}>
              <Space>
                <Typography.Title>{}</Typography.Title>
                <Typography.Text disabled></Typography.Text>
              </Space>
            </Col>
            <Col span={4}>
              <Progress
                type="line"
                percent={parseFloat('0' || '0')}
                format={(percent) => `完成度${percent}%`}
              />
            </Col>
          </Row>
          <Typography.Paragraph>{}</Typography.Paragraph>
        </Typography>
        <ProTable rowKey="id" />
      </ProCard>
    </PageContainer>
  );
};

export default UserDetail;
