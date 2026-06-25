import {
    forwardRef,
    InputHTMLAttributes,
    useEffect,
    useImperativeHandle,
    useRef,
} from 'react';

export default forwardRef(function TextInput(
    {
        type = 'text',
        className = '',
        isFocused = false,
        ...props
    }: InputHTMLAttributes<HTMLInputElement> & { isFocused?: boolean },
    ref,
) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'border-4 border-neo-charcoal bg-white px-4 py-3 font-mono text-sm text-neo-charcoal shadow-neo transition-all placeholder:text-neo-charcoal/40 focus:border-neo-orange focus:outline-none focus:ring-0 rounded-none ' +
                className
            }
            ref={localRef}
        />
    );
});
