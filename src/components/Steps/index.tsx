import introJs from "intro.js"
import "intro.js/introjs.css";
import styles from './index.less'

const handleStep = async (steps: stepsType[]) => {
    introJs().setOptions({
        nextLabel: '下一步',
        prevLabel: '上一步',
        doneLabel: '立即体验',
        skipLabel: '跳过',
        hidePrev: true,
        showBullets: false,
        exitOnOverlayClick: false,
        tooltipClass: styles.tooltipClass,
        steps
    }).oncomplete(() => {
        //点击跳过按钮后执行的事件
    }).onexit(() => {
        //点击结束按钮后， 执行的事件
    }).start()
}

export { handleStep }