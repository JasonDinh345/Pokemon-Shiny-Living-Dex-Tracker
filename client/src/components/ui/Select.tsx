import {SelectHTMLAttributes} from 'react';

export function Select({children, onChange, value, name}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            value={value}
            name={name}
            onChange={onChange}
            className="bg-secondary border-2 border-primary rounded-2xl p-1 shadow-normal"
        >
            {children}
        </select>
    );
}
