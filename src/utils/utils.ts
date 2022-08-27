import { createExam, getAllPeople, isGuide, queryExamUserIds, updateExam } from "@/api/api";
import { handleStep } from "@/components/Steps";
import { Modal } from "antd";
import dd from "dingtalk-jsapi";

export const isTrue = (text: any) => {
    return text === 'true' || text == 1
}
// 防抖
export const debounce = (fn: () => void, time: number) => {
    let timer: any;
    return (arg: any) => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
        timer = setTimeout(() => {
            // eslint-disable-next-line prefer-spread
            fn.apply(null, arg)
        }, time)
    }
}
//  随机rgba颜色
export const randomRgbaColor = () => {
    const r = Math.floor(Math.random() * 256); //随机生成256以内r值
    const g = Math.floor(Math.random() * 256); //随机生成256以内g值
    const b = Math.floor(Math.random() * 256); //随机生成256以内b值
    const alpha = Math.random(); //随机生成1以内a值
    return `rgb(${r},${g},${b},${alpha})`; //返回rgba(r,g,b,a)格式颜色
}
//  随机rgb颜色
export const randomRgbColor = () => { //随机生成RGB颜色
    const r = Math.floor(Math.random() * 256); //随机生成256以内r值
    const g = Math.floor(Math.random() * 256); //随机生成256以内g值
    const b = Math.floor(Math.random() * 256); //随机生成256以内b值
    return `${r},${g},${b}`; //返回rgb(r,g,b)格式颜色
}

type CurrentType = 'add' | 'update'

// 获取连接上的参数
export const getAllUrlParam = () => {
    const url = location.search; //获取url中"?"符后的字串  
    const theRequest: any = new Object();
    if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}

// 钉钉选人
export const ddSelectPeople = (item: IDDSelectPeopleParams, type: CurrentType = 'add') => {
    const { appId } = getAllUrlParam();
    // 温馨提示
    const cozyMessage = (data: Multiple[]) => {
        if (data.length > 0) {
            if (appId.split('_')[0] === '1') {
                type == 'add' ?
                Modal.confirm({
                    title: '温馨提示',
                    content: `本次测评预计最多消耗${(item?.pointPrice || 0) * data.length}点券，当前可用点券：${item?.availableBalance || 0}`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk() {
                        item.successFn(data)
                    },
                }) : item.successFn(data)
            } else if (appId.split('_')[0] === '2') {
                item.successFn(data)
            }
        }
    }
    // dd.env.platform !== 'notInDingTalk' &&
    //     dd.ready(() => {
    //         dd.biz.customContact.multipleChoose({
    //             title: '请选择', //标题
    //             users: item.usersList,//一组员工工号
    //             corpId: item.corpId,//企业 ID，
    //             isShowCompanyName: true,   //true|false，默认为 false
    //             selectedUsers: item.selectedUsers || [], //默认选中的人，注意:已选中不可以取消
    //             disabledUsers: item.selectedUsers || [],//不能选的人
    //             max: 1000, //人数限制
    //             onSuccess: (data: Multiple[]) => {
    //                 cozyMessage(data)
    //             },
    //             onFail: (err: Error) => {
    //                 console.log(err, '失败了啊')
    //             }
    //         });
    //     })

    dd.env.platform !== 'notInDingTalk' &&
        dd.biz.contact.complexPicker({
            title: "请选择",            //标题
            corpId: item.corpId,             //企业的corpId
            multiple: true,            //是否多选
            limitTips: "超出了",          //超过限定人数返回提示
            maxUsers: 1000,            //最大可选人数
            pickedUsers: item.selectedUsers || [], //已选用户
            disabledUsers: [],            //不可选用户
            disabledDepartments: [],        //不可选部门
            requiredUsers: [],            //必选用户（不可取消选中状态）
            requiredDepartments: [],        //必选部门（不可取消选中状态）
            responseUserOnly: true,        //返回人，或者返回人和部门
            startWithDepartmentId: 0,   //仅支持0和-1
            onSuccess: (result: ComplexPicker) => {
                cozyMessage(result.users)
            },
            onFail: (err: Error) => {
                console.log(err, '选择部门和人失败了啊')
            }
        });

}
// 添加人员
export const ddAddPeople = async (item: IAddPeopleParams, type: CurrentType = 'add') => {
    const obj = {
        tpf: 1,
        appId: item.appId,
        corpId: item.corpId,
        curPage: 1,
        pageSize: 1000
    }
    const res = await getAllPeople(obj)
    if (res.code == 1) {
        if (type == 'add') {
            const createFn = async (data: Multiple[]) => {
                const list = {
                    examTemplateType: item.examTemplateType as string,
                    examTemplateId: item.examTemplateId as number,
                    examTitle: item.examTitle as string,
                    examUserList: data.map((list: Multiple) => ({ userId: list.emplId }))
                }
                const result = await createExam(list)
                if (result.code === 1) {
                    item.successFn()
                } else {
                    item.failFn()
                }
            }
            const ddParams = {
                corpId: item.corpId,
                usersList: res.data.resultList.map((user: IUser) => user.userId),
                successFn: createFn,
                pointPrice: item.pointPrice,
                availableBalance: item.availableBalance
            }
            ddSelectPeople(ddParams)

        } else {
            const result = await queryExamUserIds(item.id || 0)
            if (result.code == 1) {
                const updateFn = async (data: Multiple[]) => {
                    const result = await updateExam({
                        examId: item.id,
                        examUsers: data.map((list: any) => ({ userId: list.emplId })),
                    });
                    if (result.code === 1) {
                        item.successFn()
                    }
                }
                const ddParams = {
                    corpId: item.corpId,
                    usersList: res.data.resultList.map((user: IUser) => user.userId),
                    successFn: updateFn,
                    selectedUsers: result.data,
                    pointPrice: item.pointPrice,
                    availableBalance: item.availableBalance
                }
                ddSelectPeople(ddParams)
            }
        }
    }
}
// 是否是需要引导
export const getIsGuide = async (setsArr: StepsType[], type: number) => {
    const res = await isGuide({ type });
    if (res.code == 1) {
        if (!res.data) {
            await handleStep(setsArr, type)
        }
    }
}

// 钉钉环境删除域名
export const delPicDomain = (url: string) => {
    const imgLocal = url?.includes('https://static-legacy.dingtalk.com');
    return url?.replace(
        imgLocal
            ? 'https://static-legacy.dingtalk.com'
            : 'https://qzz-static.forwe.store',
        '',
    );
};
// 下载
export const downLoad = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a)
}