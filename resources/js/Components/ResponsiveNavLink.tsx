import { InertiaLinkProps, Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}: InertiaLinkProps & { active?: boolean }) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 font-mono text-sm font-bold uppercase tracking-wider ${
                active
                    ? 'border-neo-orange bg-neo-sand text-neo-charcoal'
                    : 'border-transparent text-neo-charcoal/60 hover:border-neo-charcoal/30 hover:bg-neo-sand hover:text-neo-charcoal'
            } transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
