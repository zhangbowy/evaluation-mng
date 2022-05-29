import { handleStep } from "@/components/Steps";
import { isGuide } from "@/services/api";

export const debounce = (fn: Function, time: number) => {
    let timer: any;
    return function () {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, time)
    }
}

export const getIsGuide = async (setsArr: stepsType[], type: number) => {
    const res = await isGuide({ type });
    if (res.code == 1) {
        if (!res.data) {
            await handleStep(setsArr, type)
        }
    }
}