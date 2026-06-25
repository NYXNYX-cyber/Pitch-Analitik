import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active: boolean }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-4 px-1 pt-1 font-mono text-sm font-bold uppercase tracking-wider transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-neo-orange text-neo-charcoal'
                    : 'border-transparent text-neo-charcoal/60 hover:border-neo-charcoal/30 hover:text-neo-charcoal') +
                className
            }
        >
            {children}
        </Link>
    );
}
