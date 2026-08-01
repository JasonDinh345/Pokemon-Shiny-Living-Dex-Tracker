import {useEffect, useState} from 'react';

interface LabelInputProps {
    type: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
    value?: string;
    fieldName?: string;
    pattern?: string;
    autocomplete?: string;
}

export function LabelInput({
    type,
    onChange,
    label,
    value,
    fieldName,
    pattern,
    autocomplete
}: LabelInputProps) {
    const updatedFieldName = (fieldName || label.replace(/\s+/g, '')).toLowerCase();

    return (
        <div>
            <label htmlFor={updatedFieldName}>
                <h3>{label}:</h3>
            </label>
            <input
                className="border-2 border-black rounded-md pl-2 w-full h-10 bg-secondary"
                id={updatedFieldName}
                name={updatedFieldName}
                type={type}
                onChange={onChange}
                value={value ?? ''}
                {...(pattern ? {pattern} : {})}
                required
                autoComplete={autocomplete || ''}
            />
        </div>
    );
}
