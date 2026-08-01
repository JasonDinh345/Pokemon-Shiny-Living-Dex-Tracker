import {motion} from 'framer-motion';

export function Modal({children, handleExit}: {children: React.ReactNode; handleExit: () => void}) {
    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
        >
            <motion.div
                className="relative rounded-lg bg-white p-6 border-primary border-4 shadow-[4px_5px_3px_black]"
                initial={{scale: 0.95}}
                animate={{scale: 1}}
                exit={{scale: 0.95}}
            >
                <p onClick={handleExit} className="absolute top-0 right-2 ">
                    x
                </p>
                {children}
            </motion.div>
        </motion.div>
    );
}
