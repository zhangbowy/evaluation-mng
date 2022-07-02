import { queryDept } from "@/api/api";
import { Form, Select } from "antd"
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";



const Department = () => {
    const [departmentList, setDepartmentList] = useState<IDept[]>([]);
    const [search] = useSearchParams()
    const corpId = search.get('corpId') || '0'
    const appId = search.get('appId') || '0'

    useEffect(() => {
        getDepartment()
    }, [])
    // 获取部门
    const getDepartment = async () => {
        const res = await queryDept({ corpId, appId })
        if (res.code == 1) {
            setDepartmentList(res.data.resultList)
        }
    }
    return (
        <Form.Item name="deptId" label="部门">
            <Select
                optionFilterProp="children"
                filterOption={(input, option) =>
                    (option!.children as unknown as string).toLowerCase().includes(input.toLowerCase())
                }
                placeholder="请选择"
                showSearch
                style={{ width: 240 }} >
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