import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, notification } from 'antd';
import { getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';

const ExamTemplate: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  const handleClick = async (id: number) => {
    notification.info({ message: id, duration: null });
    // TODO选择钉钉用户
    try {
      notification.info({
        message: `${appId}| ${corpId}`,
        duration: null,
      });
      const res = await dd.biz.contact.complexPicker({
        multiple: true, //是否多选：true多选 false单选； 默认true
        // @ts-ignore
        corpId: corpId, //企业id
        // @ts-ignore
        appId: appId,
        responseUserOnly: false,
      });
      notification.error({ message: res.users });
    } catch (e: any) {
      notification.error({ message: e });
    }
  };
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
                        <span>{entity.durationDesc}</span>
                      </div>
                      <div>
                        <span>题目数量</span>
                        <span>{entity.examLibrarySum}</span>
                      </div>
                    </div>
                    <Button onClick={() => handleClick(entity.id)}>创建</Button>
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
