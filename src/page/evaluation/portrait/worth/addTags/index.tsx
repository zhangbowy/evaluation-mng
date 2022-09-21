import { getAllList } from '@/api/api';
import { debounce } from '@/utils/utils';
import { Input, Modal, Checkbox, Col, Row, Tag, Empty, message } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { List } from 'echarts';
import React, { useState, forwardRef, useImperativeHandle, MouseEvent, KeyboardEvent, ChangeEvent, useEffect, Fragment, useMemo } from 'react'
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
    const [isWorth, setIsWorth] = useState<boolean>(true) // 是否是价值观
    const [searchData, setSearchData] = useState<ITagsList[]>([]) //搜索得到的数据
    const [isSearch, setIsSearch] = useState<boolean>(false); // 是否搜索
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
        setIsWorth(isWorth)
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
        const curClassifyIndex = filterList[curSelectTagIndex].tags.findIndex((item: IFilterList) => item.id == id)
        tagsArr.splice(curIndex, 1)
        curClassifyIndex > -1 && setAllStyle(curSelectTagIndex)
        setTagsArr([...tagsArr])
    }
    // 关闭回调
    const onCloseCallback = () => {
        setIsModalVisible(false)
        setIndeterminate(true)
        setCheckAll(false)
        setCurLen(0)
        setInputValue('')
        setIsSearch(false);
        setSearchData([]);
    }
    // 搜索
    // const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
    //     const arr: any = []
    //     filterList.forEach((item: ITagsList, index) => {
    //         item.tags.forEach(res => {
    //             arr.push({ ...res, index, groupName: item.groupName })
    //         })
    //     })
    //     const list = arr.filter((res: any) => res.name.indexOf(e.target.value) > -1)
    //     setCurSelectTagIndex(list[0]?.index)
    //     setAllStyle(list[0]?.index)
    // })
    const search = (name: string) => {
        if (name) {
            setIsSearch(true);
        } else {
            setIsSearch(false);
        }
        const copyData: ITagsList[] = JSON.parse(JSON.stringify(filterList));
        copyData.forEach(item => {
            if (item.groupName === '全部') {
                const { tags } = item;
                const filterTags = tags.filter(v => v.name.includes(name))
                item.tags = filterTags
            }
        })
        setSearchData(copyData);
        // const len = setCurLenFn(tagsArr, copyData[curSelectTagIndex].tags)
        const len = getCurLenFn(tagsArr, copyData[curSelectTagIndex].tags)
        const lenAll = getCurLenFn(tagsArr, filterList[curSelectTagIndex].tags)
        setCurLen(lenAll);
        setCheckAll(len == filterList[curSelectTagIndex].tags.length);
        setIndeterminate(len > 0 && len < filterList[curSelectTagIndex].tags.length);
    }
    const keyDownTag = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // 调用查询方法
            search((e.target as HTMLInputElement).value);
        }
    };
    // checked
    const onCheckboxClick = (e: CheckboxChangeEvent, index: number) => {
        const isCurSelectIdx = tagsArr.findIndex((item: IFilterList) => item.id == e.target.value.id)
        if (isCurSelectIdx > -1) {
            tagsArr.splice(isCurSelectIdx, 1)
        } else {
            if (!isWorth && tagsArr.length >= 10) {
                message.warning('最多勾选10个标签');
                return
            }
            tagsArr.push({
                name: e.target.value.name,
                id: e.target.value.id,
                checked: e.target.checked
            })
        }
        setTagsArr([...tagsArr])
        setAllStyle(index)
        // setCurLenFn(tagsArr, isSearch ? searchData[curSelectTagIndex].tags : filterList[curSelectTagIndex].tags)
    }
    // 设置全选样式
    const setAllStyle = (index: number) => {
        // setIndeterminate(!!tagsArr.length && tagsArr.length != (filterList[index]?.tags || []).length);
        // setCheckAll(tagsArr.length == (filterList[index]?.tags || []).length);
        let tagData: ITagsList[] = [];
        if (isSearch) {
            tagData = searchData
        } else {
            tagData = filterList
        }
        // const len = setCurLenFn(tagsArr, filterList[index].tags)
        const len = getCurLenFn(tagsArr, tagData[index].tags)
        const lenAll = getCurLenFn(tagsArr, filterList[index].tags)
        setCurLen(lenAll);
        setIndeterminate(len > 0 && len < tagData[index].tags.length);
        setCheckAll(len == tagData[index].tags.length);
    }
    // 一级tab点击
    const onOneTitleClick = (index: number) => {
        setCurSelectTagIndex(index)
        setAllStyle(index)
        setSearchData([]);
        setIsSearch(false)
        setInputValue('');
        // setCurLenFn(tagsArr, filterList[index].tags)
    }
    //设置当前长度
    const setCurLenFn = (selTag: IFilterList[], curTabTag: IFilterList[]) => {
        const tagMap = new Map()
        selTag.map(item => {
            tagMap.set(item.id, item)
        })
        const curTags = curTabTag.filter((res: IFilterList) => tagMap.has(res.id))
        setCurLen(curTags.length)
        return curTags.length
    }
    // 获取当前长度
    const getCurLenFn = (selTag: IFilterList[], curTabTag: IFilterList[]) => {
        const tagMap = new Map()
        selTag.map(item => {
            tagMap.set(item.id, item)
        })
        const curTags = curTabTag.filter((res: IFilterList) => tagMap.has(res.id))
        return curTags.length
    }
    // 全选
    const onCheckAllChange = (e: CheckboxChangeEvent, item: ITagsList) => {
        const curMap = new Map()
        let tagData: ITagsList[] = [];
        if (isSearch) {
            tagData = searchData
        } else {
            tagData = filterList
        }
        if (tagsArr.length > 0) {
            tagsArr.forEach((list: IFilterList) => {
                curMap.set(list.id, List)
            })
        }
        if (!isWorth) {
            if (tagData[curSelectTagIndex].tags.length > 10) return message.warning('最多勾选10个标签');
            const selArr = tagData[curSelectTagIndex].tags.filter(item => !curMap.has(item.id))
            if (tagsArr.length + selArr.length > 10) return message.warning('最多勾选10个标签');
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
            tagData[curSelectTagIndex].tags.forEach(item => {
                const curIndex = tagsArr.findIndex((res: IFilterList) => item.id == res.id)
                curMap.has(item.id) && tagsArr.splice(curIndex, 1)
            })
        }
        // setCurLenFn(tagsArr, tagData[curSelectTagIndex].tags)
        setAllStyle(curSelectTagIndex)
        setTagsArr([...tagsArr])
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
    // 获得渲染的数据
    const { renderTagData } = useMemo(() => {
        if (isSearch) {
            return {
                renderTagData: searchData
            }
        }
        return {
            renderTagData: filterList
        }

    }, [inputValue ,filterList, searchData, isSearch])
    return (
        <Modal width={980} className={styles.modal_addTag} title="添加标签" visible={isModalVisible} onOk={handleOk} onCancel={onCloseCallback}>
            <div className={styles.modal_wrapper}>
                <div className={styles.modal_left}>
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
                                    renderTagData.map((res, index) => (
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
                                                        res.groupName === '全部'
                                                            ? <Col span={24}>
                                                                <div className={styles.modal_lefHeader}>
                                                                    <Input
                                                                        value={inputValue}
                                                                        onChange={(e) => {
                                                                            setInputValue(e.target.value)
                                                                            if (!e.target.value) {
                                                                                search((e.target as HTMLInputElement).value);
                                                                            }
                                                                        }}
                                                                        allowClear
                                                                        placeholder="搜索标签（按Enter搜索）"
                                                                        onKeyDown={(e) => keyDownTag(e)}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            : null
                                                    }
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
                                : `${isWorth ? '请在左侧选择价值观标签' : '请勾选左侧岗位标签，最多不超过10个'}`
                        }
                    </div>
                </div>
            </div>
        </Modal >
    )
})
AddTags.displayName = 'AddTags'

export default AddTags