import styles from './index.less'
const MbtiPreview = (props: any) => {
    const { resulyData } = props;
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
                resulyData?.scoreDetail[start] > resulyData?.scoreDetail[end] ||
                resulyData?.scoreDetail[start] == resulyData?.scoreDetail[end];
            switch (status) {
                case 'width':
                    return isTrue
                        ? `${resulyData?.scoreDetail[start] || 0}%`
                        : `${resulyData?.scoreDetail[end] || 0}%`;
                case 'right':
                    return isTrue ? 'auto' : 0;
            }
        }
    };
    return (
        <div className={styles.personality_layout} >
            <div className={styles.personality_main} id="personality">
                <div className={styles.character_type_wrapper}>
                    <img
                        src={resulyData?.user?.avatar}
                        alt=""
                        className={styles.character_headportrait}
                    />
                    <div className={styles.character_type_main}>
                        <div className={styles.character_type_content}>
                            <div className={styles.character_type_left}>
                                <div>{resulyData?.user?.name}</div>
                                <div>的人格类型是</div>
                                <div>
                                    {resulyData &&
                                        resulyData?.results[0]?.type
                                            ?.match(/\(.+?\)/g)[0]
                                            ?.slice(1, -1)}
                                </div>
                                <div>{resulyData?.results[0].type.slice(0, 4)}</div>
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
                                                resulyData?.scoreDetail[res?.startProgress]) ||
                                                0}
                                            %
                                        </div>
                                        <div>{res.startText}</div>
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
                                                resulyData?.scoreDetail[res.endTextProgress]) ||
                                                0}
                                            %
                                        </div>
                                        <div>{res.endText}</div>
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
                <div className={styles.trait} data-list="你的特质是">
                    <div className={styles.trait_feature_list}>
                        {resulyData?.htmlDesc?.feature.map(
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
                        {resulyData?.htmlDesc?.field.map((res: string, index: number) => (
                            <div key={index} className={styles.field_contentmain}>
                                <span></span>
                                <span>{res}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.field} data-list="你适合的职业是">
                    <div className={styles.field_feature_list}>
                        {resulyData?.htmlDesc?.profession.map(
                            (res: string, index: number) => (
                                <div key={index} className={styles.field_contentmain}>
                                    {res}
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MbtiPreview;