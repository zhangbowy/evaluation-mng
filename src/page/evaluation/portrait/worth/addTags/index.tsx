import { getAllList } from '@/api/api';
import { debounce } from '@/utils/utils';
import { Input, Modal, Checkbox, Col, Row, Tag, Empty } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { List } from 'echarts';
import React, { useState, forwardRef, useImperativeHandle, MouseEvent, ChangeEvent, useEffect, Fragment } from 'react'
import { IFilterList, ITagsList } from '../type';
import styles from './index.module.less'

type IPropsParams = {
    getSelectTags: (obj: IObjType) => void
}
const AddTags = forwardRef((props: IPropsParams, ref) => {
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 弹窗显示
    const [filterList, setFilterList] = useState<ITagsList[]>([])   // 所有数据
    const [inputValue, setInputValue] = useState<string>('') //搜索内容
    const [curSelectTagIndex, setCurSelectTagIndex] = useState<number>(0) // 当前一级tab的索引
    const [indeterminate, setIndeterminate] = useState(true);  // 全选样式
    const [checkAll, setCheckAll] = useState(false); // 全选按钮是否选中
    const [tagsArr, setTagsArr] = useState<IFilterList[]>([]) // 标签集合
    const [curLen, setCurLen] = useState<number>(0)
    // 获取标签
    const getTags = async (isWorth: boolean) => {
        const res = await getAllList({ type: isWorth ? 0 : 1 })
        if (res.code == 1) {
            setFilterList(res.data)
        }
        return res.data
    }
    useImperativeHandle(ref, () => ({
        onOpenClick
    }))
    // 弹窗打开事件
    const onOpenClick = async (item: IFilterList[], isWorth: boolean) => {
        const data = await getTags(isWorth)
        setTagsArr(item) // 设置当前已选数组
        setIsModalVisible(true);
        setIndeterminate(!!item.length && item.length != (data[0]?.tags || []).length);
        setCheckAll(item.length == (data[0]?.tags || []).length);
        setCurSelectTagIndex(0)
        setCurLenFn(item, data[0].tags)
    };
    // 确认
    const handleOk = () => {
        props.getSelectTags(tagsArr)
        setIsModalVisible(false);
    }
    // 删除标签
    const preventDefault = (e: MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault()
        const curIndex = tagsArr.findIndex((item: IFilterList) => item.id == id)
        tagsArr.splice(curIndex, 1)
        setAllStyle(curSelectTagIndex)
        setTagsArr([...tagsArr])
    }
    // 关闭回调
    const onCloseCallback = () => {
        setIsModalVisible(false)
        setIndeterminate(true)
        setCheckAll(false)
        setCurLen(0)
        // setInputValue('')
    }
    // 搜索
    const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
        // const arr: any = []
        // filterList.forEach((item: ITagsList, index) => {
        //     item.tags.forEach(res => {
        //         arr.push({ ...res, index, groupName: item.groupName })
        //     })
        // })
        // const list = arr.filter((res: any) => res.name.indexOf(e.target.value) > -1)
        // setCurSelectTagIndex(list[0]?.index)
        // setAllStyle(list[0]?.index, list[0]?.groupName)
    })
    // checked
    const onCheckboxClick = (e: CheckboxChangeEvent, index: number) => {
        const isCurSelectIdx = tagsArr.findIndex((item: IFilterList) => item.id == e.target.value.id)
        if (isCurSelectIdx > -1) {
            if (e.target.checked) {
                tagsArr.push({
                    name: e.target.value.name,
                    id: e.target.value.id,
                    checked: e.target.checked
                })
            } else {
                tagsArr.splice(isCurSelectIdx, 1)
            }
        } else {
            tagsArr.push({
                name: e.target.value.name,
                id: e.target.value.id,
                checked: e.target.checked
            })
        }
        setCurLenFn(tagsArr, filterList[curSelectTagIndex].tags)
        setTagsArr([...tagsArr])
        setAllStyle(index)
    }
    // 设置全选样式
    const setAllStyle = (index: number) => {
        setIndeterminate(!!tagsArr.length && tagsArr.length != (filterList[index]?.tags || []).length);
        setCheckAll(tagsArr.length == (filterList[index]?.tags || []).length);
    }
    // 一级tab点击
    const onOneTitleClick = (index: number) => {
        setCurSelectTagIndex(index)
        setAllStyle(index)
        setCurLenFn(tagsArr, filterList[index].tags)
    }
    //设置当前长度
    const setCurLenFn = (selTag: IFilterList[], curTabTag: IFilterList[]) => {
        const tagMap = new Map()
        selTag.map(item => {
            tagMap.set(item.id, item)
        })
        const curTags = curTabTag.filter((res: IFilterList) => tagMap.has(res.id))
        setCurLen(curTags.length)
    }
    // 全选
    const onCheckAllChange = (e: CheckboxChangeEvent, item: ITagsList) => {
        const curMap = new Map()
        if (tagsArr.length > 0) {
            tagsArr.forEach((list: IFilterList) => {
                curMap.set(list.id, List)
            })
        }
        if (e.target.checked) {
            item.tags.map(res => {
                if (!curMap.has(res.id)) {
                    tagsArr.push({
                        name: res.name,
                        id: res.id,
                        checked: true
                    })
                }
            })
        } else {
            filterList[curSelectTagIndex].tags.forEach(item => {
                const curIndex = tagsArr.findIndex((res: IFilterList) => item.id == res.id)
                curMap.has(item.id) && tagsArr.splice(curIndex, 1)
            })
        }
        setCurLenFn(tagsArr, filterList[curSelectTagIndex].tags)
        setTagsArr([...tagsArr])
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
    return (
        <Modal width={980} className={styles.modal_addTag} title="添加标签" visible={isModalVisible} onOk={handleOk} onCancel={onCloseCallback}>
            <div className={styles.modal_wrapper}>
                <div className={styles.modal_left}>
                    {/* <div className={styles.modal_lefHeader}>
                        <Input value={inputValue} onChange={(e) => { setInputValue(e.target.value); search(e) }} allowClear placeholder="搜索标签" />
                    </div> */}
                    <div className={styles.modal_leftContent}>
                        <div className={styles.modal_leftOne}>
                            {
                                filterList.length > 0 &&
                                filterList.map((item, index) => (
                                    <div onClick={() => onOneTitleClick(index)} className={`${styles.oneTab} ${curSelectTagIndex == index && styles.activeTab}`} key={item.groupName}>
                                        <span>{item.groupName}</span>
                                        <span>{item.tags.length}</span>
                                    </div>
                                ))
                            }
                        </div>
                        <div className={styles.modal_leftTwo}>
                            <Row gutter={[0, 20]}>
                                {
                                    filterList.map((res, index) => (
                                        <Fragment key={res.groupName}>
                                            {
                                                curSelectTagIndex == index &&
                                                <>
                                                    <Col span={24}>
                                                        <Checkbox indeterminate={indeterminate} onChange={(e: CheckboxChangeEvent) => onCheckAllChange(e, res)} checked={checkAll}>
                                                            全选<div className={styles.selectAllSty}>(已选{<span>{curLen}</span>}/{res.tags.length}个)</div>
                                                        </Checkbox>
                                                    </Col>
                                                    {
                                                        res.tags.map(item => (
                                                            <Col span={8} key={item.id}>
                                                                <Checkbox
                                                                    onChange={(e: CheckboxChangeEvent) => onCheckboxClick(e, index)}
                                                                    value={item}
                                                                    checked={tagsArr.filter(res => res.id == item.id)[0]?.checked}
                                                                >{item.name}</Checkbox>
                                                            </Col>
                                                        ))
                                                    }
                                                </>
                                            }
                                        </Fragment>
                                    ))

                                }
                            </Row>
                        </div>
                    </div>
                </div>
                <div className={styles.modal_right}>
                    <div className={styles.modal_rightContent}>
                        {
                            tagsArr.length > 0 ?
                                tagsArr.map((item: IFilterList) => (
                                    <Tag key={item?.id}
                                        closable
                                        onClose={(e: MouseEvent<HTMLElement>) => preventDefault(e, item?.id)}>
                                        {item?.name}
                                    </Tag>
                                ))
                                : '请在左侧选择价值观标签'
                        }
                    </div>
                </div>
            </div>
        </Modal >
    )
})
AddTags.displayName = 'AddTags'

export default AddTags