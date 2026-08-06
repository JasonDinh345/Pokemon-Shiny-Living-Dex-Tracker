import toast from 'react-hot-toast';

export const successToast = (message: string, secondaryMessage?: string) => {
    toast.custom((t) => (
        <div
            className={`
                        flex items-center gap-3 rounded-lg bg-darkprimary px-4 py-3 text-white  border-2 border-black shadow-normal
                        transition-all duration-300
                        ${t.visible ? 'translate-y-2 opacity-100' : 'translate-y-0 opacity-0'}
                    `}
        >
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6 text-green-300"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                        />
                    </svg>

                    <p>{message}</p>
                </div>
                <p>{secondaryMessage}</p>
            </div>
        </div>
    ));
};

export const errorToast = (message: string, secondaryMessage?: string) => {
    toast.custom((t) => (
        <div
            className={`
                        flex items-center gap-3 rounded-lg bg-red-900 px-4 py-3 text-white  border-2 border-black shadow-normal
                        transition-all duration-300
                        ${t.visible ? 'translate-y-2 opacity-100' : 'translate-y-0 opacity-0'}
                    `}
        >
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-row justify-center items-center gap-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-6  text-red-400"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                    </svg>

                    <p>{message}</p>
                </div>
                <p>{secondaryMessage}</p>
            </div>
        </div>
    ));
};
