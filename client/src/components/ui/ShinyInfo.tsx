type ShinyInfoProp = {
    label: string;
    value: string | number;
};
export function ShinyInfo({label, value}: ShinyInfoProp) {
    return (
        <div>
            <p className="text-primary text-lg font-bold">{label}:</p>
            <p className="text-black">{value}</p>
        </div>
    );
}
