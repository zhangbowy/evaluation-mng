import { createContext, Dispatch, SetStateAction } from "react";

interface ContextProps {
    state: boolean;
    dispatch: Dispatch<SetStateAction<boolean>>;
}

// 是否收起的context
export const MyContext = createContext({} as ContextProps);
// 传递可用点券
export const CountContext = createContext({} as { state: number, dispatch: () => void });