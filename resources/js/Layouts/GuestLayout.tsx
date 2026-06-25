import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-neo-sand p-6 text-neo-charcoal">
            <div className="mb-6">
                <Link href="/" className="flex items-center gap-2">
                    <span className="font-sans text-3xl font-black uppercase tracking-tighter border-4 border-neo-charcoal bg-neo-orange text-white px-4 py-2 shadow-neo">
                        PDA
                    </span>
                </Link>
            </div>

            <div className="w-full max-w-md bg-white border-4 border-neo-charcoal p-8 shadow-neo-lg rounded-none">
                {children}
            </div>
        </div>
    );
}
