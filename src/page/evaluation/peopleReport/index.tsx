import { Button, Divider, Form, Input, Progress, Select, Table } from 'antd'
import form from 'antd/lib/form'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { Department } from '@/components/department'
import { getJoinExamUsers, EXPORT_TALENT_REPORT } from '@/api/api'
import { IReportParams, IReportList, IDeptAggregationDTOS, ISex, IisDimission } from './type'
import { ColumnsType } from 'antd/lib/table'
import { useNavigate } from 'react-router-dom'
import { getIsGuide, returnCurDate } from '@/utils/utils'
import dd from "dingtalk-jsapi";
import { SearchData } from '@/store'

const PeopleReport = () => {
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [reportList, setReportList] = useState<IReportList[]>([]);
  const [totalNum, setTotalNum] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10) // 多少条
  const [exportLoading, setExportLoading] = useState<boolean>(false);
  const navigator = useNavigate()
  const [form] = Form.useForm();
  const { setFieldValue } = form
  useEffect(() => {
    if (Object.keys(SearchData.searchObj).length > 0) {
      setFieldValue('name', SearchData.searchObj.name)
      setFieldValue('isDimission', SearchData.searchObj.isDimission)
      setFieldValue('deptId', SearchData.searchObj.deptId)
    }
    getUserReport(Object.keys(SearchData.searchObj).length > 0 ? SearchData.searchObj : {})
  }, [])
  // 分页配置
  const paginationObj = {
    showQuickJumper: true,
    defaultPageSize: 10,
    total: totalNum,
    current: current,
    showTotal: () => `共 ${totalNum} 条数据`,
    onChange: (page: number, pageSize: number) => {
      getUserReport({ curPage: page, pageSize, ...form.getFieldsValue() })
    }
  }
  useEffect(() => {
    let timer: any;
    if (!tableLoading) {
      timer = setTimeout(() => {
        currentStep(reportList)
      }, 1000)
    }
    () => {
      clearTimeout(timer)
    }
  }, [tableLoading])
  // 引导步骤
  const currentStep = (arr: IReportList[]) => {
    const stepsArr: StepsType[] = [{
      element: "#peopleReport_title",
      intro: "用于从员工维度查看每个人参与测评的情况，和报告详情",
      position: "bottom",
    }]
    if (arr.length > 0) {
      stepsArr.push({
        element: "#reportBtn0",
        intro: "点击可查看员工标签和报告详情",
        position: "bottom",
      })
    }
    getIsGuide(stepsArr, 3)
  }
  // 搜索
  const onSearchClick = () => {
    getUserReport(form.getFieldsValue())
  }
  // 重置
  const onResetClick = () => {
    form.resetFields()
    getUserReport()
  }
  // 报告列表
  const getUserReport = async (item?: IReportParams) => {
    setTableLoading(true)
    const res = await getJoinExamUsers({
      ...item,
      pageSize: item?.pageSize || pageSize,
      curPage: item?.curPage || 1
    });
    if (res.code === 1) {
      setCurrent(res.data.curPage)
      setReportList(res.data.resultList)
      setTableLoading(false)
      setPageSize(res.data.pageSize)
      setTotalNum(res.data.totalItem)
    }
  };

  /**
   * handle export report
   */
  const handleExportReport = async () => {
    setExportLoading(true)
    const { code, data } = await EXPORT_TALENT_REPORT({
      ...form.getFieldsValue()
    });
    if (code === 1) {
      const url = data.domain + '/' + data.path;
      handleDDDownload(url);
    }
  };

  /**
   * handle dd download
   * @param url report url
   */
  const handleDDDownload = (url: string) => {
    setExportLoading(false)
    dd.biz.util.downloadFile({
      url: url, //要下载的文件的url
      name: `人才报告${returnCurDate()}.xlsx`, //定义下载文件名字
      onProgress: function (msg: any) {
        // 文件下载进度回调
      },
    })
  }

  const columns: ColumnsType<IReportList> = [
    { title: '序号', key: "index", width: 80, fixed: 'left', render: (text, record, index) => `${index + 1}` },
    { title: '姓名', dataIndex: "name", width: 100, fixed: 'left', },
    {
      title: '部门', dataIndex: 'deptAggregationDTOS', width: 270, render: (text: IDeptAggregationDTOS[]) => <div>{text.map(res => res.name).join(',')}</div>
    },
    { title: '性别', dataIndex: 'sex', width: 80, render: (text: ISex) => ISex[text] || '-' },
    {
      title: '测评完成率',
      dataIndex: 'completion',
      width: 170,
      render: (text: number) => <Progress percent={text} size="small" />
    },
    {
      title: '是否在职',
      width: 120,
      dataIndex: 'isDimission',
      render: (text: number) => IisDimission[text] || '-'
    },
    {
      title: '测评',
      fixed: 'right',
      width: 150,
      dataIndex: 'option',
      render: (text, record, index) => {
        const onReportClick = () => {
          SearchData.setSearchObj({
            current,
            pageSize,
            ...form.getFieldsValue()
          })
          navigator(`/evaluation/peopleReport/detail/${record.userId}`)
        }
        return (
          <Button onClick={onReportClick} id={`reportBtn${index}`} disabled={record.successNum < 1} type="link">{`报告(${record.successNum}/${record.totalNum})`}</Button>
        )
      }
    }
  ]
  return (
    <div className={styles.peopleReport_layout}>
      <h1 id='peopleReport_title'>人才报告 </h1>
      <nav>
        <Form form={form} layout="inline">
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入" style={{ width: 200 }} />
          </Form.Item>
          {Department()}
          <Form.Item name="isDimission" label="是否在职">
            <Select getPopupContainer={(triggerNode) => triggerNode.parentNode} placeholder="请选择" style={{ width: 200 }} >
              <Select.Option value="0">在职</Select.Option>
              <Select.Option value="1">离职</Select.Option>
            </Select>
          </Form.Item>
        </Form>
        <div className={styles.nav_right}>
          <Button onClick={onResetClick}>重置</Button>
          <Button type="primary" onClick={onSearchClick}>搜索</Button>
        </div>
      </nav>
      <Divider style={{ margin: '8px 0 24px' }} />
      <main>
        <div className={styles.detail_main_title}>
          <span>人才列表</span>
          <Button type="primary" style={{ marginBottom: '24px' }} loading={exportLoading} onClick={handleExportReport}>导出</Button>
        </div>
        <Table loading={tableLoading}
          pagination={paginationObj}
          columns={columns}
          rowKey={(res) => res.userId} dataSource={reportList} />
      </main>
    </div>
  )
}

export default PeopleReport