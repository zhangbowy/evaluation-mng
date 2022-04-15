import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, message } from 'antd';
import { createExam, getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';
import { history } from 'umi';

const ExamTemplate: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);

  const handleClick = async (id: number) => {
    dd.ready(async () => {
      const pickResult = await dd.biz.contact.complexPicker({
        corpId,
        appId,
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
      });
      if (pickResult.selectedCount === 0) {
        return;
      }
      const res = await createExam({
        examTemplateId: id,
        examUserList: pickResult?.users?.map((item) => ({ userId: item.emplId })),
      });
      if (res.code === 1) {
        message.success('创建成功');
        history.push('/exam');
      }
    });
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
