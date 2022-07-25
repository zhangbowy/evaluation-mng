import { useState, useRef, useEffect } from "react";

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


export const useCallbackState = (od: any) => {
    const cbRef:any = useRef();
    const [data, setData] = useState(od);

    useEffect(() => {
      cbRef.current && cbRef.current(data);
    }, [data]);

    return [
      data,
      function (d:any, callback: Function) {
        cbRef.current = callback;
        setData(d);
      }
    ];
  }
