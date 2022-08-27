// 完成情况select
const doneCondition = [
    {
        name: '完成',
        value: '10',
    },
    {
        name: '未完成',
        value: '0, 1, 2, 3',
    },
]

const statusText = [
    {
        text: '已完成',
        color: '#00CC66',
        key: 'finishNum'
    },
    {
        text: '未完成',
        color: '#8F969E',
        key: 'finishNum'
    },
    {
        text: '测评中',
        color: '#2B85FF',
        key: 'finishNum'
    },
]
const tagsColor: { [key: string]: { color: string, bg: string } } = {
    '0': { color: '#5B8FF9', bg: '#EEF3FE' },
    '1': { color: '#5AD8A6', bg: '#EEFBF6' },
    '2': { color: '#F6BD16', bg: '#FEF8E7' },
    '3': { color: '#E8684A', bg: '#FCEFEC' },
    '4': { color: '#6DC8EC', bg: '#F0F9FD' },
    '5': { color: '#9270CA', bg: '#F4F0F9' },
    '6': { color: '#FF9D4D', bg: '#FFF5ED' },
    '7': { color: '#269A99', bg: '#E9F4F4' },
    '8': { color: '#FF99C3', bg: '#FFF4F9' },
    '9': { color: '#5D7092', bg: '#EEF0F4' },
}
const abilityText = [
    '决策能力',
    '协作能力',
    '应变能力',
    '沟通能力',
    '分析能力',
    '创新能力'
]

export {
    doneCondition,
    statusText,
    tagsColor,
    abilityText
}  