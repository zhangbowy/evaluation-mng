import styles from './index.module.less'
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { Fragment, useState } from 'react';

const MbtiPreview = (props: any) => {
    const { resulyData } = props;
    const [isOpen, setIsOpen] = useState(false); // 是否展开
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
    // 返回大的进度条
    const isLeftProgress = (start: string, end: string, status: string): any => {
        if (resulyData?.scoreDetail) {
            const isTrue =
                resulyData?.scoreDetail[start]?.fullScore >
                resulyData?.scoreDetail[end]?.fullScore ||
                resulyData?.scoreDetail[start]?.fullScore ==
                resulyData?.scoreDetail[end]?.fullScore;
            switch (status) {
                case 'width':
                    return isTrue
                        ? `${resulyData?.scoreDetail[start]?.fullScore || 0}%`
                        : `${resulyData?.scoreDetail[end]?.fullScore || 0}%`;
                case 'right':
                    return isTrue ? 'auto' : 0;
            }
        }
    };
    // 是否展开
    const handleIsOpen = () => {
        const arr =
            resulyData?.htmlDesc?.celebrity?.length > 5
                ? resulyData?.htmlDesc?.celebrity?.slice(0, 5)
                : resulyData?.htmlDesc?.celebrity;
        return isOpen ? resulyData?.htmlDesc?.celebrity : arr;
    };
    // 是否展开
    const onOpenClick = () => {
        setIsOpen(!isOpen);
    };
    return (
        <div className={styles.personality_layout} >
            <div className={styles.character_type_layout} >
                <div className={styles.character_type_wrapper}>
                    {
                        resulyData?.user?.avatar ?
                            <img
                                src={resulyData?.user?.avatar}
                                alt=""
                                className={styles.character_headportrait}
                            /> :
                            <div className={styles.character_headportrait}>{resulyData?.user?.name.slice(0, 1)}</div>
                    }
                    <div className={styles.character_type_main}>
                        <div className={styles.character_type_content}>
                            <div className={styles.character_type_left}>
                                <div>{resulyData?.user?.name}</div>
                                <div>的人格类型是</div>
                                <div>
                                    {resulyData?.results[0] &&
                                        resulyData?.results[0]?.type?.match(/\(.+?\)/g) &&
                                        resulyData?.results[0]?.type
                                            ?.match(/\(.+?\)/g)[0]
                                            ?.slice(1, -1)}
                                </div>
                                <div>{resulyData?.results[0]?.type.slice(0, 4)}</div>
                                <div>人群中大约有</div>
                                <div>{resulyData?.textDesc}%</div>
                                <div>的人与你一样</div>
                            </div>
                            <img
                                className={styles.character_type_rightImg}
                                src={resulyData?.results[0].typeIcon}
                                alt=""
                            />
                        </div>
                        <div className={styles.progress_layout}>
                            {charactertype.map((res, index) => (
                                <div key={index} className={styles.progress_wrapper}>
                                    <div className={styles.progress_left}>
                                        <div>
                                            {(resulyData?.scoreDetail &&
                                                resulyData?.scoreDetail[res?.startProgress]
                                                    .fullScore) ||
                                                0}
                                            %
                                        </div>
                                        <div>{resulyData?.scoreDetail &&
                                            resulyData?.scoreDetail[res.startProgress]
                                                .resultType}</div>
                                    </div>
                                    <div className={styles.progress_center}>
                                        <div
                                            className={styles.progress_center_curprogress}
                                            style={{
                                                backgroundColor: res.color,
                                                width:
                                                    isLeftProgress(
                                                        res.startProgress,
                                                        res.endTextProgress,
                                                        'width',
                                                    ) || 0,
                                                right: isLeftProgress(
                                                    res.startProgress,
                                                    res.endTextProgress,
                                                    'right',
                                                ),
                                            }}
                                        />
                                    </div>
                                    <div className={styles.progress_right}>
                                        <div>
                                            {(resulyData?.scoreDetail &&
                                                resulyData?.scoreDetail[res.endTextProgress]
                                                    .fullScore) ||
                                                0}
                                            %
                                        </div>
                                        <div>{resulyData?.scoreDetail &&
                                            resulyData?.scoreDetail[res.endTextProgress]
                                                .resultType}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={styles.trait_character_list}>
                            {resulyData?.tags?.map((res: any) => (
                                <span key={res.id}>{res.name}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.personality_main} id="personality">
                <div className={styles.personality_bgCard}>
                    <header className={styles.personality_bgCard_title}>
                        <li>历史上与你相关的名人</li>
                        <li />
                    </header>
                    <ul className={styles.personality_bgCard_content}>
                        {handleIsOpen()?.map((res: any, index: number) => (
                            <li key={index}>
                                <div className={styles.serial_number}>{index + 1}</div>
                                <div className={styles.personality_bgCard_info}>
                                    <div className={styles.personality_bgCard_info_name}>
                                        {res?.name}
                                        <span>{res?.date}</span>
                                    </div>
                                    <p>{res?.position}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    {resulyData?.htmlDesc?.celebrity?.length > 5 && (
                        <footer>
                            {!isOpen ? (
                                <div onClick={onOpenClick}>
                                    展开
                                    <DownOutlined />
                                </div>
                            ) : (
                                <div onClick={onOpenClick}>
                                    收起
                                    <UpOutlined />
                                </div>
                            )}
                        </footer>
                    )}
                </div>
                <div className={styles.trait} data-list="你的特质是">
                    <div className={styles.trait_feature_list}>
                        {resulyData?.htmlDesc?.feature?.map(
                            (res: string, index: number) => (
                                <div key={index} className={styles.trait_feature_listwrapper}>
                                    <span>{index + 1}</span>
                                    <div>{res}</div>
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <div className={styles.field} data-list="你适合的领域是">
                    <div className={styles.field_feature_list}>
                        {resulyData?.htmlDesc?.field?.map((res: string, index: number) => (
                            <div key={index} className={styles.field_contentmain}>
                                <span></span>
                                <span>{res}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.field} data-list="你适合的职业是">
                    <div className={styles.field_feature_list}>
                        {resulyData?.htmlDesc?.profession?.map(
                            (res: string, index: number) => (
                                <div key={index} className={styles.field_contentmain}>
                                    {res}
                                </div>
                            ),
                        )}
                    </div>
                </div>
                <div className={styles.careerpath} data-list="你适合的职业道路是">
                    <div className={styles.field_feature_list}>
                        <div
                            className={styles.field_feature_copywriter}
                            dangerouslySetInnerHTML={{
                                __html: resulyData?.htmlDesc?.careerPath,
                            }}
                        ></div>
                    </div>
                </div>
                <div className={styles.field} data-list="你的工作习惯是">
                    <div className={styles.field_feature_list}>
                        <div
                            className={styles.field_feature_copywriter}
                            dangerouslySetInnerHTML={{
                                __html: resulyData?.htmlDesc?.workingHabit,
                            }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MbtiPreview;