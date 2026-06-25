import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, FileText, CheckCircle2, History } from 'lucide-react';

interface PitchDeck {
    id: number;
    filename: string;
    original_name: string;
    status: string;
    results: any;
    created_at: string;
}

interface Stats {
    total: number;
    completed: number;
    processing: number;
    failed: number;
}

export default function Dashboard({ pitchDecks = [], stats }: { pitchDecks: PitchDeck[]; stats: Stats }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-sans text-2xl font-extrabold uppercase tracking-tight text-neo-charcoal">
                    User Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12 bg-neo-sand min-h-screen text-neo-charcoal">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
                    {/* Welcome Banner Card */}
                    <div className="bg-white border-4 border-neo-charcoal p-8 shadow-neo-lg rounded-none">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <h1 className="font-sans text-3xl font-black uppercase mb-2">Selamat Datang Kembali!</h1>
                                <p className="font-sans font-medium text-neo-charcoal/80">
                                    Siap untuk mengevaluasi pitch deck baru Anda hari ini? Dapatkan diagnostik mendalam secara instan.
                                </p>
                            </div>
                            <Link
                                href={route('analyzer.index')}
                                className="inline-flex items-center gap-2 border-4 border-neo-charcoal bg-neo-orange text-white font-sans text-sm font-extrabold uppercase tracking-wider px-6 py-4 shadow-neo hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neo-lg active:translate-x-0 active:translate-y-0 active:shadow-neo transition-all rounded-none"
                            >
                                Mulai Audit Baru
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>

                    {/* Stats Matrix Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <span className="font-mono text-xs font-bold text-neo-orange uppercase tracking-wider block mb-1">
                                [ Total Audit ]
                            </span>
                            <span className="font-sans text-4xl font-black block">{stats?.total ?? 0}</span>
                        </div>
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <span className="font-mono text-xs font-bold text-neo-teal uppercase tracking-wider block mb-1">
                                [ Sukses ]
                            </span>
                            <span className="font-sans text-4xl font-black block">{stats?.completed ?? 0}</span>
                        </div>
                        <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo">
                            <span className="font-mono text-xs font-bold text-neo-orange uppercase tracking-wider block mb-1">
                                [ Sedang Diproses ]
                            </span>
                            <span className="font-sans text-4xl font-black block">{stats?.processing ?? 0}</span>
                        </div>
                    </div>

                    {/* Quick Access List */}
                    <div className="bg-white border-4 border-neo-charcoal p-6 shadow-neo-lg rounded-none">
                        <h3 className="font-sans text-lg font-black uppercase border-b-2 border-neo-charcoal pb-3 mb-4">
                            [ Riwayat Audit Terakhir ]
                        </h3>
                        <div className="flex flex-col gap-3 font-mono text-sm">
                            {pitchDecks.length === 0 ? (
                                <div className="border border-neo-charcoal/20 p-4 bg-neo-sand/20 text-center font-bold text-neo-charcoal/60">
                                    Belum ada riwayat dokumen yang diunggah.
                                </div>
                            ) : (
                                pitchDecks.map((deck) => (
                                    <div key={deck.id} className="border border-neo-charcoal/20 p-4 bg-neo-sand/20 flex justify-between items-center hover:bg-neo-sand/40 transition">
                                        <div className="flex items-center gap-3">
                                            <FileText size={18} className="text-neo-orange" />
                                            <span className="font-bold">{deck.original_name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {deck.status === 'completed' && (
                                                <span className="bg-neo-teal text-white border border-neo-charcoal px-2 py-0.5 text-xs font-bold uppercase shadow-neo">
                                                    Selesai
                                                </span>
                                            )}
                                            {(deck.status === 'pending' || deck.status === 'processing') && (
                                                <span className="bg-neo-orange text-white border border-neo-charcoal px-2 py-0.5 text-xs font-bold uppercase shadow-neo animate-pulse">
                                                    Diproses
                                                </span>
                                            )}
                                            {deck.status === 'failed' && (
                                                <span className="bg-red-500 text-white border border-neo-charcoal px-2 py-0.5 text-xs font-bold uppercase shadow-neo">
                                                    Gagal
                                                </span>
                                            )}
                                            <span className="text-xs text-neo-charcoal/60">
                                                {new Date(deck.created_at).toLocaleDateString('id-ID')}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}