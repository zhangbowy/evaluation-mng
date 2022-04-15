import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button, message } from 'antd';
import { createExam, getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';
import { history } from 'umi';
import style from './index.less';

const ExamTemplate: React.FC = () => {
  const { corpId, appId } = queryString.parse(location.search);
  const handleClick = async (template: ExamTemplateListItem) => {
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
        examTemplateType: template.type,
        examTemplateId: template.id,
        examTitle: template.title,
        examUserList: pickResult?.users?.map((item) => ({ userId: item.emplId })),
      });
      if (res.code === 1) {
        message.success('创建成功');
        history.push('/exam/index');
      }
    });
  };
  return (
    <PageContainer header={{ breadcrumb: {} }}>
      <ProCard style={{ padding: '20px' }}>
        <ProList<ExamTemplateListItem>
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: false,
          }}
          className="template"
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
              render: (title) => {
                return <div className={style.titleHeader}>{title}</div>;
              },
            },
            content: {
              dataIndex: 'introduction',
              render: (introduction, entity) => {
                return (
                  <div>
                    <div style={{ color: '#000000', opacity: '45%', fontSize: 16, margin: 20 }}>
                      {introduction}
                    </div>
                    <div className={`${style.bottom}`} style={{ backgroundColor: '#ffffff' }}>
                      <div style={{ margin: '10px 20px' }}>
                        <div>
                          <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                            作答时间：
                          </span>
                          <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                            {entity.durationDesc}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: '#000000', opacity: '45%', fontSize: 14 }}>
                            题目数量：
                          </span>
                          <span style={{ color: '#000000', opacity: '85%', fontSize: 14 }}>
                            {entity.examLibrarySum}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleClick(entity)}
                        style={{
                          width: '100%',
                          height: 43,
                          backgroundColor: '#E5F2FF',
                          color: '#1890FF',
                          borderRadius: '0px 0px 4px 4px',
                          border: 'none',
                          fontSize: 16,
                        }}
                      >
                        创建
                      </Button>
                    </div>
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
