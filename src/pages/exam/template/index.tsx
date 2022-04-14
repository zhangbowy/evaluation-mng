import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, message } from 'antd';
import { getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';

const ExamTemplate: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);

  const handleClick = async (id: number) => {
    dd.device.notification.toast({
      type: 'success',
      text: '111',
      duration: 3000,
    });
    try {
      dd.device.notification.toast({
        type: 'success',
        text: '333',
        duration: 3000,
      });
      const res = await dd.biz.contact.complexPicker({
        multiple: true, //是否多选：true多选 false单选； 默认true
        limitTips: '超出了',
        pickedUsers: [],
        pickedDepartments: [],
        disabledUsers: [],
        disabledDepartments: [],
        requiredUsers: [],
        requiredDepartments: [],
        permissionType: 'GLOBAL',
        responseUserOnly: false,
        startWithDepartmentId: 0,
      });
      dd.device.notification.toast({
        type: 'success',
        text: '444',
        duration: 3000,
      });
      message.info(res);
    } catch (e: any) {
      dd.device.notification.toast({
        type: 'success',
        text: e.message,
        duration: 3000,
      });
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
