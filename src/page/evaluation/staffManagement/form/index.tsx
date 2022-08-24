import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, FC } from 'react';
import { queryDept } from '@/api/api';
import { getAllUrlParam } from '@/utils/utils';
import {deptList, formType} from './type'
import styles from './index.module.less';

const { Option } = Select;

interface face {
    setSearchForm: any
}

const AdvancedSearchForm = ({setSearchForm}:face) => {
    const [departmentList, setDepartmentList] = useState<Array<deptList>>([]);
    const { corpId, appId } = getAllUrlParam()
    const [form] = Form.useForm();

    useEffect(() => {
        getDepartment()
    }, [])

    // 获取部门
    const getDepartment = async () => {
        const res = await queryDept({ corpId, appId })
        if (res.code == 1) {
            setDepartmentList((departmentList) => {
                let arr: Array<deptList> = [];
                res.data.resultList.forEach((el: deptList) => {
                    let item = {
                        value: 0,
                        name: '',
                    };
                    item.value = el.deptId as number;
                    item.name = el.name;
                    arr.push(item)
                });
                return arr
            })
        }
    }

    const getFields = () => {
        const formData = [
            {
                title: '姓名',
                name: 'name',
                value: '',
                type: 'input'
            },
            {
                title: '职位',
                name: 'position',
                value: '',
                type: 'input'
            },
            {
                title: '部门',
                name: 'dept',
                type: 'select',
                option: departmentList,
            },
            {
                title: '在职状态',
                name: 'status',
                type: 'select',
                option: [
                    {
                        value: true,
                        name: '在职',
                    },
                    {
                        value: false,
                        name: '不在职',
                    }
                ],
            },
            {
                title: '职位匹配状态',
                name: 'mate',
                type: 'select',
                option: [
                    {
                        value: true,
                        name: '匹配',
                    },
                    {
                        value: false,
                        name: '不匹配',
                    }
                ],
            },
        ];
        const children: Array<any> = [];
        formData.map((el, index) => {
            if (el.type == 'input') {
                children.push(
                    <Col span={8} key={index}>
                        <Form.Item
                            name={`${el.name}`}
                            label={`${el.title}`}
                            labelAlign='right'
                        >
                            <Input style={{width: 280}} placeholder="请输入" />
                        </Form.Item>
                    </Col>,
                );
            }
            if (el.type == 'select') {
                children.push(
                    <Col span={8} key={index}>
                        <Form.Item
                            name={`${el.name}`}
                            label={`${el.title}`}
                        >
                            <Select style={{width: 280}} placeholder="请选择">
                                {el.option?.map((i, val) => {
                                    return <Option value={i.value} key={val}>{i.name}</Option>
                                })}
                            </Select>
                        </Form.Item>
                    </Col>,
                );
            }
        })
        return children;
    };

    const onFinish = (values: formType) => {
        // console.log('Received values of form: ', values);
        setSearchForm(values)
    };

    return (
        <Form
            form={form}
            name="advanced_search"
            className="ant-advanced-search-form"
            onFinish={onFinish}
        >
            <Row gutter={24}>{getFields()}
                <Button
                    style={{ margin: '0 8px', marginLeft: 'auto' }}
                    onClick={() => {
                        form.resetFields();
                    }}
                >
                    重置
                </Button>
                <Button type="primary" htmlType="submit" style={{marginRight: 12}}>
                    搜索
                </Button>
            </Row>
        </Form>
    );
};

export default AdvancedSearchForm;