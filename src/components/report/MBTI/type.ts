export interface DimensionalParam {
    tag: string,
    name: string,
    data: string,
    advantage: string,
    shortcoming: string,
}


export interface MBTIResult {
    examTemplateType: string;
    examTemplateArr: string[];
    resultType: string;
    htmlDesc: {
        ability: any,
        dimensional: {
            el: DimensionalParam,
            sn: DimensionalParam,
            jp: DimensionalParam,
            tf: DimensionalParam,
        },
        scoreDetail: any,
    };
    textDesc: string[];
    user: {
        avatar: string;
        name: string;
        userId: string;
    };
    imageDesc: string[];
}

export enum MBTISimpel {
    'I' = '内向',
    'E' = '外向',
    'S' = '感觉',
    'N' = '直觉',
    'T' = '思考',
    'F' = '情感',
    'J' = '判断',
    'P' = '知觉',
}

export enum MBTIType {
    'ISTJ' = '内向+感觉+思考+判断',
    'INFJ' = '内向+直觉+情感+判断',
    'ISTP' = '内向+感觉+思考+知觉',
    'INFP' = '内向+直觉+情感+知觉',
    'ESTJ' = '外向+感觉+思考+判断',
    'ENFJ' = '外向+直觉+情感+判断',
    'ESTP' = '外向+感觉+思考+知觉',
    'ENFP' = '外向+直觉+情感+知觉',
    'ISFJ' = '内向+感觉+情感+判断',
    'INTJ' = '内向+直觉+思考+判断',
    'ISFP' = '内向+感觉+情感+知觉',
    'INTP' = '内向+直觉+思考+知觉',
    'ESFJ' = '外向+感觉+情感+判断',
    'ENTJ' = '外向+直觉+思考+判断',
    'ESFP' = '外向+感觉+情感+知觉',
    'ENTP' = '外向+直觉+思考+知觉',
}

export enum chartHeight {
    '非常高' = '100%',
    '很高' = '88%',
    '较高' = '70%',
    '高' = '65%',
    '平均' = '50%',
    '低' = '42%',
    '较低' = '30%',
    '很低' = '18%',
    '非常低' = '8%',
}

export enum TagSort {
    '非常高' = '1',
    '很高' = '2',
    '较高' = '3',
    '高' = '4',
    '平均' = '5',
    '低' = '6',
    '较低' = '7',
    '很低' = '8',
    '非常低' = '9',
}

export enum Gender {
    '男' = 1,
    '女' = 2,
    '未知' = 0
}

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