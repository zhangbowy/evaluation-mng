import introJs from "intro.js"
import "intro.js/introjs.css";
import styles from './index.module.less'
import { upDateGuide } from '@/api/api'

const handleStep = async (steps: StepsType[], type: number) => {
    introJs().setOptions({
        nextLabel: '下一步',
        prevLabel: '上一步',
        doneLabel: '立即体验',
        // skipLabel: `跳过(${introJs()['introjs-instance']}/${steps.length})`,
        skipLabel: '跳过',
        hidePrev: true,
        showBullets: false,
        // showStepNumbers: true,
        exitOnOverlayClick: false,
        showStepNumbers: false,
        tooltipClass: styles.tooltipClass,
        disableInteraction: true,
        steps
    }).onexit(async () => {
        await upDateGuide({ type })
        //点击结束按钮后， 执行的事件
    }).start()
}

export { handleStep }