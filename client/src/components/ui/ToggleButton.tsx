type ToggleButtonProps = {
    isToggled: boolean;
    text: string;
    handleOnClick: () => void;
};
export function ToggleButton({text, isToggled, handleOnClick}: ToggleButtonProps) {
    return (
        <div
            className={`${isToggled ? 'bg-primary  border-darkprimary text-secondary' : 'bg-secondary  border-primary '} border-2 rounded-2xl p-1 transition-colors duration-75 ease-in`}
            onClick={handleOnClick}
        >
            <p>{text}</p>
        </div>
    );
}
