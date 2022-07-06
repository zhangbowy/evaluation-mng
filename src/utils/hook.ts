import { createContext, Dispatch, SetStateAction, useState } from "react";

export const useInput = () => {
    const [inputValue, setInputValue] = useState(''); // 输入框数据

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    return [inputValue, handleChange]
}

export const usePackUp = () => {
    const [isPackUp, setIsPackUp] = useState<boolean>(false)

    const onPackUpClick = (newVal: boolean) => {
        setIsPackUp(newVal)
    }
    return [isPackUp, onPackUpClick]
}
interface ContextProps {
    state: boolean;
    dispatch: Dispatch<SetStateAction<boolean>>;
}
// 是否收起的context
export const MyContext = createContext({} as ContextProps);
// 传递可用点券
export const CountContext = createContext({} as { state: number, dispatch: () => void });