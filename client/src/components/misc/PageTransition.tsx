'use client';

import {motion} from 'framer-motion';
import {usePathname} from 'next/navigation';

export default function PageTransition({children}: {children: React.ReactNode}) {
    const pathname = usePathname();

    return (
        <motion.div
            key={pathname}
            className="flex flex-1 flex-col w-full min-h-0"
            initial={{opacity: 0.5, y: 0}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.25}}
        >
            {children}
        </motion.div>
    );
}
