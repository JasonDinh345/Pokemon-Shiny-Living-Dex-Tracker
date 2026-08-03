import {InputHTMLAttributes, SelectHTMLAttributes} from 'react';

interface LabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    fieldName?: string;
    required?: boolean;
}

export function LabelInput({label, required, fieldName, ...inputProps}: LabelInputProps) {
    const updatedFieldName = (fieldName || label.replace(/\s+/g, '')).toLowerCase();

    return (
        <div className="w-full">
            <label htmlFor={updatedFieldName}>
                <h3>
                    {label}
                    {required && <span className="text-red-400"> * </span>}:
                </h3>
            </label>
            <input
                className="border-2 border-black rounded-md pl-2 w-full h-10 bg-secondary"
                id={updatedFieldName}
                name={updatedFieldName}
                {...inputProps}
            />
        </div>
    );
}
interface LabelSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    fieldName?: string;
}

export function LabelSelect({
    label,
    fieldName,
    required,
    children,
    disabled,
    ...inputProps
}: LabelSelectProps) {
    const updatedFieldName = (fieldName || label.replace(/\s+/g, '-')).toLowerCase();

    return (
        <div>
            <label htmlFor={updatedFieldName}>
                <h3>
                    <span>{label}</span>
                    {required && <span className="text-red-400"> * </span>}:
                </h3>
            </label>
            <select
                id={updatedFieldName}
                name={updatedFieldName}
                required={required}
                className={`border-2 border-black rounded-md pl-2 w-full h-10 bg-secondary ${disabled && 'opacity-50'}`}
                {...inputProps}
            >
                {children}
            </select>
        </div>
    );
}
