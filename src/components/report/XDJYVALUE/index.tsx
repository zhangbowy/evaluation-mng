import { Button, Divider, Modal, Tabs } from 'antd';
import React, { Fragment, memo, useEffect, } from 'react';
import './index.less';
import { getAppIdType } from '@/utils/utils'
import { MBTIResult, MBTIType, MBTISimpel, chartHeight, Gender } from './type';

const PdfDetailMBTI = (props: any) => {
    const { resultDetail, childStyle } = props;
    const appType = getAppIdType()
    const charactertype = [
        {
            startText: '外向',
            startProgress: 'E',
            endText: '内向',
            endTextProgress: 'I',
            color: '#4CB1D1',
            id: 1,
        },
        {
            startText: '实感',
            startProgress: 'S',
            endText: '直觉',
            endTextProgress: 'N',
            color: '#FEC13D',
            id: 2,
        },
        {
            startText: '思考',
            startProgress: 'T',
            endText: '情感',
            endTextProgress: 'F',
            color: '#41C98F',
            id: 3,
        },
        {
            startText: '判断',
            startProgress: 'J',
            endText: '认知',
            endTextProgress: 'P',
            color: '#F474B5',
            id: 4,
        },
    ];

    // 返回四种人格维度倾向和程度
    const isLeftProgress = (start: string, end: string, item: any): any => {
        if (resultDetail?.scoreDetail) {
            const isTrue =
                resultDetail?.scoreDetail[start]?.fullScore >
                resultDetail?.scoreDetail[end]?.fullScore;
            const value = Math.abs(resultDetail?.scoreDetail[start]?.fullScore - resultDetail?.scoreDetail[end]?.fullScore);
            if (value < 10) {
                return `轻微偏好${isTrue ? item.startText : item.endText}型-${isTrue ? item.startProgress : item.endTextProgress}`;
            } else if (value < 30 && value > 10) {
                return `中度偏好${isTrue ? item.startText : item.endText}型-${isTrue ? item.startProgress : item.endTextProgress}`
            } else {
                return `重度偏好${isTrue ? item.startText : item.endText}型-${isTrue ? item.startProgress : item.endTextProgress}`
            }
        }
    };
    useEffect(() => {
        //buildPdfFile();
        const eleDots = document.querySelectorAll('#chartX s');
        fnLineChart(eleDots);
        //    toExportPdf();
    }, [resultDetail])
    // const buildPdfFile = () => {
    //     console.log(2112);
    // }

    const fnLineChart = function (eles: any) {
        const oldEle = eles;
        [].slice.call(eles).forEach(function (ele: any, index) {
            const eleNext = oldEle[index + 1];
            if (!eleNext) { return; }
            let eleLine = ele.querySelector('i');
            if (!eleLine) {
                eleLine = document.createElement('i');
                eleLine.setAttribute('line', '');
                ele.appendChild(eleLine);
            }
            // 记录坐标
            const boundThis = ele.getBoundingClientRect();
            // 下一个点的坐标
            const boundNext = eleNext.getBoundingClientRect();
            // 计算长度和旋转角度
            const x1 = boundThis.left, y1 = boundThis.top;
            const x2 = boundNext.left, y2 = boundNext.top;
            // 长度
            const distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            // 弧度
            const radius = Math.atan((y2 - y1) / (x2 - x1));
            // 设置线条样式
            eleLine.style.width = distance + 'px';
            eleLine.style.msTransform = 'rotate(' + radius + 'rad)';
            eleLine.style.transform = 'rotate(' + radius + 'rad)';
        });
    }
    return (
        <div id="Pdf_Body" className="pdfdetail-layout-value" style={childStyle}>
            {/*封面*/}
            <div className="pdf-cover">
                <div className="logo">
                    <img
                        src={appType === '1' ? "https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" : '//qzz-static.forwe.store/evaluation-web/imgs/xdjy/xdjy_logo.png'}
                        alt=""
                    />
                    <span className="name">
                        {
                            appType === '1' ? '趣测评' : '招才选将'
                        }
                    </span>
                </div>
                <div className="main-title">
                    <p className="title">{resultDetail?.examTemplateType === 'XD-03' ? '康帕斯' : '行动教育'}</p>
                    <span className="ch-title">
                        价值观测评
                    </span>
                    <p className="sb-title">测评报告</p>
                    <p className="sb-en-title">Matching degree of personality and position</p>
                </div>
                <div className="cover-img">
                    <img src={'https://qzz-static.forwe.store/evaluation-mng/imgs/log1.png'} alt="" />
                </div>
                <div className="user-info">
                    <div>
                        <p className="title">{resultDetail?.user?.name}</p>
                        <p >{Gender[resultDetail?.user?.gender] ?? '未知'}/{resultDetail?.user?.age || 0}岁/{resultDetail?.user?.qualification}</p>
                    </div>
                    <p className="sub-job">应聘岗位：{resultDetail?.user?.job}</p>
                    <p className="sub-date">{resultDetail?.created}</p>
                </div>
                <div className="cover-bottom">
                    鑫蜂维网络科技有限公司 版权所有
                </div>
            </div>
            {/* 分页 */}
            <div className="page-box four_mbti">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className='page-dash-line'></div>
                <div className="page-title mg-b-24">
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                    <span>价值观</span>
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                </div>
                {
                    resultDetail?.examTemplateType !== 'XD-03' ?
                        <table className='page-table'>
                            <thead>
                                <tr>
                                    <td className='page-table-header-odd'>诚信为本</td>
                                    <td className='page-table-header-even'>行为准则</td>
                                    <td className='page-table-header-odd'>实效第一</td>
                                    <td className='page-table-header-even'>行为准则</td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td rowSpan={3} className='page-table-body-title'>绝不虚假</td>
                                    <td>1、不说假大空话</td>
                                    <td rowSpan={3} className='page-table-body-title'>简单直接</td>
                                    <td>1、复杂事情简单化</td>
                                </tr>
                                <tr>
                                    <td>2、说话做事有依据</td>
                                    <td>2、做事抓重点</td>
                                </tr>
                                <tr>
                                    <td>3、为人正直</td>
                                    <td>3、凡事成果量化，设定期限</td>
                                </tr>

                                <tr>
                                    <td rowSpan={4} className='page-table-body-title'>不找借口</td>
                                    <td>1、100%担当责任</td>
                                    <td rowSpan={4} className='page-table-body-title'>精益求精</td>
                                    <td>1、把一件事情做到第一</td>
                                </tr>
                                <tr>
                                    <td>2、内向思维</td>
                                    <td>2、高标准，严要求</td>
                                </tr>
                                <tr>
                                    <td>3、不抱怨</td>
                                    <td>3、持续反省和改进</td>
                                </tr>
                                <tr>
                                    <td>4、对工作成果负责</td>
                                    <td>4、咬定目标，决不放弃</td>
                                </tr>

                                <tr>
                                    <td rowSpan={3} className='page-table-body-title'>有责任心</td>
                                    <td>1、要求别人自己先做到</td>
                                    <td rowSpan={3} className='page-table-body-title'>持续创新</td>
                                    <td>1、每天对用户提供10倍以上价值的产品和服务</td>
                                </tr>
                                <tr>
                                    <td>2、第一次把事情做好</td>
                                    <td>2、每周都有5小时以上的专题学习</td>
                                </tr>
                                <tr>
                                    <td>3、有主人翁意识</td>
                                    <td>3、每月至少一次主动变革，带来绩效突破性地提升</td>
                                </tr>

                                <tr>
                                    <td rowSpan={3} className='page-table-body-title'>坚守承诺</td>
                                    <td>1、答应别人的事情一定要做到</td>
                                    <td rowSpan={3} className='page-table-body-title'>超出期望</td>
                                    <td>1、每月保证用户成果</td>
                                </tr>
                                <tr>
                                    <td>2、全力以赴达成既定目标</td>
                                    <td>2、给用户惊喜感</td>
                                </tr>
                                <tr>
                                    <td>3、有敢于承担后果的勇气</td>
                                    <td>3、让用户重复使用</td>
                                </tr>

                                <tr>
                                    <td rowSpan={3} className='page-table-body-title'>值得信赖</td>
                                    <td>1、做事独挡一面</td>
                                    <td rowSpan={3} className='page-table-body-title'>成为专家</td>
                                    <td>1、一万小时的训练</td>
                                </tr>
                                <tr>
                                    <td>2、严于律己，尊重他人</td>
                                    <td>2、用户绝口称赞</td>
                                </tr>
                                <tr>
                                    <td>3、利他爱人，凡事感恩</td>
                                    <td>3、对国家和社会有突出的贡献</td>
                                </tr>
                            </tbody>
                        </table>
                        :
                        <table className='page-table-kps'>
                            <tbody>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={13}>成就客户</td>
                                    <td className='kps-center' rowSpan={3}>坚守承诺</td>
                                    <td>1、答应别人的事情一定要做到</td>
                                </tr>
                                <tr>
                                    <td>2、全力以赴达成既定目标</td>
                                </tr>
                                <tr>
                                    <td>3、有敢于承担后果的勇气</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={4}>不找借口</td>
                                    <td>1、100%担当责任</td>
                                </tr>
                                <tr>
                                    <td>2、内向思维</td>
                                </tr>
                                <tr>
                                    <td>3、不抱怨</td>
                                </tr>
                                <tr>
                                    <td>4、对工作成果负责</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>值得信赖</td>
                                    <td>1、做事独当一面</td>
                                </tr>
                                <tr>
                                    <td>2、严于律己</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={4}>创造价值</td>
                                    <td>1、遇到困难不言弃</td>
                                </tr>
                                <tr>
                                    <td>2、能够给客户创造价值</td>
                                </tr>
                                <tr>
                                    <td>3、每天对用户提供10倍以上价值的产品和服务</td>
                                </tr>
                                <tr>
                                    <td>4、用户绝口称赞（这个与给用户惊喜感是一个意思）</td>
                                </tr>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={8}>创新</td>
                                    <td className='kps-center' >主动学习</td>
                                    <td>1、每周都有3小时以上的学习时间</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>喜欢琢磨</td>
                                    <td>1、对事情刨根问底，喜欢琢磨</td>
                                </tr>
                                <tr>
                                    <td>2、持续反省和改进</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={3}>超出期望</td>
                                    <td>1、每月保证用户成果</td>
                                </tr>
                                <tr>
                                    <td>2、给用户惊喜感</td>
                                </tr>
                                <tr>
                                    <td>3、让用户重复使用</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>突破自我</td>
                                    <td>1、每月至少一次主动创新，带来绩效突破性地提升</td>
                                </tr>
                                <tr>
                                    <td>2、咬定目标，决不放弃</td>
                                </tr>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={2}>拥抱变化</td>
                                    <td className='kps-center'>接受变化</td>
                                    <td>1、喜欢变化和挑战</td>
                                </tr>
                                <tr>
                                    <td className='kps-center'>快速适应变化</td>
                                    <td>1、适应并拿到结果</td>
                                </tr>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={5}>向前一步</td>
                                    <td className='kps-center'>空杯心态</td>
                                    <td>1、做事保持谦虚，能够持续学习</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>强执行力</td>
                                    <td>1、把一件事情做到第一</td>
                                </tr>
                                <tr>
                                    <td>2、把事情做到极致</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>协作</td>
                                    <td>1、助人为乐</td>
                                </tr>
                                <tr>
                                    <td>2、协作共赢</td>
                                </tr>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={6}>感恩</td>
                                    <td className='kps-center'>乐于分享</td>
                                    <td>1、积极主动分享</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={3}>有责任心</td>
                                    <td>1、要求别人自己先做到</td>
                                </tr>
                                <tr>
                                    <td>2、第一次就把事情做好</td>
                                </tr>
                                <tr>
                                    <td>3、有主人翁意识</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>利他/正能量</td>
                                    <td>1、利他爱人</td>
                                </tr>
                                <tr>
                                    <td>2、尊重他人</td>
                                </tr>
                                <tr>
                                    <td className='kps-center bg-color' rowSpan={5}>坚信</td>
                                    <td className='kps-center' rowSpan={3}>诚信（不虚假）</td>
                                    <td>1、绝不虚假</td>
                                </tr>
                                <tr>
                                    <td>2、为人正直</td>
                                </tr>
                                <tr>
                                    <td>3、说话做事有依据</td>
                                </tr>
                                <tr>
                                    <td className='kps-center' rowSpan={2}>毅力</td>
                                    <td>1、自驱</td>
                                </tr>
                                <tr>
                                    <td>2、一万小时的训练</td>
                                </tr>
                            </tbody>
                        </table>
                }


                <div className='page-box-score'>
                    <p>您的测评得分是</p>
                    <div>{resultDetail?.scoreDetail?.[resultDetail?.examTemplateType === 'XD-03' ? '价值观' : '德']?.score}分</div>
                </div>
            </div>
            {/* 分页 */}
            <div className="page-box four_mbti">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className='page-dash-line'></div>
                <div className='score-wrapper'>
                    {
                        resultDetail?.scoreDetail?.[resultDetail?.examTemplateType === 'XD-03' ? '价值观' : '德']?.subResultScores.map((res: any) => (
                            <div key={res.resultType} className='score-main'>
                                <div>{res.resultType}得分：{res.score}<span>/{res.totalScore}</span></div>
                                <ul>
                                    {
                                        res.subResultScores.map((item: any) => (
                                            <li key={item.resultType}>
                                                <p>【{item.resultType}】</p>
                                                <div>
                                                    <div className='score-progress' style={{ '--progress': (630 / item.totalScore * item.score) + 'px' } as any}>
                                                        <span className='score-triangle'></span>
                                                    </div>
                                                    <div className='score-numerical'>
                                                        <span className='score-cur'>{item.score}</span>
                                                        <span className='score-total'>/ {item.totalScore}</span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box four_mbti">
                <div className='page-dash-line'></div>
                <div className="page-title">
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                    <span>职业性格</span>
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                </div>
                <div className="tag-line">
                    <div className="tag-apply-chart">
                        <div className="tag-chart" id="chartX">
                            <div className="result-xy">
                                <div className="result-bg" data-month="忠诚度">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['忠诚度']]}` }}
                                    ><s title="8.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="责任心">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['责任心']]}` }}
                                    ><s title="2.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="创新力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['创新力']]}` }}
                                    ><s title="3.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="耐心程度">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['耐心程度']]}` }}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="洞察力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['洞察力']]}` }}
                                    ><s title="5.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="分析能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['分析能力']]}` }}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="适应能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['适应能力']]}` }}
                                    ><s title="7.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="抗压能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['抗压能力']]}` }}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="沟通能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['沟通能力']]}` }}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="判断能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability?.['判断能力']]}` }}
                                    ><s title="5.4"></s></span>
                                </div>
                            </div>
                        </div>
                        <div className="left-color">
                            <div className="line ability-color-1"></div>
                            <div className="line ability-color-2"></div>
                            <div className="line ability-color-3"></div>
                            <div className="line ability-color-4"></div>
                            <div className="line ability-color-5"></div>
                            <div className="line ability-color-6"></div>
                            <div className="line ability-color-7"></div>
                            <div className="line ability-color-8"></div>
                            <div className="line ability-color-9"></div>
                        </div>
                        <div className="left-arrow">
                            <img src={`https://qzz-static.forwe.store/evaluation-mng/imgs/log4.png`} />
                            <img src={`https://qzz-static.forwe.store/evaluation-mng/imgs/log3.png`} />
                        </div>
                    </div>
                </div>
                <div className="tag-sort">
                    {/* <div className="small-title">
                        <p className="line"></p>
                        <p className="title">您的能力标签排序</p>
                        <p className="line"></p>
                    </div> */}
                    <div className="detail">
                        <div className="top">
                            {
                                resultDetail?.htmlDesc?.abilityList?.map((it: any, index: number) => (
                                    <Fragment key={it.id}>
                                        <div className={`tag ability-color-${it.sort}`}>{it.name}</div>
                                        {
                                            (index + 1) !== resultDetail?.htmlDesc?.abilityList.length &&
                                            <p>{it.sort === resultDetail?.htmlDesc?.abilityList[index + 1].sort ? '=' : '>'}</p>
                                        }
                                    </Fragment>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box four_mbti">
                {/* <div className="page-top mg-b">
                    <div className="logo">
                        <img src="https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" alt=""/>
                        <span className="name">趣测评</span>
                    </div>
                    <div className="title">职业性格特质测评-sample</div>
                </div> */}
                <div className='page-dash-line'></div>
                <div className="page-title">
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                    <span>指导建议</span>
                    <img src="https://qzz-static.forwe.store/evaluation-mng/imgs/log2.png" alt="" />
                </div>
                <div className="classify-detail m-t-34">
                    <p className="abstract">
                        现在你对自己的人格类型和动力已经有了一个比较清楚的了解，但这还不够。“如何通过这些信息使你在这份工作上取得更大的成功”，这是关键所在。运用你的能力非常容易，你成功的秘诀在于：
                    </p>
                    <div className="detail m-b-34">
                        {
                            resultDetail?.htmlDesc?.personality?.proposal?.['成功的秘诀'].map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
                    </div>
                    <p className="abstract">
                        个人发展建议是我们咨询师多年测评职业咨询和职业生涯规划的心得体会和经验总结，我们意识到以下的建议中有很多是难以完全照办的，但只要你花时间认真思考，一定会对你有极大的帮助和改变。发展建议：
                    </p>
                    <div className="detail m-b-77">
                        {
                            resultDetail?.htmlDesc?.personality?.proposal?.['发展建议'].map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
export default PdfDetailMBTI;