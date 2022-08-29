import { getAllList } from '@/api/api';
import { debounce, deepClone } from '@/utils/utils';
import { Input, Modal, Checkbox, Col, Row, Tag, Empty } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import React, { useState, forwardRef, useImperativeHandle, MouseEvent, useRef, ChangeEvent, useEffect, Fragment } from 'react'
import { ICurList, ICurSelectTag, IFilterList, ITagsList } from '../type';
import styles from './index.module.less'

type IPropsParams = {
    getSelectTags: (obj: IObjType) => void
}
const AddTags = forwardRef((props: IPropsParams, ref) => {
    const tags: ITagsList[] = [
        {
            groupName: '分组一', tags: [{ name: '标签一1', id: 1 },
            { name: '标签一12122s', id: 710 },
            { name: '标签一122', id: 719 },
            { name: '标签一124', id: 718 },
            { name: '标签一125', id: 717 },
            { name: '标签一126', id: 716 },
            { name: '标签一127', id: 715 },
            { name: '标签一128', id: 714 },
            { name: '标签一129', id: 713 },
            { name: '标签一120', id: 712 },
            { name: '标签一1220', id: 711 },
            { name: '标签一132', id: 27 }, { name: '标签一1544', id: 37 }]
        },
        { groupName: '分组二', tags: [{ name: '标签一1q', id: 2 }] },
        { groupName: '分组三', tags: [{ name: '标签一13', id: 3 }] },
        { groupName: '分组四', tags: [{ name: '标签一15', id: 4 }] },
        { groupName: '分组五', tags: [{ name: '标签一1e', id: 54 }] },
        { groupName: '分组l', tags: [{ name: '标签一1eqw', id: 53 }] },
        { groupName: '分组思思', tags: [{ name: '标签一1qw', id: 55 }] },
        { groupName: '撒旦法', tags: [{ name: '标签一1ad', id: 563 }] },
        { groupName: '分组三打发大水五', tags: [{ name: '标签一fs1', id: 5345 }] },
        { groupName: '发斯蒂芬', tags: [{ name: '标签一1f', id: 511 }] },
    ]
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false); // 弹窗显示
    const [filterList, setFilterList] = useState<ITagsList[]>([])   // 所有数据
    const [inputValue, setInputValue] = useState<string>() //搜索内容
    const [curSelectTagIndex, setCurSelectTagIndex] = useState<number>(0) // 当前一级tab的索引
    const [curSelectTagName, setCurSelectTagName] = useState<string>('') // 当前一级tab标题
    const [indeterminate, setIndeterminate] = useState(true);  // 全选样式
    const [checkAll, setCheckAll] = useState(false); // 全选按钮是否选中
    const [tagsMap, seyTagsMap] = useState<IObjType>({}) // 标签集合
    const [allTag, setAllTag] = useState([]) // 所有的标签
    useEffect(() => {
        getTags()
    }, [])
    // 获取标签
    const getTags = async () => {
        const res = await getAllList()
        if (res.code == 1) {
            setFilterList(res.data)
        }
    }
    // 筛选所有标签
    const filterTag = async (data: any[]) => {
        data.map(res => res.tags.map())
    }
    useImperativeHandle(ref, () => ({
        onOpenClick
    }))
    // 弹窗打开事件
    const onOpenClick = (item: IObjType) => {
        setIsModalVisible(true);
        seyTagsMap(item)
        // setCurSelectTags(item)
    };
    // 确认
    const handleOk = () => {
        props.getSelectTags(tagsMap)
        setIsModalVisible(false);
    }
    // 删除标签
    const preventDefault = (e: MouseEvent<HTMLElement>, id: number) => {
        e.preventDefault()
        Object.keys(tagsMap).map((res, index) => {
            const curIndex = tagsMap[res].findIndex((item: IFilterList) => item.id == id)
            if (curIndex > -1) {
                tagsMap[res].splice(curIndex, 1)
                setAllStyle(index, res)
                return
            }
        })
        seyTagsMap({ ...tagsMap })
        // const curIndex = curSelectTags.findIndex(res => res.id == id)
        // curSelectTags.splice(curIndex, 1)
        // setCurSelectTags([...curSelectTags])
    }
    // 关闭回调
    const onCloseCallback = () => {
        setIsModalVisible(false)
        setInputValue('')
        seyTagsMap({})
        setIndeterminate(true)
        setCheckAll(false)
    }
    // 搜索
    const search = debounce((e: ChangeEvent<HTMLInputElement>) => {
        const arr: any = []
        filterList.forEach((item: ITagsList, index) => {
            item.tags.forEach(res => {
                arr.push({ ...res, index, groupName: item.groupName })
            })
        })
        const list = arr.filter((res: any) => res.name.indexOf(e.target.value) > -1)
        setCurSelectTagIndex(list[0]?.index)
        setCurSelectTagName(list[0]?.groupName)
        setAllStyle(list[0]?.index, list[0]?.groupName)
        setInputValue(e.target.value)
    })
    // checked
    const onCheckboxClick = (e: CheckboxChangeEvent, index: number, name: string) => {
        !tagsMap[name] && (tagsMap[name] = [])
        const isCurSelectIdx = tagsMap[name].findIndex((item: IFilterList) => item.id == e.target.value.id)
        if (isCurSelectIdx > -1) {
            if (e.target.checked) {
                tagsMap[name].push({
                    name: e.target.value.name,
                    id: e.target.value.id,
                    checked: e.target.checked
                })
            } else {
                tagsMap[name].splice(isCurSelectIdx, 1)
            }
        } else {
            tagsMap[name].push({
                name: e.target.value.name,
                id: e.target.value.id,
                checked: e.target.checked
            })
        }
        seyTagsMap({ ...tagsMap })
        setAllStyle(index, name)
    }
    // 设置全选样式
    const setAllStyle = (index: number, name: string) => {
        setIndeterminate((tagsMap[name] || []).length != filterList[index].tags.length);
        setCheckAll((tagsMap[name] || []).length == filterList[index].tags.length);
    }
    // 一级tab点击
    const onOneTitleClick = (index: number, name: string) => {
        setCurSelectTagIndex(index)
        setCurSelectTagName(name)
        setAllStyle(index, name)
    }
    // 全选
    const onCheckAllChange = (e: CheckboxChangeEvent, item: ITagsList, index: number) => {
        !tagsMap[item.groupName] && (tagsMap[item.groupName] = [])
        const curMap = new Map()
        if (tagsMap[item.groupName].length > 0) {
            tagsMap[item.groupName].forEach((list: IFilterList) => {
                curMap.set(list.id, list)
            })
        }
        item.tags.map(res => {
            if (!curMap.has(res.id)) {
                tagsMap[item.groupName].push({
                    name: res.name,
                    id: res.id,
                    checked: true
                })
            }
        })
        if (e.target.checked) {
            seyTagsMap({ ...tagsMap })
        } else {
            delete tagsMap[item.groupName]
            seyTagsMap({ ...tagsMap })
        }
        setIndeterminate(false);
        setCheckAll(e.target.checked);
    }
    console.log('tagsMap', tagsMap)
    return (
        <Modal width={980} title="添加标签" visible={isModalVisible} onOk={handleOk} onCancel={onCloseCallback}>
            <div className={styles.modal_wrapper}>
                <div className={styles.modal_left}>
                    <div className={styles.modal_lefHeader}>
                        <Input onChange={search} value={inputValue} allowClear placeholder="搜索标签" />
                    </div>
                    <div className={styles.modal_leftContent}>
                        <div className={styles.modal_leftOne}>
                            {
                                filterList.length > 0 &&
                                filterList.map((item, index) => (
                                    <div onClick={() => onOneTitleClick(index, item.groupName)} className={`${styles.oneTab} ${curSelectTagIndex == index && styles.activeTab}`} key={item.groupName}>
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
                                                        <Checkbox indeterminate={indeterminate} onChange={(e: CheckboxChangeEvent) => onCheckAllChange(e, res, index)} checked={checkAll}>
                                                            全选(已选{<span>{tagsMap[index]?.length || 0}</span>}/{filterList[curSelectTagIndex]?.tags.length}个)
                                                        </Checkbox>
                                                    </Col>
                                                    {
                                                        res.tags.map(item => (
                                                            <Col span={8} key={item.id}>
                                                                <Checkbox
                                                                    onChange={(e: CheckboxChangeEvent) => onCheckboxClick(e, index, res.groupName)}
                                                                    value={item}
                                                                    checked={tagsMap[index]?.filter((res: any) => res?.id == item.id)[0]?.checked}
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
                        {Object.keys(tagsMap).length > 0 ?
                            Object.values(tagsMap).flat(Infinity).map((item: IFilterList) => (
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