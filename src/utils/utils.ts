export const debounce = (fn: Function, time: number) => {
    let timer: any;
    return function () {
        timer && clearTimeout(timer)
        timer = setTimeout(() => {
            fn.apply(this, arguments)
        }, time)
    }
}