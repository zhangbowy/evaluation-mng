import { Button, Divider, Form, Input, message, Select, Switch, Table } from 'antd'
import React, { useEffect, useState } from 'react'
import styles from './index.module.less'
import { getUserList, queryDept, setAuths, setUserRole, queryPermissionUserList } from '@/api/api'
import { useSearchParams } from 'react-router-dom'
import { IUserParams, IColumns, IUserObj, IUserNewParams, IColumnsNew } from './type'
import { ColumnsType } from 'antd/lib/table'
import dd from 'dingtalk-jsapi'
import { getIsGuide, getAllUrlParam, getAppIdType } from '@/utils/utils'

const index = () => {
  const [userList, setUserList] = useState<IColumnsNew[]>([]);
  const { corpId, appId } = getAllUrlParam()
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [departmentList, setDepartmentList] = useState<IDept[]>([]);
  const [totalNum, setTotalNum] = useState<number>(0);
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10) // 多少条
  const [form] = Form.useForm();
  let timer: any;
  const appType = getAppIdType();
  useEffect(() => {
    getUser()
    getDepartment()
    timer = setTimeout(() => {
      currentStep()
    }, 1000);
    () => {
      clearTimeout(timer)
    }
  }, [])
  // 分页配置
  const paginationObj = {
    showQuickJumper: true,
    defaultCurrent: 1,
    defaultPageSize: 10,
    current,
    total: totalNum,
    showTotal: () => `共 ${totalNum} 条数据`,
    onChange: (page: number, pageSize: number) => {
      getUser({ curPage: page, pageSize, ...form.getFieldsValue() })
    }
  }
  // 引导步骤
  const currentStep = () => {
    const setsArr: StepsType[] = [{
      element: "#addPermissions",
      intro: "添加后，对应人员可以登录趣测评企业管理后台查看数据报表。",
      position: "bottom",
    }]
    getIsGuide(setsArr, 4)
  }
  // 获取用户列表
  const getUser = async (obj?: IUserObj) => {
    setTableLoading(true)
    const params: IUserNewParams = {
      // corpId,
      // appId,
      // authPoint: appId.split('_')[0] == 1 ? 'admin' : 'EVAL_USER_LIST',
      pageSize: obj?.pageSize || pageSize,
      curPage: obj?.curPage || 1,
      ...obj
    }
    const res = await queryPermissionUserList(params)
    if (res.code == 1) {
      setUserList(res.data.resultList)
      setTableLoading(false)
      setTotalNum(res.data.totalItem)
      setCurrent(res.data.curPage)
      setPageSize(res.data.pageSize)
    }
  }
  // 获取部门
  const getDepartment = async () => {
    const res = await queryDept({ corpId, appId })
    if (res.code == 1) {
      setDepartmentList(res.data.resultList)
    }
  }
  // 选中部门
  const onSelectChange = (value: string) => {
    // getUser(value)
  }
  // 搜索
  const onSearchClick = () => {
    getUser(form.getFieldsValue())
  }
  // 重置
  const onResetClick = () => {
    form.resetFields()
    getUser()
  }
  // 新增权限
  const onAddPeopleClick = async () => {
    if (dd.env.platform != 'notInDingTalk') {
      const pickResult = await dd.biz.contact.choose({
        multiple: true, //是否多选：true多选 false单选； 默认true
        corpId,
      });
      if (pickResult.length < 1) {
        return;
      }
      const res = await setAuths({
        addAuths: ['admin'],
        userIds: pickResult.map((item: any) => item.emplId),
      });
      if (res.code === 1) {
        message.success('新建成功');
        getUser()
      }
    }
  }
  const columns: ColumnsType<IColumnsNew> = [
    { title: '序号', key: 'index', render: (text, record, index) => <div>{index + 1}</div> },
    { title: '姓名', dataIndex: 'name' },
    {
      title: '部门', dataIndex: 'deptName', width: 500,
    },
    {
      title: '操作', key: 'option', render: (text, record) => {
        const roleKeys = record.roles ? record.roles.map(v => v.roleKey) : [];
        const onOpenClick = async (checked: boolean) => {
          if (appId.split('_')[0] === '1') {
            const data = { [checked ? 'addAuths' : 'removeAuths']: ['admin'], userIds: [record.userId] }
            const res = await setAuths(data);
            if (res.code === 1) {
              getUser({ curPage: current })
              message.success('操作成功');
            }
          } else if (appId.split('_')[0] === '2') {
            const data = {
              userIds: [record.userId],
              roleKeys: [checked ? 'ADMIN' : 'BROWSER']
            };
            const res = await setUserRole(data);
            if (res.code === 1) {
              getUser({ curPage: current })
              message.success('操作成功');
            }
          }
        }
        return <Switch
          key="switch"
          checkedChildren="开"
          unCheckedChildren="关"
          onClick={(checked) => onOpenClick(checked)}
          checked={roleKeys?.includes('ADMIN')}
        />
      }
    }

  ]
  return (
    <div className={styles.userAuthority_layout}>
      <h1>账号管理 </h1>
      <nav>
        <Form form={form} layout="inline">
          <Form.Item name="name" label="姓名">
            <Input placeholder="请输入" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="deptId" label="部门">
            <Select
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              optionFilterProp="children"
              onChange={onSelectChange}
              filterOption={(input, option) =>
                (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
              }
              placeholder="请选择"
              showSearch
              style={{ width: 200 }} >
              {
                departmentList.map((item: IDept) => <Select.Option key={item.deptId} value={item.deptId}>{item.name}</Select.Option>)
              }
            </Select>
          </Form.Item>
        </Form>
        <div className={styles.nav_right}>
          <Button onClick={onResetClick}>重置</Button>
          <Button type="primary" onClick={onSearchClick}>搜索</Button>
        </div>
      </nav>
      <Divider />
      <main>
        <div className={styles.detail_main_title}>
          <span>账号列表</span>
          <div>
            {
              appType === '1'
                ? <Button id="addPermissions" onClick={onAddPeopleClick} type="primary">新建权限</Button>
                : null
            }
          </div>
        </div>
        <Table loading={tableLoading}
          pagination={paginationObj}
          columns={columns}
          rowKey={(res) => res.userId} dataSource={userList} />
      </main>
    </div>
  )
}

export default index
