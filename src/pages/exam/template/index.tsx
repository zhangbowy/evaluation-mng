import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button } from 'antd';
import { getExamTemplateList } from '@/services/api';

const ExamTemplate: React.FC = () => {
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard>
        <ProList<ExamTemplateListItem>
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
          }}
          rowKey="id"
          grid={{ gutter: 16, column: 4 }}
          request={async () => {
            const res = await getExamTemplateList();
            if (res.code === 1) {
              return {
                success: true,
                data: res.data,
              };
            }
            return { success: false };
          }}
          metas={{
            title: {
              dataIndex: 'title',
            },
            content: {
              dataIndex: 'introduction',
            },
            actions: {
              render: (_dom, entity) => {
                return (
                  <div>
                    <div>
                      <div>
                        <span>作答时间</span>
                        <span>{entity.duration}</span>
                      </div>
                      <div>
                        <span>题目数量</span>
                        <span>{entity.examLibrarySum}</span>
                      </div>
                    </div>
                    <Button>创建</Button>
                  </div>
                );
              },
            },
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamTemplate;
