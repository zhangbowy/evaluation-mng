import { Button, Divider,Modal, Tabs } from 'antd';
import React, { forwardRef, Fragment, memo, useEffect, useImperativeHandle} from 'react';
import './index.less';
import print from "@/utils/print";
import { MBTIResult, MBTIType, MBTISimpel, chartHeight, Gender } from './type';

const PdfDetailMBTI = memo(forwardRef((props: any, ref)=>{
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
            } else if (value < 30 && value > 10 ) {
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
    const buildPdfFile = () => {
        console.log(2112);
    }

    const fnLineChart = function (eles: any) {
        const oldEle = eles;
        [].slice.call(eles).forEach(function (ele: any, index) {
            var eleNext = oldEle[index + 1];
            if (!eleNext) { return;  }
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
            eleLine.style.msTransform = 'rotate('+ radius +'rad)';
            eleLine.style.transform = 'rotate('+ radius +'rad)';
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
        <div id="Pdf_Body" className="pdfdetail-layout" style={childStyle}>
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
                    <img src={'/public-assets/cover-qcp.png'} alt=""/>
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
                        <img src={`/public-assets/measurement-type.png?x-oss-process=image/resize,m_fill,w_282,h_254`} alt=""/>
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
                <div className="article-table">
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
            </div>
            {/* 分页 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
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
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className="page-title mg-b">
                    二、测评结果分析
                </div>
                {/* <div className="result-box"> */}
                    {/* <div className="left">
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
                    </div> */}
                    {/* <div className="right">
                        <div className="result-list">
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">外向(E):{resultDetail?.scoreDetail?.E?.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-1" 
                                            style={{width: `${resultDetail?.scoreDetail?.E?.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">内向(I):{resultDetail?.scoreDetail?.I.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-1" 
                                            style={{width: `${resultDetail?.scoreDetail?.I.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">感觉(S):{resultDetail?.scoreDetail?.S.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-2" 
                                            style={{width: `${resultDetail?.scoreDetail?.S.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">直觉(N):{resultDetail?.scoreDetail?.N.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-2" 
                                            style={{width: `${resultDetail?.scoreDetail?.N.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">思考(T):{resultDetail?.scoreDetail?.T.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-3" 
                                            style={{width: `${resultDetail?.scoreDetail?.T.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">情感(F):{resultDetail?.scoreDetail?.F.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-3" 
                                            style={{width: `${resultDetail?.scoreDetail?.F.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                            <div className="result-item">
                                <div className="in">
                                    <div className="label">判断(J):{resultDetail?.scoreDetail?.J.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-4" 
                                            style={{width: `${resultDetail?.scoreDetail?.J.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                                <div className="out">
                                    <div className="label">知觉(P):{resultDetail?.scoreDetail?.P.score}</div>
                                    <div className="pillar-box">
                                        <div className="percent color-4" 
                                            style={{width: `${resultDetail?.scoreDetail?.P.fullScore}%`}}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                {/* </div> */}
                <div className="result-detail">
                    <div className="result-detail-item">
                        <p className="title">能量来源（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr?.[0]}:{resultDetail?.examTemplateArr?.[0] && (MBTISimpel as any)[resultDetail?.examTemplateArr[0]]}）</p>
                        <div className="result-detail-box">
                            <p><em>外向(E):{resultDetail?.scoreDetail?.E?.score}</em>他人激励型，关注外部世界的人和事，乐意与人交往。</p>
                            <p><em>内向(I):{resultDetail?.scoreDetail?.I?.score}</em>自我或记忆激励型，关注思想、记忆、情感，倾向于自省。</p>
                        </div>
                    </div>
                    <div className="result-detail-item">
                        <p className="title">信息接收（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[1]}:{resultDetail?.examTemplateArr?.[1] && (MBTISimpel as any)[resultDetail?.examTemplateArr[1]]}）</p>
                        <div className="result-detail-box">
                            <p><em>感觉(S):{resultDetail?.scoreDetail?.S.score}</em>倾向于当前发生的事，关注由五官感觉获取的具体信息。</p>
                            <p><em>直觉(N):{resultDetail?.scoreDetail?.N.score}</em>倾向于未来可能的和潜在的事，关注事物的整体和发展变化趋势。</p>
                        </div>
                    </div>
                    <div className="result-detail-item">
                        <p className="title">信息处理（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[2]}:{resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[2]]}）</p>
                        <div className="result-detail-box">
                            <p><em>思考(T):{resultDetail?.scoreDetail?.T.score}</em>重视事物之间的逻辑关系，喜欢通过客观分析作决定评价、解决问题。</p>
                            <p><em>情感(F):{resultDetail?.scoreDetail?.F.score}</em>以自己和他人的感受为重，将自己的主观价值观作为判定标准。</p>
                        </div>
                    </div>
                    <div className="result-detail-item">
                        <p className="title">行动方式（{resultDetail?.examTemplateArr && resultDetail?.examTemplateArr[3]}:{resultDetail?.examTemplateArr && (MBTISimpel as any)[resultDetail?.examTemplateArr[3]]}）</p>
                        <div className="result-detail-box">
                            <p><em>判断(J):{resultDetail?.scoreDetail?.J.score}</em>喜欢根据信息来做判断、计划和决定，愿意进行管理和控制，希望生活井然有序</p>
                            <p><em>知觉(P):{resultDetail?.scoreDetail?.P.score}</em>喜欢以自己的理解和信息做决策，灵活、试图去理解、适应环境,倾向于留有余地，喜欢宽松自由的生活方式。</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className="result-analyse">
                    <div className="left">
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.E?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.S?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.T?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.J?.fullScore}%`}}></div>
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
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.I?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.N?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.F?.fullScore}%`}}></div>
                        <div className="result-analyse-item" style={{width: `${resultDetail?.scoreDetail?.P?.fullScore}%`}}></div>
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
                <div className="page-top mg-b">
                    <div className="logo"></div>
                </div>
                <div className="tag-line">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>能力标签分析</p>
                    </div>
                    <div className="tag-apply-chart">
                        <div className="tag-chart" id="chartX">
                            <div className="result-xy">
                                <div className="result-bg" data-month="忠诚度">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['忠诚度']]}`}}
                                    ><s title="8.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="责任心">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['责任心']]}`}}
                                    ><s title="2.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="创新力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['创新力']]}`}}
                                    ><s title="3.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="耐心程度">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['耐心程度']]}`}}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="洞察力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['洞察力']]}`}}
                                    ><s title="5.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="分析能力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['分析能力']]}`}}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="适应能力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['适应能力']]}`}}
                                    ><s title="7.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="抗压能力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['抗压能力']]}`}}
                                    ><s title="6.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="沟通能力">
                                    <span className="result-bar" 
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['沟通能力']]}`}}
                                    ><s title="4.4"></s></span>
                                </div>
                                <div className="result-bg" data-month="判断能力">
                                    <span className="result-bar"
                                        style={{height: `${resultDetail?.htmlDesc && (chartHeight as any)[resultDetail?.htmlDesc?.ability['判断能力']]}`}}
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
                            <img src={`/evaluation-mng/imgs/qcp_pdf_up.png?x-oss-process=image/resize,m_fill,w_21,h_41`} />
                            <img src={`/evaluation-mng/imgs/qcp_pdf_down.png?x-oss-process=image/resize,m_fill,w_21,h_41`} />
                        </div>
                    </div>
                </div>
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
                                            <p>{it.sort === resultDetail?.htmlDesc?.abilityList[index+1].sort ? '=' : '>'}</p>
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
                <div className="page-top mg-b">
                    <div className="logo"></div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="page-title">
                    三、四维人格倾向解读
                </div>
                <div className="personality-title">
                    <p className="diamond"></p>
                    <p className="title">您的四维人格倾向（偏好）详解如下</p>
                </div>
                <div className="personality-line"></div>
                <div className="personality-detail">
                    <div className="header">
                        E-I维度：{resultDetail?.htmlDesc?.dimensional.el.name}
                    </div>
                    <div className="content">
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">主要特点</p>
                            </div>
                            <div className="item-content">
                                <div className="left">
                                    {resultDetail?.htmlDesc?.dimensional.el.data}
                                </div>
                                <div className="right">
                                    <img src={`${resultDetail?.htmlDesc?.dimensional.el.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">优点</p>
                            </div>
                            <div className="item-content">
                                {resultDetail?.htmlDesc?.dimensional.el.advantage}
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">缺点</p>
                            </div>
                            <div className="item-content">
                                {resultDetail?.htmlDesc?.dimensional.el.shortcoming}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* 分页结束 */}
            <div className="page-box">
                <div className="page-top mg-b">
                    <div className="logo"></div>
                    {/* <div className="title">职业性格特质测评-sample</div> */}
                </div>
                <div className="personality-detail">
                    <div className="header">
                        S-N维度：{resultDetail?.htmlDesc?.dimensional.sn.name}
                    </div>
                    <div className="content">
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">主要特点</p>
                            </div>
                            <div className="item-content">
                                <div className="left">
                                {resultDetail?.htmlDesc?.dimensional.sn.data}
                                </div>
                                <div className="right">
                                    <img src={`${resultDetail?.htmlDesc?.dimensional.sn.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">优点</p>
                            </div>
                            <div className="item-content">
                            {resultDetail?.htmlDesc?.dimensional.sn.advantage}
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">缺点</p>
                            </div>
                            <div className="item-content">
                                {resultDetail?.htmlDesc?.dimensional.sn.shortcoming}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="personality-detail">
                    <div className="header">
                        T-F维度：{resultDetail?.htmlDesc?.dimensional.tf.name}
                    </div>
                    <div className="content">
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">主要特点</p>
                            </div>
                            <div className="item-content">
                                <div className="left">
                                {resultDetail?.htmlDesc?.dimensional.tf.data}
                                </div>
                                <div className="right">
                                    <img src={`${resultDetail?.htmlDesc?.dimensional.tf.jpg}?x-oss-process=image/resize,m_fill,w_150,h_71`} alt="图片" />
                                </div>
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">优点</p>
                            </div>
                            <div className="item-content">
                            {resultDetail?.htmlDesc?.dimensional.tf.advantage}
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">缺点</p>
                            </div>
                            <div className="item-content">
                            {resultDetail?.htmlDesc?.dimensional.tf.shortcoming}
                            </div>
                        </div>
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
                <div className="personality-detail">
                    <div className="header">
                        J-P维度：{resultDetail?.htmlDesc?.dimensional.jp.name}
                    </div>
                    <div className="content">
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">主要特点</p>
                            </div>
                            <div className="item-content">
                                <div className="left">
                                {resultDetail?.htmlDesc?.dimensional.jp.data}
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
                            {resultDetail?.htmlDesc?.dimensional.jp.advantage}
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-header">
                                <p className="diamond"></p>
                                <p className="title">缺点</p>
                            </div>
                            <div className="item-content">
                            {resultDetail?.htmlDesc?.dimensional.jp.shortcoming}
                            </div>
                        </div>
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
                    四、MBTI人格类型解读
                </div>
                <div className="classify-explain">
                    <span>您的人格类型是：</span>
                    <span className="title">{resultDetail.resultType}(内向+直觉+情感+知觉) </span>
                    <span>，详解如下：</span>
                </div>
                <div className="personality-line"></div>
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>1、典型特征画像</p>
                    </div>
                    <div className="content">
                        <div className="left">
                            {
                                resultDetail?.htmlDesc?.personality?.portrait.map((it: string) => (
                                    <div className="list" key={it}>
                                        <div className="circle"></div>
                                        <p>{it}</p>
                                    </div>
                                ))
                            }
                            
                        </div>
                        <div className="right">
                            <p className="production">{resultDetail?.htmlDesc?.personality?.portraitPhoto?.desc}</p>
                            <div className="image">
                                <img src={`${resultDetail?.htmlDesc?.personality?.portraitPhoto?.jpg}?x-oss-process=image/resize,m_fill,w_119,h_180`} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="classify-detail">
                    <div className="title">
                        <p className="diamond"></p>
                        <p>2、人格特征</p>
                    </div>
                    <div 
                        className="detail" 
                        dangerouslySetInnerHTML={{
                            __html: resultDetail?.htmlDesc?.personality?.features,
                        }}
                    ></div>
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
                        <p>3、可能存在的盲点</p>
                    </div>
                    <div 
                        className="detail"
                        dangerouslySetInnerHTML={{
                            __html: resultDetail?.htmlDesc?.personality?.spot,
                        }}
                    ></div>
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
                        <p>4、个人优劣势分析</p>
                    </div>
                    <div className="classify-image m-b-25">
                        <img src={`/evaluation-mng/imgs/qcp_pdf_superiority.png?x-oss-process=image/resize,m_fill,w_90,h_31`} />
                        <div className="line"></div>
                    </div>
                    <p className="abstract">
                        对于不同的人格类型和不同的动力等极而言，没有“好”与“坏”之分，每一个人都是一个独一无二的个体，都有其特别的优势和劣势，但问题的关键在于如何认识这些优势和劣势,完善自己。我们对于成功的建议是：“取已之长，补已之短”。学会了这一点将会影响到你的成败及你对工作的喜好，你在工作中的优势是：
                    </p>
                    <div className="detail">
                        {
                            resultDetail?.htmlDesc?.personality?.advantage.map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
                    </div>
                    <div className="classify-image m-b-25">
                        <img src={`/evaluation-mng/imgs/qcp_pdf_inferiority.png?x-oss-process=image/resize,m_fill,w_90,h_31`} />
                        <div className="line"></div>
                    </div>
                    <p className="abstract">
                        下面列出了你工作中可能存在的缺点，这些缺点有的比较明显，有的并不明显或你没有意识到，目的是为了让你“注意”到它们，并考虑产生的原因。缺点有些是天生的，而有些是长时间形成的，因此你不可能在一两天内改变，而是去提醒、思考。注意：其实知道存在的问题就是改变提高中很重要的一步，你会发现你正在慢慢发生变化。您工作中的劣势：
                    </p>
                    <div className="detail">
                        {
                            resultDetail?.htmlDesc?.personality?.inferiority.map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
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
                    <div 
                        className="detail"
                        dangerouslySetInnerHTML={{
                            __html: `你的岗位特质：作为${resultDetail?.resultType}型人，职业满足意味着你做的这些工作：</br>${resultDetail?.htmlDesc?.personality?.position}`,
                        }}
                    >
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
                    {
                        resultDetail?.htmlDesc?.personality?.occupation.map((it: string) => (
                            <div 
                                key={it}
                                className="profession-detail"
                                style={{marginBottom: '16px'}}
                                dangerouslySetInnerHTML={{
                                    __html: it,
                                }}
                            >
                            </div>
                        ))
                    }
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
                        {
                            resultDetail?.htmlDesc?.personality?.contribution.map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
                    </div>
                </div>
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>8、领导风格</p>
                    </div>
                    <div className="detail m-b-77" >
                        {
                            resultDetail?.htmlDesc?.personality?.style.map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
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
                            {
                                resultDetail?.htmlDesc?.personality?.defect.map((it: string) => (
                                    <p key={it}>*{it}</p>
                                ))
                            }
                        </div>
                        <div className="right">
                            <img src={'/evaluation-mng/imgs/qcp_pdf_warn.png?x-oss-process=image/resize,m_fill,w_91,h_91'} alt="警告" />
                        </div>
                    </div>
                </div>
                <div className="classify-detail">
                    <div className="title m-b-25">
                        <p className="diamond"></p>
                        <p>10、适合工作环境</p>
                    </div>
                    <div className="detail m-b-77">
                        {
                            resultDetail?.htmlDesc?.personality?.environment.map((it: string) => (
                                <p key={it}>*{it}</p>
                            ))
                        }
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
                        {
                            resultDetail?.htmlDesc?.personality?.proposal?.['成功的秘诀'].map((it: string) => (
                                <p key={it}>{it}</p>
                            ))
                        }
                    </div>
                    <p className="abstract">
                        个人发展建议是我们咨询师多年测评职业咨询和职业生涯规划的心得体会和经验总结，我们意识到以下的建议中有很多是难以完全照办的，但只要你花时间认真思考，一定会对你有极大的帮助和改变。发展建议：
                    </p>
                    <div className="detail m-b-77">
                        {
                            resultDetail?.htmlDesc?.personality?.proposal?.['发展建议'].map((it: string) => (
                                <p key={it}>{it}</p>
                            ))
                        }
                    </div>
                </div>
                <div className="history-people">
                    <div className="header">
                        <p className="line"></p>
                        <p className="title">历史名人</p>
                        <p className="line"></p>
                    </div>
                    <div className="content">
                        {
                            resultDetail?.htmlDesc?.personality?.person.map((it: string) => (
                                <p key={it}>{it}</p>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}));
export default PdfDetailMBTI;
