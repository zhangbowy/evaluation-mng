import { useState } from "react";

export const useInput = () => {
    const [inputValue, setInputValue] = useState(''); // 输入框数据

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    }
    return [inputValue, handleChange]
}

