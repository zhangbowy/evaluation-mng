import { queryDept } from "@/api/api";
import { getAllUrlParam } from "@/utils/utils";
import { Form, Select } from "antd"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import React from "react";


const Department = () => {
    const [departmentList, setDepartmentList] = useState<IDept[]>([]);
    const { corpId, appId } = getAllUrlParam()

    useEffect(() => {
        getDepartment()
    }, [])
    // 获取部门
    const getDepartment = async () => {
        const res = await queryDept({ corpId, appId, curPage: 1, pageSize: 10000 })
        if (res.code == 1) {
            setDepartmentList(res.data.resultList)
        }
    }
    return (
        <Form.Item name="deptId" label="部门">
            <Select
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                placeholder="请选择"
                showSearch
                style={{ width: 230 }} >
                {
                    departmentList.map((item: IDept) => <Select.Option key={item.deptId} value={item.deptId}>{item.name}</Select.Option>)
                }
            </Select>
        </Form.Item>
    )
}

export {
    Department
}