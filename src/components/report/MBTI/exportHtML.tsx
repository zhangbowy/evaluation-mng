import { Button, Divider, Modal, Tabs } from 'antd';
import React, { forwardRef, Fragment, memo, useEffect, useImperativeHandle } from 'react';
import './export.less';
import print from "@/utils/print";
import { MBTIResult, MBTIType, MBTISimpel, chartHeight, Gender } from './type';

const ExportPdfDetailMBTIHTML = memo(forwardRef((props: any, ref) => {
    const { resultDetail, childStyle } = props;
    useImperativeHandle(ref, () => {
        return {
            exportPDF: toExportPdf,
        };
    });
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
        const eleDots = document.querySelectorAll('#chartS s');
        fnLineChart(eleDots);
        //    toExportPdf();
    }, [resultDetail])
    // const buildPdfFile = () => {
    //     console.log(2112);
    // }

    const fnLineChart = function (eles: any) {
        const oldEle = eles;
        [].slice.call(eles).forEach(function (ele: any, index) {
            var eleNext = oldEle[index + 1];
            if (!eleNext) { return; }
            var eleLine = ele.querySelector('i');
            if (!eleLine) {
                eleLine = document.createElement('i');
                eleLine.setAttribute('line', '');
                ele.appendChild(eleLine);
            }
            // 记录坐标
            var boundThis = ele.getBoundingClientRect();
            // 下一个点的坐标
            var boundNext = eleNext.getBoundingClientRect();
            // 计算长度和旋转角度
            var x1 = boundThis.left, y1 = boundThis.top;
            var x2 = boundNext.left, y2 = boundNext.top;
            // 长度
            var distance = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            // 弧度
            var radius = Math.atan((y2 - y1) / (x2 - x1));
            // 设置线条样式
            eleLine.style.width = distance + 'px';
            eleLine.style.msTransform = 'rotate(' + radius + 'rad)';
            eleLine.style.transform = 'rotate(' + radius + 'rad)';
        });
    }
    const toExportPdf = (callback: Function) => {
        print(
            "Pdf_Body",
            "MBTI性格与岗位匹配度",
            () => {

            },
            () => {
                callback && callback();
                // 查看详情按钮显示
                // const doms = document.getElementsByClassName("operaction-action");
                // doms.forEach((dom) => {
                //     dom.style.opacity = 1;
                // });
            }
        );
    };
    return (
        <div id="Pdf_Body" className="pdfdetail-layout-export" style={childStyle}>
            {/*封面*/}
            <div className="pdf-cover">
                <div className="logo"></div>
                <div className="main-title">
                    <p className="title">MBTI</p>
                    <span className="ch-title">
                        性格与岗位匹配度
                    </span>
                    <p className="sb-title">测评报告</p>
                    <p className="sb-en-title">Matching degree of personality and position</p>
                </div>
                <div className="cover-img">
                    <img src={'//qzz-static.forwe.store/public-assets/cover-qcp.png'} alt="" />
                </div>
                <div className="user-info">
                    <p className="title">{resultDetail?.user?.name}</p>
                    <p className="sub-title">{resultDetail?.user && Gender[resultDetail?.user?.gender]}</p>
                    <p className="sub-title">{resultDetail?.created}</p>
                </div>
                <div className="cover-bottom">
                    鑫蜂维网络科技有限公司 版权所有
                </div>
            </div>
            {/* 分页 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className="page-title mg-b">
                    一、报告导语
                </div>
                <article className="article-text">
                    <h3 className="article-h3">测评背景简介</h3>
                    <p className="article-cont">【导语】“我性格内向/外向，适合什么专业？”“我的性格将来适合从事什么职业？”“以我的个性从事什么行业好？”“我这样性格的人选什么专业好？”这些是职业人或学生都有的困惑——性格因素和专业选择之间到底有什么样的关联呢？</p>
                </article>
                <Divider />
                <article className="article-hybrid">
                    <div className="text">
                        1942年，瑞士精神分析学家荣格第一次提出人格分类的概念。他认为感知和判断是大脑的两大基本功能。不同的人，感知倾向不同——有些人更侧重直觉，有些更侧重感觉。同样，不同的人判断倾向也不同——有些更倾向理性分析得出结论，有些更侧重情感，更为感性。同时，这两大基本功能又受到精力来源不同（内向或外向）的影响。以荣格的人格分类理论为基础，美国心理学家Katherine Cook Briggs(1875-1968)和Isabel Briggs Myers母女提出了影响大脑做出决定的第四因素，行为和生活方式；并综合荣格的人格分类学说形成MBTI人格模型。
                    </div>
                    <div className="picture">
                        <img src={`//qzz-static.forwe.store/public-assets/measurement-type.png?x-oss-process=image/resize,m_fill,w_282,h_254`} alt="" />
                    </div>
                </article>
                <article className="article-text">
                    <p className="article-cont">
                        【导语】“我性格内向/外向，适合什么专业？”“我的性格将来适合从事什么职业？”“以我的个性从事什么行业好？”“我这样性格的人选什么专业好？”这些是职业人或学生都有的困惑——性格因素和专业选择之间到底有什么样的关联呢？
                    </p>
                </article>
                <article className="article-box">
                    <div className="item-box">
                        <span className="left">能量来源（即我们与世界相互作用的方式）</span>
                        <span className="right">外向(E)——内向(I)</span>
                    </div>
                    <div className="item-box">
                        <span className="left">信息接收（即我们获取信息的主要方式）</span>
                        <span className="right">感觉(S)——直觉(N)</span>
                    </div>
                    <div className="item-box">
                        <span className="left">信息处理（即我们的决策方式）</span>
                        <span className="right">思考(T)——情感(F)</span>
                    </div>
                    <div className="item-box">
                        <span className="left">行为方式（即我们的做事方式）</span>
                        <span className="right">判断(J)——知觉(P)</span>
                    </div>
                </article>
            </div>
            {/* 分页 */}
            <div className="page-box">
                <div className="page-top mg-b-20">
                    <div className="logo"></div>
                </div>
                <article className="article-text">
                    <p className="article-cont">
                        在以上四个维度上，每个人都会有自己天生就具有的倾向性，也就是说，处在两个方向分界点的这边或那边，我们称之为“偏好”。例如，如果你落在外向的那边，称为“你偏好外向”；如果你落在内向的那边，称为“你偏好内向”。在现实生活中，每个维度的两个方面你都会用到，只是其中的一个方面你用的更频繁、更舒适，即为你在这个维度上的偏好。将人们在四个维度上的偏好加以组合，就形成了16种人格类型（详见下表），它反映了人们在一系列心理过程和行为方式上的可能特点。
                    </p>
                </article>
            </div>
            {/* 分页 */}
            <div className="page-box article-table">
                <div className="article-hd">
                    <div className="hd">人格类型名称</div>
                    <div className="hd">英文代码</div>
                    <div className="hd">人格类型名称</div>
                    <div className="hd">英文代码</div>
                </div>
                <div className="article-bd">
                    <div className="item">
                        <div className="td">内向+感觉+思考+判断</div>
                        <div className="td">ISTJ</div>
                        <div className="td">内向+感觉+情感+判断</div>
                        <div className="td">ISFJ</div>
                    </div>
                    <div className="item">
                        <div className="td">内向+直觉+情感+判断</div>
                        <div className="td">INFJ</div>
                        <div className="td">内向+直觉+思考+判断</div>
                        <div className="td">INTJ</div>
                    </div>
                    <div className="item">
                        <div className="td">内向+感觉+思考+知觉</div>
                        <div className="td">ISTP</div>
                        <div className="td">内向+感觉+情感+知觉</div>
                        <div className="td">ISFP</div>
                    </div>
                    <div className="item">
                        <div className="td">内向+直觉+情感+知觉</div>
                        <div className="td">INFP</div>
                        <div className="td">内向+直觉+思考+知觉</div>
                        <div className="td">INTP</div>
                    </div>
                    <div className="item">
                        <div className="td">外向+感觉+思考+判断</div>
                        <div className="td">ESTJ</div>
                        <div className="td">外向+感觉+情感+判断</div>
                        <div className="td">ESFJ</div>
                    </div>
                    <div className="item">
                        <div className="td">外向+直觉+情感+判断</div>
                        <div className="td">ENFJ</div>
                        <div className="td">外向+直觉+思考+判断</div>
                        <div className="td">ENTJ</div>
                    </div>
                    <div className="item">
                        <div className="td">外向+感觉+思考+知觉</div>
                        <div className="td">ESTP</div>
                        <div className="td">外向+感觉+情感+知觉</div>
                        <div className="td">ESFP</div>
                    </div>
                    <div className="item">
                        <div className="td">外向+直觉+情感+知觉</div>
                        <div className="td">ENFP</div>
                        <div className="td">外向+直觉+思考+知觉</div>
                        <div className="td">ENTP</div>
                    </div>
                </div>
            </div>
            {/* 分页 */}
            <div className="page-box">
                <article className="article-text no-indent">
                    <h3 className="article-h3">报告阅读建议</h3>
                    <Divider />
                    <p className="article-cont">1.本测评所有题项采用0、1计分，报告基于您的在线作答，按照一定的计分原则得出您在四种人格维度上的倾向偏好和具体的人格类型，并据此给出专业选择和工作发展方面的分析和建议； </p>
                    <p className="article-cont">2.报告展示的是你的性格偏好，而不是你的知识、经验、技巧或能力。报告对您的人格特点进行详细分析，是为了帮助你拓展思路，接受更多的可能性，而不是限制你的选择；</p>
                    <p className="article-cont">3.报告结果中的性格类型没有“好”与“坏”之分，但不同特点对于不同的职业和专业存在“适合”与“不适合”的区别，因此会表现出具体条件下的优势和劣势。人格特点由遗传、成长环境和生活经历决定，不要一味地想象去改变它。但是我们可以在了解的基础上对某些倾向进行一定的补充和平衡，有效利用，扬长避短，从而更好的发挥个人的潜力；</p>
                    <p className="article-cont">4.报告中推荐的职业和专业是针对某一人格类型的人群的，但每个人的家庭背景、学习情况都存在特殊性，可能并不是所有的职业或专业都是合适你，需要具体结合个人的其他条件进行选择；</p>
                    <p className="article-cont">5.对于初次阅读此类报告的人员，需在专业人士的指导下阅读，或请专业人士解释此报告。</p>
                </article>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-title mg-b">
                    二、测评结果分析
                </div>
            </div>
            {/* 分页结束 */}
            <div className="result-box page-box">
                <div className="result-box-image">
                    <img src={`//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_bg.png`} alt="背景图" />
                </div>
                <div className="result-box-content">
                    <div className="left">
                        <div className="round">
                            <p className="m-title">{resultDetail.resultType}</p>
                            <p className="s-title">
                                {resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[0]]}+
                                {resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[1]]}
                            </p>
                            <p className="s-title">
                                {resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[2]]}+
                                {resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[3]]}
                            </p>
                        </div>
                        <div className="result-info">人群中大约有 {resultDetail?.textDesc?.[0]}% 的人和你一样</div>
                    </div>
                    <div className="right">
                        <div className="result-list">
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">外向(E):{resultDetail?.scoreDetail?.E?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-1"
                                            style={{ width: `${resultDetail?.scoreDetail?.E?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">内向(I):{resultDetail?.scoreDetail?.I?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-1"
                                            style={{ width: `${resultDetail?.scoreDetail?.I?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">感觉(S):{resultDetail?.scoreDetail?.S?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-2"
                                            style={{ width: `${resultDetail?.scoreDetail?.S?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">直觉(N):{resultDetail?.scoreDetail?.N?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-2"
                                            style={{ width: `${resultDetail?.scoreDetail?.N?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">思考(T):{resultDetail?.scoreDetail?.T.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-3"
                                            style={{ width: `${resultDetail?.scoreDetail?.T?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">情感(F):{resultDetail?.scoreDetail?.F?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-3"
                                            style={{ width: `${resultDetail?.scoreDetail?.F?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">判断(J):{resultDetail?.scoreDetail?.J?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-4"
                                            style={{ width: `${resultDetail?.scoreDetail?.J?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">知觉(P):{resultDetail?.scoreDetail?.P?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-4"
                                            style={{ width: `${resultDetail?.scoreDetail?.P?.fullScore}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="result-detail page-box">
                <div className="result-detail-item">
                    <p className="title">能量来源（{resultDetail?.examTemplateArr?.[0]}:{resultDetail?.examTemplateArr?.[0] && (MBTISimpel as any)[resultDetail?.examTemplateArr?.[0]]}）</p>
                    <div className="result-detail-box">
                        <p><em>外向(E):{resultDetail?.scoreDetail?.E?.score}</em>他人激励型，关注外部世界的人和事，乐意与人交往。</p>
                        <p><em>内向(I):{resultDetail?.scoreDetail?.I?.score}</em>自我或记忆激励型，关注思想、记忆、情感，倾向于自省。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="result-detail page-box">
                <div className="result-detail-item">
                    <p className="title">信息接收（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[1]}:{resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[1]]}）</p>
                    <div className="result-detail-box">
                        <p><em>感觉(S):{resultDetail?.scoreDetail?.S.score}</em>倾向于当前发生的事，关注由五官感觉获取的具体信息。</p>
                        <p><em>直觉(N):{resultDetail?.scoreDetail?.N.score}</em>倾向于未来可能的和潜在的事，关注事物的整体和发展变化趋势。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="result-detail page-box">
                <div className="result-detail-item">
                    <p className="title">信息处理（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[2]}:{resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[2]]}）</p>
                    <div className="result-detail-box">
                        <p><em>思考(T):{resultDetail?.scoreDetail?.T.score}</em>重视事物之间的逻辑关系，喜欢通过客观分析作决定评价、解决问题。</p>
                        <p><em>情感(F):{resultDetail?.scoreDetail?.F.score}</em>以自己和他人的感受为重，将自己的主观价值观作为判定标准。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="result-detail page-box">
                <div className="result-detail-item">
                    <p className="title">行动方式（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[3]}:{resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[3]]}）</p>
                    <div className="result-detail-box">
                        <p><em>判断(J):{resultDetail?.scoreDetail?.J.score}</em>喜欢根据信息来做判断、计划和决定，愿意进行管理和控制，希望生活井然有序</p>
                        <p><em>知觉(P):{resultDetail?.scoreDetail?.P.score}</em>喜欢以自己的理解和信息做决策，灵活、试图去理解、适应环境,倾向于留有余地，喜欢宽松自由的生活方式。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="result-analyse">
                    <div className="left">
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.E?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.S?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.T?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.J?.fullScore}%` }}></div>
                        <div className="bottom">
                            <div className="percent">
                                <span>100%</span>
                                <span>75%</span>
                                <span>50%</span>
                                <span>25%</span>
                                <span>0%</span>
                            </div>
                        </div>
                    </div>
                    <div className="right">
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.I?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.N?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.F?.fullScore}%` }}></div>
                        <div className="result-analyse-item" style={{ width: `${resultDetail?.scoreDetail?.P?.fullScore}%` }}></div>
                        <div className="bottom">
                            <div className="percent">
                                <span></span>
                                <span>25%</span>
                                <span>50%</span>
                                <span>75%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="tendency-degree">
                    <div className="small-title">
                        <p className="line"></p>
                        <p className="title">您在四种人格维度上的倾向和程度</p>
                        <p className="line"></p>
                    </div>
                    <div className="tendency-degree-list">
                        {
                            charactertype.map((it: any) => (
                                <div className="item m-r-49" key={it.id}>
                                    <em>{isLeftProgress(it.startProgress, it.endTextProgress, it)}</em>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="result-tendency-degree m-b-77">
                    <div className="small-title">
                        <p className="line"></p>
                        <p className="title">您在四种人格维度上的倾向和程度</p>
                        <p className="line"></p>
                    </div>
                    <div className="detail">
                        <em>{resultDetail.resultType}({resultDetail?.resultType && (MBTIType as any)[resultDetail?.resultType]})</em>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="tag-line">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>能力标签分析</p>
                    </div>
                    <div className="tag-apply-chart">
                        <div className="tag-chart" id="chartS">
                            <div className="result-xy">
                                <div className="result-bg" data-month="忠诚度">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['忠诚度']]}` }}
                                    ><s title="8.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="责任心">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['责任心']]}` }}
                                    ><s title="2.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="创新力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['创新力']]}` }}
                                    ><s title="3.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="耐心程度">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['耐心程度']]}` }}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="洞察力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['洞察力']]}` }}
                                    ><s title="5.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="分析能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['分析能力']]}` }}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="适应能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['适应能力']]}` }}
                                    ><s title="7.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="抗压能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['抗压能力']]}` }}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="沟通能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['沟通能力']]}` }}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="判断能力">
                                    <span className="result-bar"
                                        style={{ height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['判断能力']]}` }}
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
                            <img src={`//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_up.png?x-oss-process=image/resize,m_fill,w_21,h_41`} />
                            <img src={`//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_down.png?x-oss-process=image/resize,m_fill,w_21,h_41`} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-box">
                <div className="tag-sort">
                    <div className="small-title">
                        <p className="line"></p>
                        <p className="title">您的能力标签排序</p>
                        <p className="line"></p>
                    </div>
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
            <div className="page-box">
                <div className="page-title">
                    三、四维人格倾向解读
                </div>
                <div className="personality-title">
                    <p className="diamond"></p>
                    <p className="title">您的四维人格倾向（偏好）详解如下</p>
                </div>
                <div className="personality-line"></div>
            </div>
            {/* 分页结束 */}
            <div className="personality-detail page-box">
                <div className="header">
                    J-P维度：知觉
                </div>
                <div className="content">
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">主要特点</p>
                        </div>
                        <div className="item-content">
                            <div className="left">
                                倾向于根据自己的理解和信息作决策，重视过程，随信息的变化不断调整目标，
                                保留事情有可能的余地。喜欢有多种选择，寻求不固定体验和生活方式，易于
                                作新的选择和最后一刻的改变，喜欢开始某一项目但往往不能善始善终，喜欢
                                将事情留到最后做，容易适应，较灵活。
                            </div>
                            <div className="right">
                                <img src={`${resultDetail?.htmlDesc?.dimensional.jp.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">优点</p>
                        </div>
                        <div className="item-content">
                            易于协调、可由各角度欣赏事物、具弹性、开放的态度、依据可靠的资料做决定、不任意批评。
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">缺点</p>
                        </div>
                        <div className="item-content">
                            犹豫不决、散漫无计划、不能有效的控制情况、易被分心、不易照计划完事。
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="personality-detail page-box">
                <div className="header">
                    J-P维度：知觉
                </div>
                <div className="content">
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">主要特点</p>
                        </div>
                        <div className="item-content">
                            <div className="left">
                                倾向于根据自己的理解和信息作决策，重视过程，随信息的变化不断调整目标，
                                保留事情有可能的余地。喜欢有多种选择，寻求不固定体验和生活方式，易于
                                作新的选择和最后一刻的改变，喜欢开始某一项目但往往不能善始善终，喜欢
                                将事情留到最后做，容易适应，较灵活。
                            </div>
                            <div className="right">
                                <img src={`${resultDetail?.htmlDesc?.dimensional.jp.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">优点</p>
                        </div>
                        <div className="item-content">
                            易于协调、可由各角度欣赏事物、具弹性、开放的态度、依据可靠的资料做决定、不任意批评。
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">缺点</p>
                        </div>
                        <div className="item-content">
                            犹豫不决、散漫无计划、不能有效的控制情况、易被分心、不易照计划完事。
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="personality-detail page-box">
                <div className="header">
                    J-P维度：知觉
                </div>
                <div className="content">
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">主要特点</p>
                        </div>
                        <div className="item-content">
                            <div className="left">
                                倾向于根据自己的理解和信息作决策，重视过程，随信息的变化不断调整目标，
                                保留事情有可能的余地。喜欢有多种选择，寻求不固定体验和生活方式，易于
                                作新的选择和最后一刻的改变，喜欢开始某一项目但往往不能善始善终，喜欢
                                将事情留到最后做，容易适应，较灵活。
                            </div>
                            <div className="right">
                                <img src={`${resultDetail?.htmlDesc?.dimensional.jp.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">优点</p>
                        </div>
                        <div className="item-content">
                            易于协调、可由各角度欣赏事物、具弹性、开放的态度、依据可靠的资料做决定、不任意批评。
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">缺点</p>
                        </div>
                        <div className="item-content">
                            犹豫不决、散漫无计划、不能有效的控制情况、易被分心、不易照计划完事。
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="personality-detail page-box">
                <div className="header">
                    J-P维度：知觉
                </div>
                <div className="content">
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">主要特点</p>
                        </div>
                        <div className="item-content">
                            <div className="left">
                                倾向于根据自己的理解和信息作决策，重视过程，随信息的变化不断调整目标，
                                保留事情有可能的余地。喜欢有多种选择，寻求不固定体验和生活方式，易于
                                作新的选择和最后一刻的改变，喜欢开始某一项目但往往不能善始善终，喜欢
                                将事情留到最后做，容易适应，较灵活。
                            </div>
                            <div className="right">
                                <img src={`${resultDetail?.htmlDesc?.dimensional.jp.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                            </div>
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">优点</p>
                        </div>
                        <div className="item-content">
                            易于协调、可由各角度欣赏事物、具弹性、开放的态度、依据可靠的资料做决定、不任意批评。
                        </div>
                    </div>
                    <div className="item">
                        <div className="item-header">
                            <p className="diamond"></p>
                            <p className="title">缺点</p>
                        </div>
                        <div className="item-content">
                            犹豫不决、散漫无计划、不能有效的控制情况、易被分心、不易照计划完事。
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-title">
                    四、MBTI人格类型解读
                </div>
                <div className="classify-explain">
                    <span>您的人格类型是：</span>
                    <span className="title">{resultDetail.resultType}(内向+直觉+情感+知觉) </span>
                    <span>，详解如下：</span>
                </div>
                <div className="personality-line"></div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>1、典型特征画像</p>
                    </div>
                    <div className="content">
                        <div className="left">
                            <div className="list">
                                <div className="circle"></div>
                                <p>理想主义者；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>很关心理想，甚至愿意未知牺牲生命；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>容易觉得别人不了解他而感到疏离；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>容易与外表安静的人倾谈，较怕羞；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>不用逻辑，会通过感性来获得知识；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>很容易了解象征的意义；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>不喜欢「假设」，只喜欢真实；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>不想和别人发生冲突；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>很喜欢良善、积极的东西；</p>
                            </div>
                            <div className="list">
                                <div className="circle"></div>
                                <p>不喜欢按规律做事，喜欢新的思想。</p>
                            </div>
                        </div>
                        <div className="right">
                            <p className="production">{resultDetail?.htmlDesc?.personality?.portraitPhoto?.desc}</p>
                            <div className="image">
                                <img src={`${resultDetail?.htmlDesc?.personality?.portraitPhoto?.jpg}?x-oss-process=image/resize,m_fill,w_119,h_180`} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="page-box">
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>2、人格特征</p>
                    </div>
                    <div className="detail">
                        INFP把内在的和谐视为高于其他一切。他们敏感、理想化、忠诚，对于个人价值具有一种强烈的荣誉感，个人信仰坚定，
                        有为自认为有价值的事业献身的精神。
                        INFP型的人对于已知事物之外的可能性很感兴趣，精力集中于他们的梦想和想象。他们思维开阔、有好奇心和洞察力，
                        常常具有出色的长远目光。在日常事务中，他们通常灵活多变、具有忍耐力和适应性。但是他们非常坚定地对待内心的忠
                        诚，为自己设立了事实上几乎是不可能的标准。
                        INFP型的人具有许多使他们忙碌的理想和忠诚。他们十分坚定地完成自己所选择的事情，他们往往承担得太多，但不管
                        怎样总要完成每件事。
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>3、可能存在的盲点</p>
                    </div>
                    <div
                        className="detail"
                    >
                        由于不如ENFJ型的人有条理性，他们有时会对事实判断错误，不能意识到自己的非逻辑性。当他们的梦想脱离现实时，
                        其他人可能认为他们充满怪想、神神秘秘。INFP型的人应该很好地向更现实的人请教，他们的理想在现实世界中是否可行和有用。
                        因为INFP型的人如此坚信自己的理想，所以他们常常忽视其他观点的作用，而且有时会很刻板。他们对于物质环境不十分有兴趣，
                        他们经常很忙碌以至于没有注意周围正在发生的变化。
                        INFP型的人对于一种想法的酝酿要比实际中开始一个计划所需要的时间长很多。他们完美主义的倾向导致他们长久的精炼思想而
                        从来没有分享过它们。这是很危险的，因为对于INFP型的人，更要的是寻找表达他们思想的途径。为了避免沮丧，他们需要使工
                        作变得更重视行动。
                        INFP型的人很情绪化地陷于自己的工作中，所以对于批评很敏感，更加复杂的是，当他们追求自己不可能有的高标准时，往往对
                        自己的要求太多。即使事实上他们能够完成许多事情，但仍会导致情感上的不满足。当INFP型的人失望时，往往对于他们周围所
                        有的事物都很对立。努力发展他们的计划客观性会有助于防止INFP型的人更少地受批评与失望的影响。
                        因为INFP型的人往往努力让许多人同时高兴，所以让他们坚持一种不受欢迎的立场是很困难的。对于批评别人，他们感到犹豫
                        不决，也很少会说“不”。当INFP型的人对于一些想法和计划没有表达他们的相反意见时，其他人会误以为INFP型的人同意他们
                        的观点。INFP型的人需要培养更多的敢做敢为的信心，才能学会在必要的时候对他人提出诚恳的批评。
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>4、个人优劣势分析</p>
                    </div>
                    <div className="classify-image m-b-25">
                        <img src={`//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_superiority.png?x-oss-process=image/resize,m_fill,w_90,h_31`} />
                        <div className="line"></div>
                    </div>
                    <p className="abstract">
                        对于不同的人格类型和不同的动力等极而言，没有“好”与“坏”之分，每一个人都是一个独一无二的个体，都有其特别的优势和劣势，但问题的关键在于如何认识这些优势和劣势,完善自己。我们对于成功的建议是：“取已之长，补已之短”。学会了这一点将会影响到你的成败及你对工作的喜好，你在工作中的优势是：
                    </p>
                    <div className="detail">
                        <p>*考虑周到细致且能集中注意力深入某个问题或观点</p>
                        <p>*渴望打破常规思考，并考虑新的可能情况</p>
                        <p>*积极投身于所信仰的事业</p>
                        <p>*必要时一个人也能很好地工作</p>
                        <p>*对收集所需信息有一种天生的好奇与技巧</p>
                        <p>*能通观全局以及看到意识与行为之间的联系</p>
                        <p>*能洞察别人的需要与动机</p>
                        <p>适应能力强，能很快改变你的行事速度及目标</p>
                        <p>在一对一的基础上很极好地与人工作</p>
                    </div>
                </div>
            </div>
            <div className="page-box">
                <div className="classify-detail">
                    <div className="classify-image m-b-25">
                        <img src={`//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_inferiority.png?x-oss-process=image/resize,m_fill,w_90,h_31`} />
                        <div className="line"></div>
                    </div>
                    <p className="abstract">
                        下面列出了你工作中可能存在的缺点，这些缺点有的比较明显，有的并不明显或你没有意识到，目的是为了让你“注意”到它们，并考虑产生的原因。缺点有些是天生的，而有些是长时间形成的，因此你不可能在一两天内改变，而是去提醒、思考。注意：其实知道存在的问题就是改变提高中很重要的一步，你会发现你正在慢慢发生变化。您工作中的劣势：
                    </p>
                    <div className="detail">
                        <p>*必须控制方案/计划，否则你可能会失去兴趣</p>
                        <p>*有变得无秩序性的倾向，很难把握优先处理的事</p>
                        <p>*不愿做与自己价值观相冲突的工作</p>
                        <p>*在做事方式上不愿按照传统方式</p>
                        <p>*天生的理想主义，这样可能使你得不到现实的期望</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>5、适合的岗位特质</p>
                    </div>
                    <p className="abstract">
                        研究发现：职业满足会使你的工作主动性更强，积极性更高，更愿意去工作。以下不是简单的告诉你什么样的工作适合你，而是细化的帮你分析工作中的哪些特质对你重要，你还需要从中选出你认为最重要的，
                        因为不同经历的人对特质的重要程度要求是不同的。每个岗位的工作内容都在随企业的发展而发展，
                        不是一成不变的，有时候岗位的发展方向需要我们自己去争取。所以找到适合的工作不如找到适合自己发展的岗位更直接。这些特质可以帮助明确如何主动的发展或争取你岗位中的那些特质。
                        下面的条目从各个侧面上认证了您怎样才能受到真正的职业满足，看完这些条目之后，我们建议您根据它们对您的重要程序进行排序，排序的时候，回想一下您过去的学习、工作经历以及当前学习环境和工作
                        感受，并思考：“哪一些是令你感到特别满意，有哪些令你极其不高兴”。试着寻找贯穿这些经历的主题。
                    </p>
                    <div className="detail">
                        你的岗位特质：作为INFP型人，职业满足意味着你做的这些工作：
                        1、我的工作与我个人的价值观和信仰相一致，同时允许我通过工作表达我的想象力。
                        2、给我时间发展我的想法到相当深度，同时对这一思维过程以及思维产物操持控制权。
                        3、独立完成工作，有一个私人的工作空间以及大量不受干扰的时间，但必须有机会与我敬重的人交流一下观点。
                        4、我的工作环境是一个灵活性强的组织机构，其中繁琐的规章制度减至最少限度，同时允许我有灵感时工作。
                        5、我要在一个合作的环境中与别的有创造力的、讨人喜欢的人一起工作，且这个工作环境没有紧张的人际关系以及人际纠纷。
                        6、允许我表达我别出心裁的观点，而且在工作中个人的发展受到鼓励与夸奖。
                        7、不要要求我经常在大群人面前介绍我的工作，或者在我的工作还没有完成至我满意之前让我与大家分享。
                        8、愿意帮助别人成长、发展以及实现他们所有的潜能。
                        9、我的工作包括理解别人以及发掘他们行为的动机，允许我发展与别人一对一的深厚关系。
                        10、允许我为实现我的理想而工作，且工作上不要受到政治的、经济的或别的方面的障碍的限制。
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>6、适合的职位类型</p>
                    </div>
                    <p className="abstract">
                        也许你会觉得下面的工作种类繁杂，但仔细分析你就会发现，这些工作各自的特色正是你对工作的要求，我们会在下面列出各类工作的特质。当然，这不可能是一个完美的适合你的工作的综合，但是，却能够向你展示你以前不曾考虑过的工作的可能性。在列出这些工作的同时，我们也要敬告您：每种职业中都有各种性格类型的成功人士；即使是相同的工作，不同公司的要求也不尽相同，所以除了工作名称外，你还要对贵公司要求的工作内容和公司文化作详细的了解。我们希望在经济快速发展、新型工作不断涌现将来，这份报告上列举的工作种类不是限制了你的选择，而是告诉你，面对新工作的选择或机会时，应该从哪些因素来分析这些工作对你的适合程度。
                    </p>
                    <p className="profession">
                        <span>以下是适合</span>
                        <span className="name">{resultDetail.resultType}</span>
                        <span>一般职业：</span>
                    </p>
                    <div className="profession-detail">
                        <h3> 政治家、 行政管理人员、 政治分析家、 社会科学家 </h3>这些职业能让ENTP们充分利用他们的思想学识和老练的处世经验， 在气氛紧张的、 快节奏的、 有权力的政治领域发挥他们的才干。 ENTP天生具有看到事务发展趋势、 主题和变化方向的能力， 而且能够适应这些变化。 ENTP型的人有很强的权力欲望。他们喜欢与各种不同的人在一起工作。 政治生涯需要他们那种有意识地结交朋友并迅速建立友好关系的能力。 ENTP型的人喜欢在公众面前讲话， 他们都是杰出的演讲家。 他们能够利用华丽的、 滔滔不绝的语言来表现他们丰富的想象力。计划和开发性质的工作要求人们有广阔的视野、 预测事物发展趋势的能力以及系统地提出并创造性地阐释开发计划的能力。ENTP喜欢做战略策划类的工作， 因为这类工作允许他们只要想出创新性方法即可， 然后把具体工作交给别人去做。市场、 广告和公共关系领域使ENTP能与其他富有创造性的在一起工作， ENTP可以开发他们创造性的思想， 并以令人兴奋的方式去实施这些想法。 ENTP喜欢公共关系和广告领域快节奏的、 富有诱惑力的世界。在这里他们可以充分发挥自己的魅力和与人相处的技巧， 来推销他们的思想和观点。 市场调查需要ENTP运用他们预测事务发展趋势的能力， 同时市场调查也刺激和满足了他们无止境的好奇心和活跃的想象力。ENTP天生就是企业家， 这类职业需要ENTP具有创立一个全新的、 自由的、 不断发展变化的工作环境的能力， 这些职业经常需要与很多人打交道， 要求能创造新的观念和方法， 要求能以一种全新的方式进行思考。而且还会涉及到大量的冒险行为。 这些职业中涉及到的计划、 方案经常是大规模的、 需要大量的资金和有能力有影响的人们的参与。 注意： 这些职业只是能给具有独一无二、 与生俱来的才能的ENTP带来职业满足感。
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>7、对组织的贡献</p>
                    </div>
                    <div className="detail m-b-77">
                        <p>*将限制视作要克服的挑战；</p>
                        <p>*关注新的发展可能性并能够提出新的做事方式；</p>
                        <p>*善于启发并激励他人；</p>
                        <p>*喜欢复杂的挑战。</p>
                    </div>
                </div>
            </div>
            <div className="page-box">
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>8、领导风格</p>
                    </div>
                    <div className="detail m-b-77">
                        <p>*鼓励他人的独立性；</p>
                        <p>*强调逻辑性的系统思考；</p>
                        <p>*对想做的事使用强制性理由；</p>
                        <p>*能够充当人员与组织系统间的催化剂角色。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo">
                        {/* <img src="https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" alt=""/>
                        <span className="name">趣测评</span> */}
                    </div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>9、潜在缺陷</p>
                    </div>
                    <div className="warn-detail m-b-77">
                        <div className="left">
                            <p>*对日常的工作不太关注；</p>
                            <p>*有时缺乏一定的坚持性和持久性；</p>
                            <p>*不太愿意接受他人的支持和帮助；</p>
                            <p>*过分扩张自己；</p>
                            <p>*可能与组织中标准的规范和程序不相适应。</p>
                        </div>
                        <div className="right">
                            <img src={'//qzz-static.forwe.store/evaluation-mng/imgs/qcp_pdf_warn.png?x-oss-process=image/resize,m_fill,w_91,h_91'} alt="警告" />
                        </div>
                    </div>
                </div>
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>10、适合工作环境</p>
                    </div>
                    <div className="detail m-b-77">
                        <p>*善于解决复杂问题的独立工作的同事；</p>
                        <p>*灵活而富于挑战性；</p>
                        <p>*变化取向；</p>
                        <p>*有能力的人；</p>
                        <p>*奖励冒风险；</p>
                        <p>*鼓励自主性；</p>
                        <p>*不官僚；</p>
                        <p>*在实现目标后有及时的支持和奖励。</p>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo">
                        {/* <img src="https://qzz-static.forwe.store/public-assets/qcp-logo.png?x-oss-process=image/resize,m_fill,w_24,h_24" alt=""/>
                        <span className="name">趣测评</span> */}
                    </div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="page-title">
                    五、个人发展建议
                </div>
                <div className="classify-detail m-t-34">
                    <p className="abstract">
                        现在你对自己的人格类型和动力已经有了一个比较清楚的了解，但这还不够。“如何通过这些信息使你在这份工作上取得更大的成功”，这是关键所在。运用你的能力非常容易，你成功的秘诀在于：
                    </p>
                    <div className="detail m-b-34">
                        <p>避免产生太多可供选择的项目，导致你难以做出取舍；</p>
                        <p>关心别人的感觉和想法，避免被别人认为你很傲慢、无理；</p>
                    </div>
                    <p className="abstract">
                        个人发展建议是我们咨询师多年测评职业咨询和职业生涯规划的心得体会和经验总结，我们意识到以下的建议中有很多是难以完全照办的，但只要你花时间认真思考，一定会对你有极大的帮助和改变。发展建议：
                    </p>
                    <div className="detail m-b-77">
                        <p>有时需要当机立断，避免拖延，不然，容易错失机会；</p>
                        <p>学会倾听，在对方表达完观点之后，再提出自己的想法和主意；</p>
                        <p>设定必要的期限，合理安排自己的时间，如果无法按时完成，也要提前告知相关人。</p>
                    </div>
                </div>
            </div>
            <div className="page-box">
                <div className="history-people">
                    <div className="header">
                        <p className="line"></p>
                        <p className="title">历史名人</p>
                        <p className="line"></p>
                    </div>
                    <div className="content">
                        <p>苏格拉底（公元前469年/470年—前399年）思想家、哲学家、教育家</p>
                        <p>阿基米德（公元前287年—前212年）哲学家、科学家、数学家、物理学家</p>
                        <p>布丽吉特·马克龙（1953年4月13日）法国第一夫人</p>
                        <p>杰弗里·爱泼斯坦（1953年—2019年8月9日）企业家</p>
                        <p>马克·扎克伯格（1984年5月14日）企业家</p>
                        <p>梅艳芳（1963年10月10日）歌手、演员</p>
                        <p>张曼玉（1964年9月20日）演员、歌手</p>
                        <p>巩俐（1965年12月31日）演员</p>
                    </div>
                </div>
            </div>
        </div>
    );
}));
ExportPdfDetailMBTIHTML.displayName = 'ExportPdfDetailMBTIHTML'
export default ExportPdfDetailMBTIHTML;