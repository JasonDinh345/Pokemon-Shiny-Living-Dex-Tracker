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
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                    stroke="currentColor"
                    className="size-6 text-primary hover:text-black duration-100 ease-in absolute top-2 right-2 "
                    onClick={handleExit}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

                {children}
            </motion.div>
        </motion.div>
    );
}
