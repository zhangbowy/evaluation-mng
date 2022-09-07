import { Button, Col, Form, Input, message, Modal, Row, Table, Tag } from 'antd'
import React, { Fragment, useRef, useState, MouseEvent, useEffect } from 'react'
import styles from './index.module.less'
import { PlusCircleOutlined, CloseOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddTags from './addTags'
import TextArea from 'antd/lib/input/TextArea';
import { ICurList, ICurSelectTag, IFilterList, IFormItem, IPortraitList, IWorth } from './type';
import { portraitConfig } from '@/config/portrait.config';
import { delPost, getPortraitList, getPostList, portraitPublish, postPublish } from '@/api/api';

const Worth = ({ isWorth = true }: IWorth) => {
    const [form] = Form.useForm();
    const AddTagsRef: any = useRef()
    const { getFieldsValue, getFieldValue, setFieldsValue, validateFields, resetFields } = form
    const [curKey, setCurKey] = useState<number>(0) // 当前点击添加标签的所欲
    const [isEdit, setIsEdit] = useState<boolean>(false) // 是否可以修改
    const [transferredData, setTransferredData] = useState<IObjType>({})
    const [loading, setLoading] = useState<boolean>(true)
    const config = isWorth ? portraitConfig.worth : portraitConfig.post // 配置
    useEffect(() => {
        getList({ publish: 1 })
    }, [])
    // 取消
    const cancelClick = () => {
        Modal.confirm({
            title: '取消后修改内容将不会被保存',
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                setIsEdit(false)
                const obj: any = {}
                !isWorth && (obj.publish = 1)
                getList(obj)
            },
        });
    }
    // 编辑
    const edit = () => {
        setIsEdit(true)
        !isWorth && getList()
    }
    // 获取列表
    const getList = async (params?: { publish: number }) => {
        const res = isWorth ? await getPortraitList() : await getPostList(params)
        if (res.code == 1) {
            let arr = [];
            if (res.data.length > 0) {
                arr = res.data.map((item: IPortraitList) => {
                    return {
                        id: item.id,
                        name: item.name,
                        description: item.description,
                        tagIds: item.tags.map((list: IFilterList) => list.id),
                        tags: item.tags.map((list: IFilterList) => ({ groupName: list.groupName, name: list.name, id: list.id, checked: true }))
                    }
                })
            } else {
                arr = [{
                    name: '',
                    description: '',
                    tagIds: [],
                    tags: []
                }]
            }
            setFieldsValue({ [config.fieldName]: arr });
            setLoading(false)
        }
    }
    // 发布
    const publishClick = () => {
        validateFields().then(async values => {
            const res = isWorth ? await portraitPublish(values) : await postPublish(values)
            if (res.code == 1) {
                message.success('发布成功');
                setIsEdit(false)
                const obj: any = {}
                !isWorth && (obj.publish = 1)
                getList(obj)
            }
        }).catch((err) => {
            console.log(err, 'err')
            message.error('请填写完整信息，再进行发布');
        })
    }
    // 删除
    const deleteWorth = (fn: (key: number) => void, key: number, record: any) => {
        Modal.confirm({
            title: '确认要删除此行数据吗？',
            icon: <ExclamationCircleOutlined />,
            async onOk() {
                if (!isWorth && record[key]?.id) {
                    const res = await delPost({ id: record[key].id })
                    if (res.code != 1) return;
                }
                delete transferredData[key]
                setTransferredData({ ...transferredData })
                fn(key)
            },
        });
    }
    // 删除标签
    const deleteTag = (e: MouseEvent<HTMLElement>, key: number, curIndex: number) => {
        e.preventDefault();
        const curObj = getFieldsValue()
        const curVal = curObj[config.fieldName]
        curVal[key].tagIds.splice(curIndex, 1)
        curVal[key].tags.splice(curIndex, 1)
        setFieldsValue({ [config.fieldName]: curVal })
    }
    // 获取选中的标签
    const getSelectTags = (obj: IObjType) => {
        transferredData[curKey] = obj
        setTransferredData({ ...transferredData })
        const tagIds = Object.values(obj).flat(Infinity).map(res => res.id)
        const curObj = getFieldsValue()
        const curVal = curObj[config.fieldName]
        !curVal[curKey].tags && (curVal[curKey].tags = [])
        Object.assign(curVal[curKey], { tagIds, tags: [...Object.values(obj).flat(Infinity)] })
        setFieldsValue({ [config.fieldName]: curVal })
    }
    // 新增标签
    const addTag = (index: number) => {
        setCurKey(index)
        const curObj = getFieldsValue()
        const curVal = curObj[config.fieldName]
        AddTagsRef.current.onOpenClick(curVal[index].tags || [], isWorth)
    }
    // 获取列
    const getColumns = (remove: (key: number) => void) => {
        const arr = [
            {
                title: config.tableHeader[0],
                dataIndex: 'name',
                width: 233,
                render: (text: any, field: any) => {
                    return (
                        <Form.Item name={[field.name, 'name']} rules={[{ required: true, message: `请输入${config.tableHeader[0]}` }]}>
                            <TextArea maxLength={256} autoSize={{ minRows: 2, maxRows: 5 }} bordered={isEdit} disabled={!isEdit} placeholder={`请输入${config.tableHeader[0]}`} />
                        </Form.Item>
                    )
                }
            },
            {
                title: config.tableHeader[1],
                dataIndex: 'description',
                width: 300,
                render: (text: any, field: any) => {
                    return (
                        <Form.Item name={[field.name, 'description']} rules={[{ required: true, message: `请输入${config.tableHeader[1]}` }]}>
                            <TextArea maxLength={256} autoSize={{ minRows: 2, maxRows: 5 }} bordered={isEdit} disabled={!isEdit} placeholder={`请输入${config.tableHeader[1]}`} />
                        </Form.Item>
                    )
                }
            },
            {
                title: config.tableHeader[2],
                dataIndex: 'tagIds',
                render: (text: any, field: any, index: number) => {
                    const { name, key } = field
                    const record = (getFieldValue(config.fieldName) || [])?.[index] || {}
                    const { tags } = record
                    return (
                        <Form.Item name={[field.name, 'tagIds']} rules={[{ required: true, message: `请选择${config.tableHeader[2]}` }]}>
                            <div className={styles.tagWrapper}>
                                {
                                    isEdit && <Button size='small' type="dashed" onClick={() => addTag(index)} icon={<PlusOutlined />}>标签</Button>
                                }
                                <div>
                                    {
                                        tags?.map((tag: IFilterList, idx: number) => (
                                            <Tag key={tag.id} className={styles.tagSty} closable={isEdit} onClose={(e: MouseEvent<HTMLElement>) => deleteTag(e, key, idx)}>
                                                {tag.name}
                                            </Tag>
                                        ))
                                    }
                                </div>
                            </div>
                        </Form.Item>
                    )
                }
            },
        ]
        const list = {
            title: config.tableHeader[3],
            dataIndex: 'operate',
            render: (text: any, field: any, index: number) => {
                const record = (getFieldValue(config.fieldName) || [])
                return (
                    <Button
                        onClick={() => deleteWorth(remove, index, record)}
                        disabled={record.length < 2} danger type="link" >删除</Button>
                )
            }
        }
        isEdit && arr.push(list)
        return arr
    }
    return (
        <Fragment>
            <div className={styles.worth_layout}>
                <header>
                    <h1>{config.title}</h1>
                    <div className={styles.worth_headerRight}>
                        {isEdit && <Button onClick={cancelClick}>取消</Button>}
                        {!isEdit && <Button type="primary" onClick={edit}>编辑</Button>}
                        {isEdit && <Button type="primary" onClick={publishClick}>发布</Button>}
                    </div>
                </header>
                <Form form={form} >
                    <Form.List name={config.fieldName} >
                        {(fields, { add, remove }) => (
                            <>
                                <Table
                                    className={styles.table}
                                    dataSource={fields}
                                    bordered
                                    rowKey='key'
                                    columns={getColumns(remove)}
                                    loading={loading}
                                    pagination={false} />
                                <div className={styles.worth_add} >
                                    {isEdit && <Button className={styles.worth_addWorth} onClick={() => add()} icon={<PlusCircleOutlined />} type="dashed" block>
                                        {config.addText}
                                    </Button>}
                                    {/* <Button type="link">下载模板</Button>
                                    <Button type="link">批量导入</Button> */}
                                </div>
                            </>
                        )}
                    </Form.List>
                </Form>
            </div >
            <AddTags getSelectTags={getSelectTags} ref={AddTagsRef} />
        </Fragment >
    )
}

export default Worth