'use client';

import {ScreenSize} from '@/enum/ScreenSize';
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';

type ScreenSizeContextType = {
    screenSize: ScreenSize;
};
const ScreenSizeContext = createContext<ScreenSizeContextType | undefined>(undefined);

export const ScreenSizeProvider = ({children}: {children: ReactNode}) => {
    const [screenSize, setScreenSize] = useState<ScreenSize>(ScreenSize.LG);
    useEffect(() => {
        const updateScreenSize = () => {
            if (window.innerWidth >= 1024) {
                setScreenSize(ScreenSize.LG);
            } else if (window.innerWidth >= 768) {
                setScreenSize(ScreenSize.MD);
            } else {
                setScreenSize(ScreenSize.SM);
            }
        };

        updateScreenSize();
        window.addEventListener('resize', updateScreenSize);

        return () => {
            window.removeEventListener('resize', updateScreenSize);
        };
    }, []);
    return <ScreenSizeContext.Provider value={{screenSize}}>{children}</ScreenSizeContext.Provider>;
};
export const useScreenSize = () => {
    const context = useContext(ScreenSizeContext);
    if (!context) throw new Error('useScreenSize must be used within ScreenSizeProvider');
    return context;
};
