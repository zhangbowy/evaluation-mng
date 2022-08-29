import { Button, Col, Form, Input, message, Modal, Row, Table, Tag } from 'antd'
import React, { Fragment, useRef, useState, MouseEvent, useEffect } from 'react'
import styles from './index.module.less'
import { PlusCircleOutlined, CloseOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import AddTags from './addTags'
import TextArea from 'antd/lib/input/TextArea';
import { ICurList, ICurSelectTag, IFilterList, IFormItem, IWorth } from './type';
import { portraitConfig } from '@/config/portrait.config';
import { getPortraitList, getPostList, portraitPublish, postPublish } from '@/api/api';

const Worth = ({ isWorth = true }: IWorth) => {
    const [form] = Form.useForm();
    const AddTagsRef: any = useRef()
    const { getFieldsValue, getFieldValue, setFieldsValue, validateFields, resetFields } = form
    const [tagsList, setTagsList] = useState<{ [key: string]: any }>({}) // 所有选中的标签
    const [curKey, setCurKey] = useState<number>(0) // 当前点击添加标签的所欲
    const [isEdit, setIsEdit] = useState<boolean>(false) // 是否可以修改
    const [transferredData, setTransferredData] = useState<IObjType>({})
    const config = isWorth ? portraitConfig.worth : portraitConfig.post // 配置
    useEffect(() => {
        getList()
    }, [])
    // 取消
    const cancelClick = () => {
        setIsEdit(false)
        resetFields()
    }
    // 获取列表
    const getList = async () => {
        const res = isWorth ? await getPortraitList() : await getPostList()
        if (res.code == 1) {
            const arr = res.data.length > 0 ? res.data : [{
                name: '',
                description: '',
                tagIds: []
            }]
            arr.forEach((item: IFilterList) => {
                !tagsList[item.groupName || ''] && (tagsList[item.groupName || ''] = [])
                tagsList[item.groupName || ''].push(item)
            })
            setTagsList({ ...tagsList })
            setFieldsValue({ positions: arr });
        }
    }
    // 发布
    const publishClick = () => {
        validateFields().then(async values => {
            const res = isWorth ? await portraitPublish(values) : await postPublish(values)
            if (res.code == 1) {
                message.success('发布成功');
                cancelClick()
                getList()
            }
        }).catch((err) => {
            console.log(err, 'err')
            message.error('请填写完整信息，再进行发布');
        })
    }
    // 删除
    const deleteWorth = (fn: (key: number) => void, key: number) => {
        Modal.confirm({
            title: '确认要删除此行数据吗？',
            icon: <ExclamationCircleOutlined />,
            onOk() {
                delete transferredData[key]
                setTransferredData({ ...transferredData })
                fn(key)
            },
        });
    }
    // 删除标签
    const deleteTag = (e: MouseEvent<HTMLElement>, key: number, curIndex: string) => {
        e.preventDefault();
        tagsList[key].splice(curIndex, 1)
        setTagsList({ ...tagsList })
        const fields = getFieldsValue()
        const { positions } = fields
        Object.assign(positions[key], { tagIds: positions[key].tagIds.splice(curIndex, 1) })
        setFieldsValue({ positions })
    }
    // 获取选中的标签
    const getSelectTags = (obj: IObjType) => {
        console.log('obj', obj)
        transferredData[curKey] = obj
        tagsList[curKey] = Object.values(obj).flat(Infinity)
        setTagsList({ ...tagsList })
        setTransferredData({ ...transferredData })
        const tagIds = Object.values(obj).flat(Infinity).map(res => res.id)
        const fields = getFieldsValue()
        const { positions } = fields
        Object.assign(positions[curKey], { tagIds })
        setFieldsValue({ positions })
    }
    // 新增标签
    const addTag = (key: number) => {
        setCurKey(key)
        AddTagsRef.current.onOpenClick(transferredData[key] || {})
    }
    // 获取列
    const getColumns = (remove: (key: number) => void) => {
        return [
            {
                title: config.tableHeader[0],
                dataIndex: 'name',
                render: (text: any, field: any, index: number) => {
                    return (
                        <Form.Item name={[field.name, 'name']} rules={[{ required: true, message: `请输入${config.tableHeader[0]}` }]}>
                            <TextArea bordered={false} disabled={!isEdit} autoSize={{ minRows: 1, maxRows: 100 }} placeholder={`请输入${config.tableHeader[0]}`} />
                        </Form.Item>
                    )
                }
            },
            {
                title: config.tableHeader[1],
                dataIndex: 'description',
                render: (text: any, field: any, index: number) => {
                    return (
                        <Form.Item name={[field.name, 'description']} rules={[{ required: true, message: `请输入${config.tableHeader[1]}}描述` }]}>
                            <TextArea bordered={false} disabled={!isEdit} autoSize={{ minRows: 1, maxRows: 100 }} placeholder={`请输入${config.tableHeader[1]}`} />
                        </Form.Item>
                    )
                }
            },
            {
                title: config.tableHeader[2],
                dataIndex: 'tagIds',
                render: (text: any, field: any, index: number) => {
                    const { name, key } = field
                    const record = (getFieldValue('positions') || [])?.[index] || {}
                    return (
                        <Form.Item name={[field.name, 'tagIds']} rules={[{ required: true, message: `请选择${config.tableHeader[2]}标签` }]}>
                            <div className={styles.tagWrapper}>
                                <Button disabled={!isEdit} type="dashed" onClick={() => addTag(key)} icon={<PlusOutlined />}>标签</Button>
                                <div>
                                    {
                                        Object.keys(tagsList[key] || {}).map(tag => (
                                            <Tag key={tagsList[key][tag]?.id} className={styles.tagSty} closable onClose={(e: MouseEvent<HTMLElement>) => deleteTag(e, key, tag)}>
                                                {tagsList[key][tag]?.name}
                                            </Tag>
                                        ))
                                    }
                                </div>
                            </div>
                        </Form.Item>
                    )
                }
            },
            {
                title: config.tableHeader[3],
                dataIndex: 'operate',
                render: (text: any, field: any, index: number) => {
                    const record = (getFieldValue('positions') || [])
                    return (
                        <Button
                            onClick={() => deleteWorth(remove, index)}
                            disabled={record.length < 2} danger type="link" >删除</Button>
                    )
                }
            }
        ]
    }
    return (
        <Fragment>
            <div className={styles.worth_layout}>
                <header>
                    <h1>{config.title}</h1>
                    <div className={styles.worth_headerRight}>
                        {isEdit && <Button onClick={cancelClick}>取消</Button>}
                        {!isEdit && <Button type="primary" onClick={() => setIsEdit(true)}>编辑</Button>}
                        {isEdit && <Button type="primary" onClick={publishClick}>发布</Button>}
                    </div>
                </header>
                <main>
                </main>
                <Form form={form} >
                    <Form.List name="positions" >
                        {(fields, { add, remove }) => (
                            <>
                                <Table
                                    className={styles.table}
                                    dataSource={fields}
                                    bordered
                                    rowKey='key'
                                    columns={getColumns(remove)}
                                    pagination={false} />
                                <div className={styles.worth_add} >
                                    <Button className={styles.worth_addWorth} onClick={() => add()} icon={<PlusCircleOutlined />} type="dashed" block>
                                        {config.addText}
                                    </Button>
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