import { useEffect, useState } from "react"



function useLocalState(defaultValue, key) {
    const [value, setValue] = useState(() => {
        const localStorageValue = localStorage.getItem(key);
        return localStorageValue !== null ? JSON.parse(localStorageValue) : defaultValue;
    });

    useEffect(() => {
        console.log( JSON.stringify(value));
        localStorage.setItem(key, JSON.stringify(value))
    }, [key,value]);

    return [value, setValue];
}

export {useLocalState};