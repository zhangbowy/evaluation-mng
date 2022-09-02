import { Button, Col, Form, Input, Row, Select } from 'antd';
import React, { useState, useEffect, FC } from 'react';
import { queryDept } from '@/api/api';
import { getAllUrlParam } from '@/utils/utils';
import { deptList, formType } from './type'
import styles from './index.module.less';

const { Option } = Select;

interface face {
    setSearchForm: (searchForm: formType) => void
}

const AdvancedSearchForm = ({ setSearchForm }: face) => {
    const [departmentList, setDepartmentList] = useState<Array<deptList>>([]);
    const { corpId, appId } = getAllUrlParam()
    const [form] = Form.useForm();

    useEffect(() => {
        getDepartment()
    }, [])

    // 获取部门
    const getDepartment = async () => {
        const res = await queryDept({ corpId, appId, pageSize: 10000, curPage: 1 })
        if (res.code == 1) {
            setDepartmentList((departmentList) => {
                const arr: Array<deptList> = [];
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
                name: 'positionName',
                value: '',
                type: 'input'
            },
            {
                title: '部门',
                name: 'deptId',
                type: 'select',
                option: departmentList,
            },
            {
                title: '在职状态',
                name: 'isDimission',
                type: 'select',
                option: [
                    {
                        value: 0,
                        name: '在职',
                    },
                    {
                        value: 1,
                        name: '离职',
                    }
                ],
            },
            {
                title: '职位匹配状态',
                name: 'havePosition',
                type: 'select',
                option: [
                    {
                        value: 1,
                        name: '已补充',
                    },
                    {
                        value: 0,
                        name: '待补充',
                    }
                ],
            },
        ];
        const children: Array<any> = [];
        formData.map((el, index) => {
            if (el.type == 'input') {
                children.push(
                    <Form.Item
                        key={index}
                        name={`${el.name}`}
                        label={`${el.title}`}
                        labelAlign='right'
                    >
                        <Input style={{ width: 200 }} placeholder="请输入" />
                    </Form.Item>
                );
            }
            if (el.type == 'select') {
                children.push(
                    <Form.Item
                        key={index}
                        name={`${el.name}`}
                        label={`${el.title}`}
                    >
                        <Select style={{ width: 200 }} placeholder="请选择" allowClear={true} showSearch={el.name === 'deptId'} optionFilterProp="children">
                            {el.option?.map((i, val) => {
                                return <Option value={i.value} key={val}>{i.name}</Option>
                            })}
                        </Select>
                    </Form.Item>
                );
            }
        })
        return children;
    };

    const onFinish = () => {
        setSearchForm(form.getFieldsValue())
    };

    const onReset = () => {
        form.resetFields();
        setSearchForm(form.getFieldsValue())

    };

    return (
        <div className={styles.form}>
            <Form
                form={form}
                name="advanced_search"
                className={styles.form_wrapper}
                onFinish={onFinish}
            >
                {getFields()}
            </Form>
            <div className={styles.form_btn}>
                <Button
                    style={{ margin: '0 8px', marginLeft: 'auto' }}
                    onClick={onReset}
                >
                    重置
                </Button>
                <Button type="primary" htmlType="submit" onClick={onFinish}>
                    搜索
                </Button>
            </div>
        </div>

    );
};

export default AdvancedSearchForm;