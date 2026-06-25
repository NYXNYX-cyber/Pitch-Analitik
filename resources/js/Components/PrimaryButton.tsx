import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center border-4 border-neo-charcoal bg-neo-orange px-6 py-3 font-sans text-sm font-extrabold uppercase tracking-wider text-white shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo transition-all disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-neo rounded-none ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
