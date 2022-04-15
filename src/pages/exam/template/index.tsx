import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { Button } from 'antd';
import { getExamTemplateList } from '@/services/api';
import dd from 'dingtalk-jsapi';
import queryString from 'query-string';
import style from './index.less';

const ExamTemplate: React.FC = () => {
  const { corpId } = queryString.parse(location.search);
  const handleClick = async (id: number) => {
    // TODO选择钉钉用户

    const res = await dd.biz.contact.choose({
      multiple: true, //是否多选：true多选 false单选； 默认true
      corpId: corpId, //企业id
    });
    console.log(res);
    console.log(id);
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
              render: (title) => {
                return <div className={`${style.titleHeader}`}>{title}</div>;
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
                        onClick={() => handleClick(entity.id)}
                        style={{
                          width: 284,
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
            // actions: {
            //   render: (_dom, entity) => {

            //     return (
            //       <div></div>
            //     );
            //   },
            // },
          }}
        />
      </ProCard>
    </PageContainer>
  );
};

export default ExamTemplate;
