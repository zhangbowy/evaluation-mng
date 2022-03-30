import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';

const UserDetail: React.FC = () => {
  return (
    <PageContainer header={{ title: '大熊-产品部' }}>
      <ProCard>
        <ProCard direction="row">
          <ProCard>
            <span>完成测评：</span>
          </ProCard>
          <ProCard>
            <span>剩余测评：</span>
          </ProCard>
        </ProCard>
        <ProTable rowKey="id" />
      </ProCard>
    </PageContainer>
  );
};

export default UserDetail;
