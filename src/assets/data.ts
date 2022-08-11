import { RecruitStatus } from "@/page/evaluation/recruitEvaluation/type";

export const abilityList = [{
    id: 1,
    name: '分析能力'
}, {
    id: 2,
    name: '创新力'
}, {
    id: 3,
    name: '判断能力'
}, {
    id: 4,
    name: '洞察力'
}, {
    id: 5,
    name: '忠诚度'
}, {
    id: 6,
    name: '抗压能力'
}, {
    id: 7,
    name: '沟通能力'
}, {
    id: 8,
    name: '耐心程度'
}, {
    id: 9,
    name: '责任心'
}, {
    id: 10,
    name: '适应能力'
}];

export const recruitStatusList: RecruitStatus[] = [
    {
        label: '待答题',
        value: 0
    },
    {
        label: '进行中',
        value: 1
    },
    {
        label: '已完成',
        value: 10
    }
];